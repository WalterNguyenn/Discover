const mongoose = require('mongoose');

// Define the Playlist schema
const playlistSchema = new mongoose.Schema({
  playlistId: String,
  name: String,
  description: String,
  total_tracks: Number,
  external_urls: {
    spotify: String,
  },
  tracks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Track' }],
});

// Compile the Playlist model
const Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = { Playlist };
