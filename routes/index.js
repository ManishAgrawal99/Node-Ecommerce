var express = require('express');
var router = express.Router();

var Product = require('../models/product');
var csrf = require('csurf');

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
    res.render('user/signup', { csrfToken: req.csrfToken() });
    console.log(req.csrfToken());
})

router.post('/user/signup', function(req, res, next){
    res.redirect('/')
})

module.exports = router;
