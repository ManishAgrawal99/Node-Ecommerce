var express = require('express');
var router = express.Router();

var Product = require('../models/product');

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




module.exports = router;
