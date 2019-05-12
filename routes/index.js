var express = require('express');
var router = express.Router();

var Product = require('../models/product');
var csrf = require('csurf');

var passport = require('passport');

var csrfProtection = csrf();
router.use(csrfProtection);



/* GET home page. */
router.get('/', function (req, res, next) {
    //Searching the database for all the products
    var products = Product.find({}).exec((err, products)=>{
        if(err){
            res.send(err);
        }
        else{
            console.log(products);
            res.render('shop/index', { title: 'Shopping Cart' , products:products }); 
        }
    })
});

router.get('/user/signup', function(req, res, next){
    var messages = req.flash('error');
    res.render('user/signup', { csrfToken: req.csrfToken(), messages:messages, hasErrors: messages.length>0 });
    console.log(req.csrfToken());
});

router.post('/user/signup', passport.authenticate('local.signup', {
    successRedirect: '/user/profile',
    failureRedirect: '/user/signup',
    failureFlash: true
}));

router.get('/user/profile', function(req, res, next){
    res.render('user/profile');
})

module.exports = router;
