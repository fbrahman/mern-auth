// Dependencies
// =============================================================
const express = require('express');
const bodyParser = require('body-parser');

//Authentication packages
// =============================================================
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const flash = require('connect-flash');
const githubAuth = require('./config/auth.js').github;

//Database packages
// =============================================================
const mongoose = require('mongoose');

// db configuration
// =============================================================
const configDB = require('./config/database.js');
// const users = require('./models/Users');
mongoose.connect(configDB.url)

// Sets up the Express App
// =============================================================
const app = express();
const PORT = process.env.PORT || 3000;

// passport configuration
// =============================================================
require('./config/passport')(passport) //pass passport for configuration

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
app.use(flash());

//Routes setup
// =============================================================
require('./app/routes.js')(app, passport) //load our routes and pass in our app and fully configured passport

// Starting our Express app
// =============================================================
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});