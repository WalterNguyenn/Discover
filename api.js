// api.js
const express = require('express');
const { User } = require('../models/User');

const router = express.Router();

// User data route
router.get('/user/data', async (req, res) => {
  if (!req.user) return res.status(401).send('Unauthorized');

  try {
    const user = await User.findById(req.user._id)
      .populate('playlists')
      .populate('topArtists')
      .populate('friends');

    if (!user) return res.status(404).send('User not found');

    res.json({
      username: user.displayName,
      playlists: user.playlists,
      topArtists: user.topArtists,
      friends: user.friends,
    });
  } catch (err) {
    console.error('Error fetching user data:', err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
