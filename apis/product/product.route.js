const express = require("express");
const router = express.Router();
const ProductController = require('./product.controller');
const multer = require('multer');
//nst upload = multer({dest: '/uploads/'});
const authh = require('../middlewares/authh');
const roleAccess = require("../middlewares/roleAccess");

router.get('/:category',  ProductController.getProducts);
router.get('/',  ProductController.getProducts);
router.post('/addproduct', authh, roleAccess(['SELLER']) , ProductController.createProduct);
router.get('/getProduct/:id', ProductController.getProduct);
router.post('/getUploadURL/:key',ProductController.getUploadURL);



module.exports = router;