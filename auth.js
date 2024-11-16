const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { User } = require('../models/User');
const { Playlist } = require('../Models/Playlist');
const { Artist } = require('../models/Artist');
const axios = require('axios');

const router = express.Router();

// Registration route
router.post('/local/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send('User already exists.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).send('User registered');
  } catch (err) {
    res.status(500).send('Internal Server Error');
  }
});

// Local login route
router.post('/local/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(400).json({ message: info.message || 'Login failed' });

    req.logIn(user, err => {
      if (err) return res.status(500).json({ message: 'Login error' });

      // Check if the user is connected to Spotify
      if (!req.user.spotifyId) {
        return res.status(200).json({ spotifyConnected: false }); // User needs to authenticate with Spotify
      } else {
        return res.status(200).json({ spotifyConnected: true }); // Spotify already connected
      }
    });
  })(req, res, next);
});

// Spotify authentication route
router.get('/spotify', passport.authenticate('spotify', {
  scope: [
    'user-read-email',
    'user-read-private',
    'playlist-read-private',
    'user-top-read',
  ]
}));

// Spotify callback route - this handles Spotify's redirection after authentication
router.get('/spotify/callback', passport.authenticate('spotify', { failureRedirect: '/login' }), async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).send('User not found');

    // Ensure we have accessToken before proceeding
    if (!user.accessToken) {
      return res.status(500).send('Access token not found.');
    }

    // After successful authentication, redirect the user to the dashboard
    res.redirect('http://localhost:3000/dashboard');
  } catch (error) {
    console.error('Error during Spotify authentication:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
