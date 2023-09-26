const express = require("express");
const router = express.Router();
const PaymentController = require('./payment.controller');
const authh = require('../middlewares/authh');

router.post('/createPayment', authh , PaymentController.createPayment);
router.post('/webhook' , PaymentController.webhook);

module.exports = router;