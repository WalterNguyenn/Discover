require('dotenv').config();

const express = require('express');
const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { User } = require('./models/User');
const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');

const app = express();

// CORS Configuration
app.use(cors({
    origin: 'http://localhost:3000', // Frontend origin
    credentials: true, // Allow credentials (cookies, sessions)
}));

// Body parser
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/spotify-app')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => {
        console.error('Could not connect to MongoDB:', err);
        process.exit(1); // Exit process if DB connection fails
    });

// Session setup
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI || 'mongodb://localhost:27017/spotify-app',
        collectionName: 'sessions',
        ttl: 24 * 60 * 60 // 1 day
    }),
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
        secure: process.env.NODE_ENV === 'production', // Only set the cookie over HTTPS
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax' // Protect against CSRF
    }
}));

// Initialize Passport and sessions
app.use(passport.initialize());
app.use(passport.session());

// Passport local strategy for authentication
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return done(null, false, { message: 'User not found' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return done(null, false, { message: 'Incorrect password' });
        }
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

// Spotify authentication strategy
passport.use(new SpotifyStrategy({
    clientID: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    callbackURL: process.env.SPOTIFY_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ spotifyId: profile.id });
        
        if (!user) {
            // Handle case where Spotify doesn't provide a displayName or username
            const username = profile.displayName || `user_${profile.id}`; // Generate a default username if none is provided

            user = new User({
                spotifyId: profile.id,
                displayName: profile.displayName || "Unknown User", // Fallback if displayName is null
                username, // Fallback if username is not provided
                email: profile.emails?.[0]?.value, // Check if email exists
                accessToken,
                refreshToken
            });
        } else {
            user.accessToken = accessToken;
            user.refreshToken = refreshToken;
        }

        await user.save();
        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
}));

// Serialize and deserialize user for session handling
passport.serializeUser((user, done) => {
    done(null, user.id); // Only store the user ID in session
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user); // Attach the full user object to req.user
    } catch (err) {
        done(err, null);
    }
});

// Routes
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send(process.env.NODE_ENV === 'production' ? 'Internal Server Error' : `Error: ${err.message}`);
});

// Start the server
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
