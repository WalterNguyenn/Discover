const mongoose = require('mongoose');

// Define the Artist schema
const artistSchema = new mongoose.Schema({
  spotifyId: String,
  name: String,
  genres: [String],
  popularity: Number,
  external_url: String,
  uri: String,
});

// Compile the Artist model
const Artist = mongoose.model('Artist', artistSchema);

module.exports = { Artist };
