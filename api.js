const express = require('express');
const axios = require('axios');
const { User } = require('../Models/User');
const { transformTrack, transformPlaylist, transformArtist } = require('../utils/transformData');

const router = express.Router();

// Route to get user's liked tracks and save them
router.get('/user/liked-tracks', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const response = await axios.get('https://api.spotify.com/v1/me/tracks', {
      headers: { Authorization: `Bearer ${user.accessToken}` },
    });

    const transformedTracks = response.data.items.map(item => transformTrack(item.track));
    user.liked_songs = transformedTracks; // Save the transformed tracks as an array
    await user.save();

    res.json(transformedTracks);
  } catch (error) {
    console.error('Error fetching liked tracks:', error);
    res.status(500).send('Error retrieving liked tracks');
  }
});

// Route to get user's playlists and save them
router.get('/user/playlists', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const response = await axios.get('https://api.spotify.com/v1/me/playlists', {
      headers: { Authorization: `Bearer ${user.accessToken}` },
    });

    const transformedPlaylists = response.data.items.map(transformPlaylist);
    user.playlists = transformedPlaylists; // Save the transformed playlists
    await user.save();

    res.json(transformedPlaylists);
  } catch (error) {
    console.error('Error fetching playlists:', error);
    res.status(500).send('Error retrieving playlists');
  }
});

// Route to get user's top tracks and save them
router.get('/user/top-tracks', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const response = await axios.get('https://api.spotify.com/v1/me/top/tracks', {
      headers: { Authorization: `Bearer ${user.accessToken}` },
    });

    const transformedTopTracks = response.data.items.map(transformTrack);
    user.top_tracks = transformedTopTracks; // Save the transformed top tracks
    await user.save();

    res.json(transformedTopTracks);
  } catch (error) {
    console.error('Error fetching top tracks:', error);
    res.status(500).send('Error retrieving top tracks');
  }
});

// Route to get user's top artists and save them
router.get('/user/top-artists', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const response = await axios.get('https://api.spotify.com/v1/me/top/artists', {
      headers: { Authorization: `Bearer ${user.accessToken}` },
    });

    const transformedTopArtists = response.data.items.map(transformArtist);
    user.top_artists = transformedTopArtists; // Save the transformed top artists
    await user.save();

    res.json(transformedTopArtists);
  } catch (error) {
    console.error('Error fetching top artists:', error);
    res.status(500).send('Error retrieving top artists');
  }
});

module.exports = router;
