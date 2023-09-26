const express = require("express");
const router = express.Router();
const CartController = require('./cart.controller');
const authh = require('../middlewares/authh');
const roleAccess = require("../middlewares/roleAccess");

router.get('/:userId',  authh, CartController.getCart);
router.post('/:userId',  authh , CartController.addItemToCart);
router.delete("/:userId/:productId", authh, CartController.removeItem);


module.exports = router;