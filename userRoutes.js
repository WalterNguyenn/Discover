const express = require('express');
const router = express.Router();
const axios = require('axios');
const { User } = require('../Models/User'); // Path to your User model
const Track = require('../Models/Track');   // Path to your Track model

// Transform Spotify track into your schema format
const transformTrack = (spotifyTrack) => ({
  spotifyId: spotifyTrack.id,
  name: spotifyTrack.name,
  album: {
    name: spotifyTrack.album.name,
    album_type: spotifyTrack.album.album_type,
    external_urls: spotifyTrack.album.external_urls,
    images: spotifyTrack.album.images,
    release_date: spotifyTrack.album.release_date,
    uri: spotifyTrack.album.uri
  },
  artists: spotifyTrack.artists.map(artist => ({
    name: artist.name,
    spotifyId: artist.id,
    external_urls: artist.external_urls
  })),
  duration_ms: spotifyTrack.duration_ms,
  explicit: spotifyTrack.explicit,
  popularity: spotifyTrack.popularity,
  external_url: spotifyTrack.external_urls.spotify,
  preview_url: spotifyTrack.preview_url,
  uri: spotifyTrack.uri
});

// Route for retrieving and saving user's liked tracks
router.get('/liked-tracks', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const response = await axios.get('https://api.spotify.com/v1/me/tracks', {
      headers: { 'Authorization': `Bearer ${user.accessToken}` }
    });

    // Transform Spotify data into Mongoose schema format
    const transformedTracks = response.data.items.map(item => transformTrack(item.track));

    // Save the transformed tracks to the database
    const savedTracks = await Track.insertMany(transformedTracks);

    // Save references to the user's liked songs
    user.liked_songs = savedTracks.map(track => track._id);
    await user.save();

    res.json(savedTracks);
  } catch (error) {
    console.error('Error retrieving liked tracks', error);
    res.status(500).send('Error retrieving liked tracks');
  }
});

module.exports = router;
