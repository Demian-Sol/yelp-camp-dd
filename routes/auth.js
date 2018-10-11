const express = require("express"),
      router  = express.Router(),
      User = require("../models/user"),
      Middleware = require("../middleware"),
      passport = require("passport");
      
router.get('/', (req, res) => {
  res.render('campgrounds/home', {pagetitle: 'Welcome to Yelp Camp!', style: '/home.css'});
})



router.get('/register', (req, res) => {
  res.render('register', {pagetitle: 'Create new account', style: 'register.css'});
})

router.post('/register', (req, res) => {
  User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      req.flash('error', err.message);
      return res.redirect('/register');
    } else {
      passport.authenticate('local')(req, res, () => {
        req.flash('success', `Welcome to YelpCamp, ${user.username}`)
        res.redirect('/cgroundslist');
      });
    }
  });
});

router.get('/login', (req, res) => {
  res.render('login', {pagetitle: 'Sign in', style: 'login.css'})
})

router.post ('/login', passport.authenticate('local', {
  successRedirect: '/cgroundslist',
  failureRedirect: '/login'
}), (req, res) => {});

router.get('/logout', Middleware.isLoggedIn, (req, res) => {
  req.logout();
  req.flash('success', 'Succesfully logged out');
  res.redirect('/');
})

module.exports = router;