const axios = require('axios');
const { User } = require('../models/User');

async function refreshAccessToken(user) {
  try {
    const response = await axios({
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: user.refreshToken
      })
    });

    const newAccessToken = response.data.access_token;
    user.accessToken = newAccessToken;
    await user.save();
    return newAccessToken;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw new Error('Unable to refresh access token');
  }
}

module.exports = { refreshAccessToken };
