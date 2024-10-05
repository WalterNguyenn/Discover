const mongoose = require('mongoose');

const TrackSchema = new mongoose.Schema({
  spotifyId: String,
  name: String,
  album: {
    name: String,
    album_type: String,
    external_urls: Object,
    images: Array,
    release_date: String,
    uri: String,
  },
  artists: [
    {
      name: String,
      spotifyId: String,
      external_urls: Object,
    },
  ],
  duration_ms: Number,
  explicit: Boolean,
  popularity: Number,
  external_url: String,
  preview_url: String,
  uri: String,
});

const PlaylistSchema = new mongoose.Schema({
  playlistId: String,
  name: String,
  tracks: String,
  uri: String,
});

const ArtistSchema = new mongoose.Schema({
  spotifyId: String,
  name: String,
  genres: [String],
  popularity: Number,
  uri: String,
});

const UserSchema = new mongoose.Schema({
  spotifyId: String,
  displayName: String,
  email: String,
  accessToken: String,
  refreshToken: String,
  liked_songs: [TrackSchema],
  playlists: [PlaylistSchema],
  top_tracks: [TrackSchema],
  top_artists: [ArtistSchema],
});

const User = mongoose.model('User', UserSchema);
module.exports = { User };
