import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import bodyParser from 'body-parser';
import { config } from './config';
import { twitchStrategy, TwitchUser } from './twitch-strategy';

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: config.sessionSecret, resave: false, saveUninitialized: false }));
app.use(express.static('public'));
app.use(passport.initialize());
app.use(passport.session());

// Twitch OAuth
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));
passport.use('twitch', twitchStrategy);

app.get('/', (req, res) => {
  const { passport } = req.session as ({ passport?: { user?: TwitchUser }})
  if (passport?.user) {
    res.send(`Logged in as ${passport.user.displayName}`);
  } else {
    // TODO: JSON api responses for a chatbot?
    res.send('Not authorized');
  }
});

app.get('/auth', passport.authenticate('twitch'));

app.get('/auth/callback', passport.authenticate('twitch', { failureRedirect: '/' }), (req, res) => {
  res.redirect('/');
});

app.listen(config.port, () => {
  console.log(`Example app listening on port ${config.port}`);
});
