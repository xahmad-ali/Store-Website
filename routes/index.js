const express = require('express');
const router  = express.Router();
const isloggedIn = require("../middleware/isLoggedin");
const isLoggedinOwner = require("../middleware/isLoggedinOwner")
const productModel = require('../models/product-model');
const userModel = require('../models/user-model');
const isloggedInOwner = require('../middleware/isLoggedinOwner');


router.get("/", (req, res)=>{
    let error = req.flash("error");
    res.render("index", {error})
});

router.get("/login", (req,res)=>{
    res.render("login")
});

router.get("/owners/login", (req,res)=>{
    res.render("loginOwner")
});

router.get("/logout",(req, res)=>{
    res.cookie("token","")
    res.redirect("/")
});


router.get("/shop",isloggedIn,async(req, res)=>{
    try {
        let products = await productModel.find()
    if(products){
        // if (products.image) {
        //     // Convert the image buffer to base64
        //     const imageBase64 = products.image.toString('base64');
        //     products.image = `data:image/jpeg;base64,${imageBase64}`; // You can also change the MIME type to match your image format
        //   }
        let success= req.flash("success")
    res.render("shop", {products,success})
    }
    } catch (error) {
        console.log(error.message)
    }
});

router.get("/owners/shop",isloggedInOwner,async(req, res)=>{
    try {
        let products = await productModel.find()
    if(products){
        // if (products.image) {
        //     // Convert the image buffer to base64
        //     const imageBase64 = products.image.toString('base64');
        //     products.image = `data:image/jpeg;base64,${imageBase64}`; // You can also change the MIME type to match your image format
        //   }
        let success= req.flash("success")
    res.render("shopOwner", {products,success})
    }
    } catch (error) {
        console.log(error.message)
    }
});


router.get("/newProduct",isLoggedinOwner ,(req, res) => {
    let success = req.flash("success")
    let error = req.flash("error");
    res.render("newProduct" , {success,error})
});

router.get("/addToCart/:productid",isloggedIn,async(req,res)=>{
     console.log(req.params.productid)
    try {
        let user = await userModel.findOne({email: req.user.email})
        if(!user){return res.status(500).redirect('/shop')}
        // console.log(user)
        user.cart.push(req.params.productid)
        await user.save();
        req.flash("success" , "Added to Cart")
        res.redirect("/shop")
    } catch (error) {
        // console.log(error)
        res.status(404).send(error)
    }
})

router.get("/cart",isloggedIn,async(req,res)=>{
    let user = await userModel.findOne({email: req.user.email}).populate("cart")
    // console.log(user.cart)
    res.render("cart",{user})
})

module.exports = router;