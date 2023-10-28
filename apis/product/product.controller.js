const { isValidObjectId } = require("mongoose");
var ObjectId = require("mongodb").ObjectID;
const Product = require("./product.model");
const multer = require("multer");
const fs = require("fs");
const path = require("path");


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Define the directory where uploaded files will be stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Define the filename
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
});

exports.getProducts = (req, res, next) => {
  Product.find()
    .exec()           //use to return query. it also return promise
    .then((products) => {
      res.status(200).json({
        products,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        message: "Failed to get all Products",
      });
    });
};

//show products for client
exports.getProductsClient = (req, res, next) => {
  const sellerId = req.params.userId; // Assuming sellerId is passed in the URL params
  console.log(sellerId);
  Product.find({ seller: sellerId })
    .exec()
    .then((products) => {
      res.status(200).json({
        products,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        message: "Failed to get all Products",
      });
    });
};

//find products by category
exports.getProductcategory = (req, res, next) => {
  const category = req.params.category;
  Product.find({ category })
    .exec()
    .then((products) => {
      res.status(200).json({
        products,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        message: "Failed to get all Products",
      });
    });
};


exports.getProduct = (req, res, next) => {
  Product.findById(req.body.id)
    .exec()
    .then((product) => {
      if (product != null) {
        res.status(200).json({
          message: "Product found Successfully",
          product,
        });
      } else {
        res.status(404).json({
          message: "Product not found",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        message: "Failed to get Product",
      });
    });
};

//create product
exports.createProduct = (req, res, next) => {
  
  const userId = req.params.userId;
  //use upload middleware to handle upload of product image
  //except file with field name productimage
  upload.single("productImage")(req, res, (err) => {
    console.log(req.file);

   //create object 
    const product = new Product({
      name: req.body.name,
      sellername: req.body.sellername,
      price: req.body.price,
      description: req.body.description,
      seller: req.body.userId,
      
      productImage: req.file ? `upload/${req.file.filename}` : undefined,
      category: req.body.category,
    });

    
    if (req.file) {  //check req.file is exists or not
      product.productImage = `upload/${req.file.filename}`;  //set productimage to path of uploaded file.
    }

    if(req.userType == "SELLER") {
      product.set('seller:', req.userId);
      console.log("user:"+req.userId);

    // Save the product to the database
    product.save().then((product) => {
        res.status(201).json({
          message: "Product added successfully",
          product,
          
        });
      }).catch((err) => {
        res.status(500).json({
          message: "Error while creating product",
          error: err,
        });
      });
  };

});
};

//delete product
exports.deleteProduct = async (req, res) => {
  const productId = req.params.id;

  if (!isValidObjectId(productId)) {
    return res.status(400).json({
      message: 'Invalid product ID',
      id: productId,
    });
  }

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: 'Product not found',
      });
    }

    
    
    await Product.findByIdAndRemove(productId);

    res.status(200).json({
      message: 'Product deleted successfully',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Error while deleting product',
      error: err.message,
    });
  }
};



//update product
exports.updateProduct = async (req, res, next) => {
  const productId = req.params.id;

  if (!isValidObjectId(productId)) {
    return res.status(400).json({
      message: 'Product not found with given id',
      productId: productId,
    });
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        $set: {             //update product based on provided value in body
          name: req.body.name,
          sellername: req.body.sellername,
          price: req.body.price,
          description: req.body.description,
          category: req.body.category,
        },
      },
      { new: true }
    );

    if (updatedProduct) {
      res.status(200).json({
        message: 'Product updated successfully',
        Product: updatedProduct,
      });
    } else {
      res.status(404).json({
        message: 'Product not found',
      });
    }
  } catch (err) {
    res.status(500).json({
      message: 'Error while updating product',
      error: err,
    });
  }
};

//get single product
exports.getProduct = (req, res, next) => {
  Product.findById(req.params.id).exec()
  .then(product => {
      if(product != null) {
          res.status(200).json({
              message: 'Product found Successfully',
              product
          });
      } else {
          res.status(404).json({
              message: 'Product not found'
          });
      }
  }).catch((err) => {
      res.status(500).json({
          error: err,
          message: 'Failed to get product'
      });
  });
}


