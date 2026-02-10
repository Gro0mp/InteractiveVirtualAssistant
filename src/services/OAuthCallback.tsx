import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * This component handles the OAuth callback after GitHub authentication
 * It extracts user info from the session and stores it in the auth context
 */
export function OAuthCallback () {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    useEffect(() => {
        const handleOAuthCallback = async () => {
            const params = new URLSearchParams(location.search);
            const oauthSuccess = params.get('oauth');

            if (oauthSuccess === 'success') {
                try {
                    // Fetch the authenticated user's information from the backend
                    const response = await fetch('http://localhost:8080/api/v1/users/me', {
                        credentials: 'include', // Important: include cookies for session
                    });

                    if (response.ok) {
                        const userData = await response.json();

                        // Store user in auth context
                        login({
                            id: userData.id,
                            username: userData.username || userData.login, // GitHub returns 'login' field
                            email: userData.email,
                        });

                        // Redirect to home
                        navigate('/', { replace: true });
                    } else {
                        console.error('Failed to fetch user data after OAuth');
                        navigate('/login', { replace: true });
                    }
                } catch (error) {
                    console.error('Error handling OAuth callback:', error);
                    navigate('/login', { replace: true });
                }
            }
        };

        handleOAuthCallback();
    }, [location, login, navigate]);

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            fontSize: '18px',
            color: '#64748b'
        }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ marginBottom: '16px', fontSize: '48px' }}>🔐</div>
                <div>Completing sign in...</div>
            </div>
        </div>
    );
};

export default OAuthCallback;
