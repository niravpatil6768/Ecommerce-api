const express = require("express");
const router = express.Router();
const CartController = require('./cart.controller');

router.get('/', CartController.getCart);
router.post('/', CartController.addItemToCart);
router.delete("/:userId/:productId", CartController.removeItem);

module.exports = router;