var express = require('express');
var router = express.Router();

var csrf = require('csurf');

var passport = require('passport');

var csrfProtection = csrf();
router.use(csrfProtection);


router.get('/signup', notLoggedIn, function(req, res, next){
    var messages = req.flash('error');
    res.render('user/signup', { csrfToken: req.csrfToken(), messages:messages, hasErrors: messages.length>0 });
    console.log(req.csrfToken());
});

router.post('/signup', notLoggedIn, passport.authenticate('local.signup', {
    failureRedirect: '/user/signup',
    failureFlash: true
}), function(req, res, next){
    if(req.session.oldUrl){
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    }
    else{
        res.redirect('/user/profile');
    }
});

router.get('/signin', notLoggedIn, function(req, res, next){
    var messages = req.flash('error');
    res.render('user/signin', { csrfToken: req.csrfToken(), messages:messages, hasErrors: messages.length>0 });
    console.log(req.csrfToken());
});

router.post('/signin', notLoggedIn, passport.authenticate('local.signin', {
    failureRedirect: '/user/signin',
    failureFlash: true
}), function(req, res, next){
    if(req.session.oldUrl){
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    }
    else{
        res.redirect('/user/profile');
    }
});

router.get('/logout', isLoggedIn, function(req, res, next){
    //logout() method given by passport
    req.logout();
    res.redirect('/');
});

router.get('/profile', isLoggedIn,  function(req, res, next){
    res.render('user/profile');
})

module.exports = router;

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}

function notLoggedIn(req, res, next){
    if(!req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}