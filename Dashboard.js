import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/user/data', { withCredentials: true });
        setUserData(response.data);
      } catch (err) {
        if (err.response.status === 401) {
          navigate('/login');
        } else {
          setError('Failed to fetch user data');
        }
      }
    };

    fetchData();
  }, [navigate]);

  if (error) return <div>{error}</div>;
  if (!userData) return <div>Loading...</div>;

  return (
    <div>
      <h2>Welcome, {userData.username}</h2>

      <h3>Your Playlists</h3>
      {userData.playlists && userData.playlists.length > 0 ? (
        <ul>
          {userData.playlists.map((playlist, index) => (
            <li key={index}>{playlist.name}</li>
          ))}
        </ul>
      ) : (
        <p>No playlists found.</p>
      )}

      <h3>Your Top 5 Artists</h3>
      {userData.topArtists && userData.topArtists.length > 0 ? (
        <ul>
          {userData.topArtists.slice(0, 5).map((artist, index) => (
            <li key={index}>{artist.name}</li>
          ))}
        </ul>
      ) : (
        <p>No top artists found.</p>
      )}

      <h3>Number of Friends</h3>
      <p>{userData.friends ? userData.friends.length : 0}</p>
    </div>
  );
}

export default Dashboard;
