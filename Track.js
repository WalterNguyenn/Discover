const mongoose = require('mongoose');

const trackSchema = new mongoose.Schema({
  spotifyId: { type: String, unique: true }, // Unique constraint on Spotify ID
  name: String,
  artist: String,
  album: {
    name: String,
    release_date: String,
  },
  duration_ms: Number,
});

const Track = mongoose.model('Track', trackSchema);

module.exports = Track;
