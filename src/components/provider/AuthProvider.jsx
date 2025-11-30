'use client';

import { clearAuth, getSessionId } from '@/server/auth.server';
import Toast from '@/lib/toastify';
import { createContext, useEffect, useState } from 'react';
import { DEFAULT_AUTH_STATE } from '@/utils/constant';

export const AuthContext = createContext(null);

export function AuthProvider({ children, initialAuth }) {
    const [auth, setAuth] = useState(initialAuth);

    const handleUnauthorized = async () => {
        await clearAuth();
        const sessionId = await getSessionId();
        setAuth({ ...DEFAULT_AUTH_STATE, sessionId });
        Toast.error('Your session is invalid or has expired. Please log in.');
    };

    useEffect(() => {
        window.addEventListener('auth:unauthorized', handleUnauthorized);
        return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
    }, []);

    return (
        <AuthContext.Provider value={{ ...auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
}