const { isValidObjectId } = require("mongoose");
var ObjectId = require('mongodb').ObjectID;
const Product = require("./product.model");

exports.getProducts = (req, res, next) => {

    Product.find().exec()
    .then(products => {
        res.status(200).json({
            products
        });
    }).catch((err) => {
        res.status(500).json({
            error: err,
            message: 'Failed to get all Products'
        });
    }); 
}

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
            message: 'Failed to get Product'
        });
    });
}

exports.createProduct = (req, res, next) => {

    const product = new Product({
        name: req.body.name,
        //thumbnail:req.body.thumbnail,
        sellername: req.body.sellername,
        price: req.body.price,
        description: req.body.description,      
    });

    product.save().then(product => {
        res.status(200).json({
            message: 'Product added Successfully',
            product
        });
    }).catch(err => {
        res.status(500).json({
            message: 'Error while creating product',
            error: err
        });
    });

    /*Course.find({name: req.body.name})
        .exec().then((courses) => {
            if(courses.length != 0) {
                return res.status(409).json({ 
                    msg: "already course exist with this name!" 
                });
            }

            if(req.userType == "INSTRUCTOR") {
                course.set('instructor', req.userId);

                course.save().then(course => {
                    res.status(200).json({
                        message: 'Course added Successfully',
                        course
                    });
                }).catch(err => {
                    res.status(500).json({
                        message: 'Error while creating course',
                        error: err
                    });
                });
            } else {
                return res.status(400).json({
                    message : 'Instructor not found with given id',
                    id : req.userId
                });
            }
        }).catch(err => {
            console.log(err)
            res.status(500).json({
                message: 'Error while finding course',
                error: err
            })
        });*/
}