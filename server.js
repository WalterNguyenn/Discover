require('dotenv').config();
const express = require('express');
const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const apiRoutes = require('./Routes/api');
const { User } = require('./Models/User');

// Check if MONGO_URI exists in environment variables
if (!process.env.MONGO_URI) {
  throw new Error('MONGO_URI is not defined in .env file.');
}

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit process if MongoDB fails to connect
  });

// Create Express application
const app = express();

// Middleware for parsing JSON bodies
app.use(bodyParser.json());

// Configure session with MongoStore
app.use(session({
  secret: process.env.SESSION_SECRET || 'mySecret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI // Make sure this is set correctly
  })
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Configure Spotify strategy
passport.use(new SpotifyStrategy({
  clientID: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  callbackURL: process.env.SPOTIFY_CALLBACK_URL
}, async function (accessToken, refreshToken, expires_in, profile, done) {
  try {
    let user = await User.findOne({ spotifyId: profile.id });

    if (!user) {
      user = new User({
        spotifyId: profile.id,
        displayName: profile.displayName,
        email: profile.emails && profile.emails[0] ? profile.emails[0].value : null,
        accessToken: accessToken,
        refreshToken: refreshToken
      });
    } else {
      user.accessToken = accessToken;
      user.refreshToken = refreshToken;
    }

    await user.save();
    return done(null, user);
  } catch (err) {
    console.error('Error during Spotify authentication:', err);
    return done(err, null);
  }
}));

// Serialize and deserialize user for session management
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      return done(new Error('User not found'));
    }
    done(null, user);
  } catch (err) {
    console.error('Error deserializing user:', err);
    done(err, null);
  }
});

// Spotify Authentication Routes
app.get('/auth/spotify', passport.authenticate('spotify', {
  scope: ['user-read-email', 'user-read-private', 'playlist-read-private', 'user-library-read', 'user-top-read']
}));

app.get('/auth/spotify/callback',
  passport.authenticate('spotify', { failureRedirect: '/login' }),
  (req, res) => res.redirect('/')
);

// Use API routes
app.use('/api', apiRoutes);

// General error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Home route
app.get('/', (req, res) => {
  res.send('Welcome to the Spotify App');
});


// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
