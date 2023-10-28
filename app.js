const express = require('express');  //import express module
const app = express();   //create instance of express framework
app.use(express.json()); //configure express application to parse json req. body. it enables application to automatically parse
                         // incoming json data in to js object.
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());
app.use('/upload', express.static('uploads'));  //serves static files

//import routes module
const userRoutes = require("./apis/user/user.route");
const productRoutes = require("./apis/product/product.route");
const cartRoutes = require("./apis/cart/cart.route");
const paymentRoutes = require("./apis/payment/payment.route");


app.get("/health", (req, res, next) => {
    return res.status(200).json({
      message: "Health is good",
      date: new Date()
    });
  });
  
  //to handle CORS error( implemented by web browsers to prevent web pages from making requests to a different domain)
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
  });

  

 //it is mount set of routes which is defined in userroutes to defined base url path.  
 app.use('/user',userRoutes);  //use to mount middleware to specific routes.
 app.use('/productpage',productRoutes); 
 app.use('/cart', cartRoutes);
 app.use('/payment', paymentRoutes);

 //configure mongoose to use standard promise library to handle async. operation
 mongoose.Promise = global.Promise;

 mongoose.connect('mongodb+srv://niravpatil098:npn987654N@cluster0.pionla9.mongodb.net/').then(() => {
      console.log("connect to DB");
 })
 .catch((e) => {
     console.log("not able to connect with DB");
     console.log(e);
 });

 module.exports = app;  //export instance of express application so, it can use in other files
