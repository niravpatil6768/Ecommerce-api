const { isValidObjectId } = require("mongoose");
var ObjectId = require("mongodb").ObjectID;
const Product = require("./product.model");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
//const upload = multer({dest: 'uploads/'});

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

exports.getProductsClient = (req, res, next) => {
  const sellerId = req.params.userId; // Assuming sellerId is passed in the URL params
  console.log(sellerId);
 // console.log(userId);
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

exports.createProduct = (req, res, next) => {
  
  const userId = req.params.userId;
  upload.single("productImage")(req, res, (err) => {
    console.log(req.file);

   
    const product = new Product({
      name: req.body.name,
      sellername: req.body.sellername,
      price: req.body.price,
      description: req.body.description,
      seller: req.body.userId,
      
      productImage: req.file ? `upload/${req.file.filename}` : undefined,
      category: req.body.category,
    });

    
    if (req.file) {
      product.productImage = `upload/${req.file.filename}`;
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

    
    // Delete course from database
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


/*>>>>exports.updateProduct = (req, res, next) => {
  const productId = req.params.id;

  if(!isValidObjectId(productId)) {
      return res.status(400).json({
          message : 'Product not found with given id',
          productId : productId
      });
  }
  
  var product = {
      name: req.body.name,
      sellername:req.body.sellername,
      price: req.body.price,
      description: req.body.description,
      category: req.body.category,
      
  };

  Product.findByIdAndUpdate(req.params.id, { $set : product }, { new : true }, (err, Product) => {
      if(!err) {
          if(Product != null) {
              res.status(200).json({
                  message: 'Product updated Successfully',
                  Product
              });
          } else {
              res.status(404).json({
                  message: 'Product not found'
              });
          }
      } else {
          res.status(500).json({
              message: 'Error while updating product',
              error: err
          });
      }
  });   
}*/


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
        $set: {
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


exports.getUploadURL = async (req, res, next) => {
  try {
    const { name, sellername, price, description } = req.body;
    const productImage = req.file;

    // Check if a course with the same name already exists
    /* const existingCourse = await Course.findOne({ name });
          
              if (existingCourse) {
                return res.status(409).json({
                  msg: "A course with this name already exists!",
                });
              }*/

    // Check if the user is an instructor (You should have a way to verify this)
    //if (req.userType === "INSTRUCTOR") {
    const product = new Product({
      name,
      productImage: productImage.filename, // Use the filename of the uploaded image
      sellername,
      price,
      description,
      //instructor: req.userId,
    });

    // Save the course to the database
    const savedProduct = await product.save();

    res.status(200).json({
      message: "product added successfully",
      product: savedProduct,
      url: `/uploads/${productImage.filename}`, // Return the local URL of the uploaded image
    });

    // Move the uploaded image to the "uploads" folder
    const filePath = path.join(__dirname, "../uploads", productImage.filename);
    fs.rename(productImage.path, filePath, (err) => {
      if (err) {
        console.error(err);
      }
    });
    /* else {
                return res.status(400).json({
                  message: 'Instructor not found with the given id',
                  id: req.userId,
                });*/
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error while processing the upload",
      error,
    });
  }
};
