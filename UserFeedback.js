const mongoose = require('mongoose');

// Define the UserFeedback schema
const userFeedbackSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Reference to the user
  trackId: { type: mongoose.Schema.Types.ObjectId, ref: 'Track' }, // Reference to a track
  feedback: { type: String, enum: ['like', 'dislike'], required: true }, // Like or Dislike
  timestamp: { type: Date, default: Date.now }  // Time of feedback
});

// Compile the UserFeedback model
const UserFeedback = mongoose.model('UserFeedback', userFeedbackSchema);

module.exports = UserFeedback;
