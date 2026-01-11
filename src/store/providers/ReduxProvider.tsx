'use client';

import { Provider } from 'react-redux';
import { store } from '../store';
import { ReactNode } from 'react';
import AuthInitializer from './AuthInitializer';
import { GoogleOAuthProvider } from '@react-oauth/google';

export default function ReduxProvider({ children }: { children: ReactNode }) {
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

    return (
        <Provider store={store}>
            <GoogleOAuthProvider clientId={googleClientId}>
                <AuthInitializer>
                    {children}
                </AuthInitializer>
            </GoogleOAuthProvider>
        </Provider>
    );
}
