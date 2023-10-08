// import modules
const http = require('http'); //require to create http server and handling http req. and response
const app = require('./app');  //import isntanc of express application 
const Razorpay = require('razorpay'); //useful for integration with razopay for payment purpose.
const port = process.env.PORT || 3000; //define post on which incoming http req. will be listen

const server = http.createServer(app); //create server. take app as a arguments 
                                      //it means server will handle req. according to logic define in app.js 

server.listen(port);   //server will listen on specified port

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