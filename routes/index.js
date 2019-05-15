var express = require('express');
var router = express.Router();

var Product = require('../models/product');
var Cart = require('../models/cart');
var Order = require('../models/order');

/* GET home page. */
router.get('/', function (req, res, next) {
    var successMsg = req.flash('success')[0];

    //Searching the database for all the products
    var products = Product.find({}).exec((err, products)=>{
        if(err){
            res.send(err);
        }
        else{
            console.log(products);
            res.render('shop/index', { title: 'Shopping Cart' , products:products, successMsg: successMsg, noMessage: !successMsg}); 
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

router.get('/checkout', function(req, res, next){
    if(!req.session.cart){
        return res.redirect('shop/shopping-cart', {products:null});
    }
    var cart = new Cart(req.session.cart);
    var errMsg = req.flash('error')[0];
    res.render('shop/checkout', {total: cart.totalPrice, errMsg: errMsg, noError: !errMsg});
})

router.post('/checkout', function(req,res,next){
    if(!req.session.cart){
        return res.redirect('shop/shopping-cart', {products:null});
    }
    var cart = new Cart(req.session.cart);
    var stripe = require('stripe')("sk_test_bVCo67jGs89BVbhKhykfjGFN00hdYo3zQ5");

    stripe.charges.create({
        amount: cart.totalPrice *100,
        currency: "usd",
        source: req.body.stripeToken,
        description: "Test Charge",
    }, function(err, charge){
        if(err){
            req.flash('error', err.message);
            return res.redirect('/checkout');
        }
        var order = new Order({
            user: req.user,
            cart: cart,
            address: req.body.address,
            name: req.body.name,
            paymentId: charge.id
        });
        order.save(function(err, result){
            req.flash('success', 'Payment Made Successfuly');
            req.session.cart = null;
            res.redirect('/');
        });
        
    })
})

module.exports = router;
