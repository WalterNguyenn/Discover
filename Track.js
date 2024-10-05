const mongoose = require('mongoose');

// Define the Track schema
const trackSchema = new mongoose.Schema({
  spotifyId: String,
  name: String,
  album: {
    name: String,
    album_type: String,
    external_urls: { spotify: String },
    images: [{ height: Number, url: String, width: Number }],
    release_date: String,
    uri: String
  },
  artists: [{
    name: String,
    spotifyId: String,
    external_urls: { spotify: String }
  }],
  duration_ms: Number,
  explicit: Boolean,
  popularity: Number,
  external_url: String,
  preview_url: String,
  uri: String
});

// Compile the Track model
const Track = mongoose.model('Track', trackSchema);

module.exports = Track;
