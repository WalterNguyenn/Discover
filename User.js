const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: String,
  spotifyId: {
    type: String,
    unique: true,
    sparse: true,
  },
  accessToken: String,
  refreshToken: String,
  displayName: {
    type: String,
    default: 'Unknown User',
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  playlists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Playlist' }], // Referencing user playlists
  topArtists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Artist' }],  // Referencing top artists
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]        // Referencing user's friends
});

// Compile the User model
const User = mongoose.model('User', userSchema);

module.exports = { User };
