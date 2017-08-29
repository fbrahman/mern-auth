module.exports = function (app, passport) {

    //Authentication through gitHub
    // =============================================================

    //route for github authentication and login
    app.get('/auth/github', passport.authenticate('github', {
        scope: ['user:email']
    }));

    //handle the call back after github has authenticated the user
    app.get('/auth/github/callback',
        passport.authenticate('github', {
            failureRedirect: '/login',
            successRedirect: '/dashboard'
        }),
        function (req, res) {
            // Successful authentication, redirect home.
            console.log("logged in");
            
            //provide code
            // console.log('req.query', req.query);
            
            //will return true if logged in
            console.log(req.isAuthenticated())
            
            //provide user profile
            // console.log(req.user)
            res.end();
        });
};

//route middleware to make sure a user is logged in 
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
};