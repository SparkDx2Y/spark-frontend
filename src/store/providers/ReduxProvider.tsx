'use client';

import { Provider } from 'react-redux';
import { store } from '../store';
import { ReactNode } from 'react';
import AuthInitializer from './AuthInitializer';

export default function ReduxProvider({ children }: { children: ReactNode }) {
    return (
        <Provider store={store}>
            <AuthInitializer>
                {children}
            </AuthInitializer>
        </Provider>
    );
}
