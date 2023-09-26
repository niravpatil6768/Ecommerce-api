const http = require('http');
const app = require('./app');
const Razorpay = require('razorpay');
const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(port);

var instance = new Razorpay({
    key_id: 'rzp_test_3b88pgSESx20IL',
    key_secret: 'Io5YRa72D5lwf8B6mMG4TJZy',
  });


 app.post('/create/orderId',(req,res) => {
    console.log("create orderId req.",req.body);

    var options = {
        amount: req.body.amount,  // amount in the smallest currency unit
        currency: "INR",
        receipt: "rcp1"
      };
      instance.orders.create(options, function(err, order) {
        console.log(order);
        res.send({orderId : order.id})
      });
 }) 