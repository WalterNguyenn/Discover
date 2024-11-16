import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function SpotifyCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // The backend will handle the callback and redirection.
    // You can optionally check here if needed, but generally, you just redirect.
    navigate('/dashboard');
  }, [navigate]);

  return <div>Loading...</div>;
}

export default SpotifyCallback;
