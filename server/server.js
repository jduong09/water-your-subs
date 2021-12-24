const express = require('express');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const dotenv = require('dotenv');
const db = require('./db');
const apiRouter = require('./api/index');

dotenv.config();

const app = express();
const port = 5000;

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/*
 * Session Configuration
*/

const session = {
  secret: process.env.SESSION_SECRET,
  cookie: {
    sameSite: false,
  },
  resave: false,
  saveUninitialized: false
};

if (app.get('env') === 'production') {
  // Serve secure cookies, requires HTTPS
  session.cookie.secure = true;
}

/*
 * Passport Configuration
*/

const strategy = new Auth0Strategy({
    domain: process.env.ISSUER,
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL,
    state: true,
  },
  // verify callback, use 'passReqToCallback' in order to pass state into verify callback function? 
  (accessToken, refreshToken, extraParams, profile, done) => done(null, profile)
);

/*
 * App Configuration
*/

// auth router attaches /login, /logout, and /callback routes to the baseURL
// middleware for passport and expressSession.
passport.use(strategy);
app.use(expressSession(session));
app.use(passport.initialize());
app.use(passport.session());

app.use(apiRouter);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

/**
 * Authentication check middleware
*/
const checkAuthentication = (req, res, next) => {
  console.log('hi checking authentication!');
  if (req.isAuthenticated()) {
    console.log('you are good to go sir.')
    res.send({ isAuthenticated: true });
    next();
  } else {
    console.log('sir. this is VIP.');
    res.send({ isAuthenticated: false });
    res.end();
  }
};

app.use('/users/:userId', checkAuthentication, (req, res, next) => {
  next();
});

/** 
* Database Queries
*/

// Query: Create users table. Send that the database is setup!
app.get('/', async (req, res) => {
  await db.createUsers();
  res.send('Server is setup :)');
});