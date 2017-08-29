// Dependencies
// =============================================================
const express = require('express');
const bodyParser = require('body-parser');

//Authentication packages
// =============================================================
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const githubAuth = require('./config/auth.js').github;

//Database packages
// =============================================================
const mongoose = require('mongoose');

// Sets up the Express App
// =============================================================
const app = express();
const PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
// =============================================================
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.text());
app.use(bodyParser.json({
    type: 'application/vnd.api+json'
}));

//Authentication setup
// =============================================================
app.use(cookieParser());

app.use(session({
    secret: 'sdlfkjdlajsdoijajk',
    resave: false,
    saveUninitialized: false,
    // cookie: { secure: true }
}));

app.use(passport.initialize());
app.use(passport.session());

// Requiring our models for syncing
// =============================================================
const users = require('./models/Users');
let devCircle = 'mongodb://localhost/devCircle';

mongoose.connect(devCircle, {
    useMongoClient: true
})

//passport login check
// =============================================================
passport.use(new GitHubStrategy({
            clientID: githubAuth.clientID,
            clientSecret: githubAuth.clientSecret,
            callbackURL: githubAuth.callbackURL
    },
    function (accessToken, refreshToken, profile, done) {
        let user = new users(profile._json);
        user.save((err, results) => {
            if (err) {
                console.log(err)
            }
            console.log(results);
            console.log("user added to db")
            return done(err, results);
        })
    }));


passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

app.get('/auth/github',
    passport.authenticate('github', {
        scope: ['user:email']
    }));

app.get('/auth/github/callback',
    passport.authenticate('github', {
        failureRedirect: '/login'
    }),
    function (req, res) {
        // Successful authentication, redirect home.
        console.log("logged in");
        //provide code
        console.log('req.query', req.query);
        //will return true if logged in
        console.log(req.isAuthenticated())
        //provide user profile
        console.log(req.user)
        res.end();
    });

// Starting our Express app
// =============================================================
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});