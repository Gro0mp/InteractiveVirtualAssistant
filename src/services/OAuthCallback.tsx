// src/services/OAuthCallback.tsx
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from './api';

export function OAuthCallback() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    useEffect(() => {
        const handleOAuthCallback = async () => {
            const params = new URLSearchParams(location.search);
            const oauthSuccess = params.get('oauth');

            if (oauthSuccess === 'success') {
                try {
                    const userData = await api.getCurrentUser();

                    // Prefer backend-provided id; otherwise fallback to OAuth-provider fields if present
                    const id = (userData as any).id ?? (userData as any).client_id ?? (userData as any).sub;

                    const username =
                        (userData as any).username ??
                        (userData as any).name ??
                        (userData as any).email?.split('@')[0];

                    login({
                        id: Number(id),
                        username: String(username),
                        email: (userData as any).email,
                        plan: (userData as any).plan,
                    });

                    console.log(id)
                    console.log(username)
                    console.log((userData as any).email)
                    console.log((userData as any).plan)

                    navigate('/assistant', { replace: true });
                } catch (error) {
                    console.error('Error handling OAuth callback:', error);
                    navigate('/login', { replace: true });
                }
            }
        };

        handleOAuthCallback().then(r => r);
    }, [location, login, navigate]);

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontSize: '18px', color: '#64748b' }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ marginBottom: '16px', fontSize: '48px' }}></div>
                <div>Completing sign in...</div>
            </div>
        </div>
    );
}
