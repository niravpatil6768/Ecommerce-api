const express = require("express");
const router = express.Router();
const CartController = require('./cart.controller');

router.get('/:userId', CartController.getCart);
router.post('/:userId', CartController.addItemToCart);
router.delete("/:userId/:productId", CartController.removeItem);


module.exports = router;