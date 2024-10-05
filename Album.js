const mongoose = require('mongoose');

// Define the Album schema
const albumSchema = new mongoose.Schema({
  spotifyId: String,
  name: String,
  album_type: String,
  genres: [String],
  popularity: Number,
  release_date: String,
  external_urls: { spotify: String },
  images: [{ height: Number, url: String, width: Number }],
  uri: String
});

// Compile the Album model
const Album = mongoose.model('Album', albumSchema);

module.exports = Album;
