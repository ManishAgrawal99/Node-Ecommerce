var express = require('express');
var router = express.Router();

var Product = require('../models/product');
var Cart = require('../models/cart');

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

router.get('/add-to-cart/:id', function(req,res,next){
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    Product.findById(productId, function(err, product){
        if(err){
            return res.redirect('/');
        }
        cart.add(product, product.id);
        req.session.cart = cart;
        console.log(req.session.cart);
        return res.redirect('/');
    });
});

router.get('/shopping-cart', function(req, res, next){
    if(!req.session.cart){
        return res.render('shop/shopping-cart', {products:null});
    }
    var cart = new Cart(req.session.cart);
    res.render('shop/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice})
})

module.exports = router;
