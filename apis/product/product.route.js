const express = require("express");
const router = express.Router();
const ProductController = require('./product.controller');
//const auth = require('../middlewares/auth');
//const roleAccess = require("../middlewares/roleAccess");

router.get('/',  ProductController.getProducts);
router.post('/addproduct', ProductController.createProduct);
router.get('/getProduct/:id', ProductController.getProduct);



module.exports = router;