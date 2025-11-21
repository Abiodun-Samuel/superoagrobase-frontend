'use client';

import { clearAuth } from '@/lib/auth';
import Toast from '@/lib/toastify';
import { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext(null);

export function AuthProvider({ children, initialAuth }) {

    console.log('AuthProvider')
    const [auth, setAuth] = useState(initialAuth);

    const handleUnauthorized = async () => {
        await clearAuth()
        setAuth(null)
        Toast.error('Your session is invalid or has expired. Please log in.')
    }

    useEffect(() => {
        window.addEventListener('auth:unauthorized', handleUnauthorized);
        return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
    })

    return (
        <AuthContext.Provider value={{ ...auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
}
