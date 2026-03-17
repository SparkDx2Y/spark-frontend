import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import ReduxProvider from "@/store/providers/ReduxProvider";
import { SocketProvider } from "@/contexts/SocketContext";
import { VideoCallProvider } from "@/contexts/VideoCallContext";

export const metadata: Metadata = {
  title: 'Spark Dating',
  description: 'Find your spark!',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <ReduxProvider>
          <SocketProvider>
            <VideoCallProvider>
              {children}
            </VideoCallProvider>
          </SocketProvider>
        </ReduxProvider>

        <Toaster position="top-right" toastOptions={{
          duration: 3000,
          style: {
            background: '#111',
            color: '#fff'
          }
        }} />
      </body>
    </html>
  );
}
