const express = require("express");
const router = express.Router();
const ProductController = require('./product.controller');
const multer = require('multer');
//nst upload = multer({dest: '/uploads/'});
const authh = require('../middlewares/authh');
const roleAccess = require("../middlewares/roleAccess");

router.get('/:category', ProductController.getProductcategory);
router.get('/', ProductController.getProducts);
router.get('/product/:id', authh, ProductController.getProduct);
router.get('/getproduct/:userId', ProductController.getProductsClient);
router.post('/addproduct/:userId', authh, roleAccess(['SELLER']) , ProductController.createProduct);
router.delete('/deleteproduct/:id', authh, roleAccess(['SELLER']), ProductController.deleteProduct);
router.put('/updateproduct/:id', authh, roleAccess(['SELLER']), ProductController.updateProduct);
//router.get('/getProduct/:id', ProductController.getProduct);
router.post('/getUploadURL/:key',ProductController.getUploadURL);



module.exports = router;