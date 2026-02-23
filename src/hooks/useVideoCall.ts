import { useRef, useState, useEffect, useCallback } from "react";

const ICE_SERVERS = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:global.stun.twilio.com:3478' }
    ]
};

export const useVideoCall = (
    socket: any,
    currentUser: any,
    otherUserId: string,
    isIncomingInitial: boolean = false,
    callerSignalInitial: any = null,
    onEndCall?: () => void
) => {
    // Media and Connection State
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [callAccepted, setCallAccepted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // UI State
    const [isIncoming, setIsIncoming] = useState(isIncomingInitial);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);

    // Refs for internal state
    const peerRef = useRef<RTCPeerConnection | null>(null);
    const signalRef = useRef<any>(callerSignalInitial);
    const streamRef = useRef<MediaStream | null>(null);
    const iceCandidatesQueue = useRef<RTCIceCandidate[]>([]); // Queue for early ICE candidates

    // Helper to cleanup media and peer
    const cleanup = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (peerRef.current) {
            peerRef.current.close();
            peerRef.current = null;
        }
        iceCandidatesQueue.current = [];
        setLocalStream(null);
        setRemoteStream(null);
        setCallAccepted(false);
        setIsIncoming(false);
    }, []);

    const endCall = useCallback(() => {
        if (otherUserId) {
            socket.emit("end_call", { to: otherUserId });
        }
        cleanup();
        if (onEndCall) onEndCall();
    }, [socket, otherUserId, cleanup, onEndCall]);

    const createPeer = useCallback((currentStream: MediaStream) => {
        const peer = new RTCPeerConnection(ICE_SERVERS);

        currentStream.getTracks().forEach(track => {
            peer.addTrack(track, currentStream);
        });

        peer.ontrack = (event) => {
            setRemoteStream(event.streams[0]);
        };

        peer.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit("ice_candidate", {
                    to: otherUserId,
                    candidate: event.candidate
                });
            }
        };

        peer.onconnectionstatechange = () => {
            if (peer.connectionState === 'disconnected' || peer.connectionState === 'failed') {
                endCall();
            }
        };

        return peer;
    }, [socket, otherUserId, endCall]);

    const initiateCall = useCallback(async (currentStream: MediaStream) => {
        try {
            const peer = createPeer(currentStream);
            peerRef.current = peer;

            const offer = await peer.createOffer();
            await peer.setLocalDescription(offer);

            socket.emit("call_user", {
                userToCall: otherUserId,
                signalData: offer,
                from: currentUser
            });
        } catch (err) {
            console.error("Error initiating call:", err);
            setError("Failed to start call");
        }
    }, [createPeer, socket, otherUserId, currentUser]);

    const answerCall = useCallback(async () => {
        const currentStream = streamRef.current;
        if (!currentStream) {
            console.error("No local stream available to answer call");
            return;
        }

        try {
            setCallAccepted(true);
            setIsIncoming(false);

            const peer = createPeer(currentStream);
            peerRef.current = peer;

            if (signalRef.current) {
                await peer.setRemoteDescription(new RTCSessionDescription(signalRef.current));

                // Flush ICE queue after setting remote description
                while (iceCandidatesQueue.current.length > 0) {
                    const candidate = iceCandidatesQueue.current.shift();
                    if (candidate) {
                        await peer.addIceCandidate(candidate);
                    }
                }
            }

            const answer = await peer.createAnswer();
            await peer.setLocalDescription(answer);

            socket.emit("answer_call", {
                signal: answer,
                to: otherUserId
            });
        } catch (err) {
            console.error("Error answering call:", err);
            setError("Failed to answer call");
        }
    }, [createPeer, socket, otherUserId]);

    const toggleAudio = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getAudioTracks().forEach(track => track.enabled = !track.enabled);
            setIsMuted(!streamRef.current.getAudioTracks()[0]?.enabled);
        }
    }, []);

    const toggleVideo = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getVideoTracks().forEach(track => track.enabled = !track.enabled);
            setIsVideoOff(!streamRef.current.getVideoTracks()[0]?.enabled);
        }
    }, []);

    // Effect to handle incoming signal updates
    useEffect(() => {
        if (callerSignalInitial) {
            signalRef.current = callerSignalInitial;
            setIsIncoming(true);
        }
    }, [callerSignalInitial]);

    // Global Socket Listeners for Signaling
    useEffect(() => {
        if (!socket) return;

        const handleCallAccepted = async (signal: any) => {
            setCallAccepted(true);
            if (peerRef.current) {
                try {
                    await peerRef.current.setRemoteDescription(new RTCSessionDescription(signal));

                    // Flush ICE queue after setting remote description (Caller Side)
                    while (iceCandidatesQueue.current.length > 0) {
                        const candidate = iceCandidatesQueue.current.shift();
                        if (candidate) {
                            await peerRef.current.addIceCandidate(candidate);
                        }
                    }
                } catch (err) {
                    console.error("Error setting remote description after accept:", err);
                }
            }
        };

        const handleIceCandidate = async (candidate: any) => {
            const peer = peerRef.current;
            const iceCandidate = new RTCIceCandidate(candidate);

            if (peer && peer.remoteDescription?.type) {
                try {
                    await peer.addIceCandidate(iceCandidate);
                } catch (err) {
                    console.error("Error adding ICE candidate:", err);
                }
            } else {
                // If remote description is not set yet, queue the candidate
                iceCandidatesQueue.current.push(iceCandidate);
            }
        };

        const handleCallEnded = () => {
            endCall();
        };

        socket.on("call_accepted", handleCallAccepted);
        socket.on("ice_candidate", handleIceCandidate);
        socket.on("call_ended", handleCallEnded);

        return () => {
            socket.off("call_accepted", handleCallAccepted);
            socket.off("ice_candidate", handleIceCandidate);
            socket.off("call_ended", handleCallEnded);
        };
    }, [socket, endCall]);

    // Main initialization effect
    useEffect(() => {
        let mounted = true;

        const start = async () => {
            try {
                // Small delay to allow previous cleanup to finish
                await new Promise(resolve => setTimeout(resolve, 100));

                if (!mounted) return;

                const currentStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

                if (!mounted) {
                    currentStream.getTracks().forEach(track => track.stop());
                    return;
                }

                streamRef.current = currentStream;
                setLocalStream(currentStream);

                if (!isIncomingInitial && !callerSignalInitial) {
                    initiateCall(currentStream);
                }
            } catch (err: any) {
                console.error("Error accessing media devices:", err);
                if (mounted) setError(err.message || "Failed to access camera/microphone");
            }
        };

        start();

        return () => {
            mounted = false;
            cleanup();
        };
    }, []);

    return {
        localStream,
        remoteStream,
        callAccepted,
        isIncoming,
        isMuted,
        isVideoOff,
        error,
        answerCall,
        endCall,
        toggleAudio,
        toggleVideo
    };
};
