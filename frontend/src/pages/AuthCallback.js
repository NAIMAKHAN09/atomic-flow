import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AuthCallback = () => {
  const navigate = useNavigate();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const processSession = async () => {
      try {
        const hash = window.location.hash;
        const params = new URLSearchParams(hash.substring(1));
        const sessionId = params.get('session_id');

        if (!sessionId) {
          toast.error('Authentication failed');
          navigate('/');
          return;
        }

        const response = await axios.post(
          `${BACKEND_URL}/api/auth/session`,
          { session_id: sessionId },
          { withCredentials: true }
        );

        const user = response.data;
        toast.success(`Welcome back, ${user.name}!`);
        navigate('/dashboard', { state: { user }, replace: true });
      } catch (error) {
        console.error('Auth error:', error);
        toast.error('Authentication failed. Please try again.');
        navigate('/');
      }
    };

    processSession();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-bone flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-evergreen border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-lg text-evergreen font-medium">Signing you in...</p>
      </div>
    </div>
  );
};

export default AuthCallback;