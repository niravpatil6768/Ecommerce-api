const Razorpay = require("razorpay");
const Payment = require("../payment/payment.model");
const crypto = require("crypto"); //it provide cryptographic functionality with is used for hashing, encryption, decryption
const User = require("../user/user.model");
const mongoose = require("mongoose");
const Cart = require("../cart/cart.model");
const { updateProduct } = require("../product/product.controller");



const razorpay = new Razorpay({
  key_id: "rzp_test_3b88pgSESx20IL",
  key_secret: 'Io5YRa72D5lwf8B6mMG4TJZy'
});

// to create payment order
exports.createPayment = async (req, res) => {
  try {
    const paymentAmount = req.body.amount;
    const products = req.body.products;

    const productIds = products.map(product => product._id);  //map products with productId

    const order = await razorpay.orders.create({ //call razorpay api to create new order
        amount: paymentAmount * 100,
        currency: 'INR'
    },
        
    );
    //once create order. create object
    const payment = new Payment({
      razorpay_order_id: order.id,
      user: req.userId,
      
      currency: 'INR',
      amount: order.amount,
      products: productIds
    });

    await payment.save();
    
    res.json({
      orderId: order.id  //response with the orderId
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }

};

exports.webhook = async (req, res) => {
  
  try {

    const razorpay_order_id = req.body.orderId;
    const razorpay_payment_id = req.body.paymentId;
    const razorpay_signature = req.body.signature;
  

    //find payment using razorpay_order_id
    const payment = await Payment.findOne({ razorpay_order_id });
    console.log(req.body.orderId);
    console.log(razorpay_order_id);
    if (!payment) {
      return res.status(400).send("Payment not found");
    }
    console.log("70");
    const shasum = crypto.createHmac("sha256", razorpay.key_secret);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    console.log("73");
    const digest = shasum.digest("hex");
    console.log("///"+digest);
    console.log(">"+razorpay_signature);
    if (digest !== razorpay_signature) {
      return res.status(400).send("Transaction not legit!");
    }
    console.log("74");
    payment.razorpay_payment_id = razorpay_payment_id;
    payment.status = "completed";
   // payment.status = "PLACED";
    console.log("78");
    const productIds = payment.products.map(product => product.toString()); 
    const user = await User.findById(payment.user);
    console.log("81");
    if (!user) {
      return res.status(400).send("User not found");
    }

    user.products = user.products.concat(productIds); 
    await user.save();

    const userId = user._id;
    console.log("userIDD "+ user._id)
    
    const cart = await Cart.findOne({ "user": userId});
    console.log("cart "+cart);
    if (cart) {
      console.log("99 "+cart.products);
      const updatedCartProducts = cart.products.filter(product => productIds.includes(product.toString()));
      cart.products = updatedCartProducts;
      await cart.save();
      console.log("Product removed from user's cart");
      console.log(updatedCartProducts+ " 100")
    } else {
      
      console.log("User's cart is undefined or null");
    }
    await payment.save();
    
    res.json({
      message: "Payment successful"
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }

};
