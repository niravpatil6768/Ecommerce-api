const { isValidObjectId } = require("mongoose");
const Cart = require("./cart.model");
const Product = require("../product/product.model");
const User = require("../user/user.model");


exports.getCart = (req, res) => {
    let userId = req.params.userId;
    //let userId = decoded._id
   // console.log( decoded._id+ "11");
    if(!isValidObjectId(userId)) {
        return res.status(400).json({
            message : 'Invalid user id',
        });
    }
    
    User.findById(userId)
        .exec()
        .then((user) => {
            if (!user) {
                return res.status(400).json({
                    msg: "User not found with given id 23",
                });
            }
        });

    Cart.findOne({ user: userId }).populate('products.productId')
        .exec()
        .then((cart) => {
            if (cart) {
                res.status(200).json({
                    cart
                });
            } else {
                return res.status(200).json({
                    msg: "Cart empty for this user",
                    cart
                });
            }
        });
};

exports.addItemToCart = (req, res) => {
    const { productId } = req.body;
    const userId = req.params.userId;
    //let userId = decoded._id
    console.log(userId);
    if(!isValidObjectId(userId)) {
        return res.status(400).json({
            message : 'Invalid user id',
        });
    }

    User.findById(userId)
        .exec()
        .then((user) => {
            if (!user) {
                return res.status(400).json({
                    msg: "User not found with given id",
                });
            }

        });

    Product.findById(productId)
        .exec()
        .then((product) => {
            if (!product) {
                return res.status(404).json({
                    message: "Product not found",
                });
            }

            try {
                Cart.findOne({ user: userId })
                    .exec()
                    .then((cart) => {
                        if (cart) {
                            const indexFound = cart.products.findIndex(
                                (item) => item.productId == productId
                            );
                           /* if (indexFound > -1) {
                                return res.status(200).json({
                                    msg: "Product exists in cart",
                                });
                            }*/

                            cart.products.push({
                                    productId: productId,
                                    price: product.price
                                }
                            );
                            
                            cart.subTotal = cart.products.map((item) => item.price).reduce((acc, next) => acc + next, 0);
                            cart.save().then((cart) => {
                                return res.status(200).json({
                                    msg: "Product added",
                                    cart,
                                });
                            });
                        } else {
                            const cartData = {
                                user: userId,
                                products: [
                                    {
                                        productId,
                                        price: product.price
                                    }
                                ],
                                subTotal: product.price,
                            };
                            cart = new Cart(cartData);
                            cart.save().then((cart) => {
                                return res.status(200).json({
                                    msg: "Product added",
                                    cart,
                                });
                            });
                        }
                    });
            } catch (err) {
                return res.status(400).json({
                    type: "Invalid",
                    msg: "Something Went Wrong",
                    err: err,
                });
            }
        })
        .catch((err) => {
            return res.status(500).json({
                error: err,
                message: "Failed to get Product",
            });
        });
};

exports.removeItem = (req, res) => {
    const userId = req.params.userId;
    const productId = req.params.productId;

    if(!isValidObjectId(userId)) {
        return res.status(400).json({
            message : 'Invalid user id',
        });
    }

    User.findById(userId)
        .exec()
        .then((user) => {
            if (!user) {
                return res.status(400).json({
                    msg: "User not found with given id",
                });
            }
        });
    Cart.findOne({ user: userId })
        .exec()
        .then((cart) => {
            if (!cart) {
                return res.status(200).json({
                    message: "Empty cart",
                    cart
                });
            }
            const indexFound = cart.products.findIndex((item) => item.productId == productId);
            if (indexFound > -1) {
                cart.products.splice(indexFound, 1);

                cart.subTotal = cart.products
                    .map((item) => item.price)
                    .reduce((acc, next) => acc + next, 0);

                cart.save().then((cart) => {
                    return res.status(200).json({
                        msg: "Product removed from cart",
                        cart: cart,

                    });
                });
            }
            else {
                return res.status(400).json({
                    msg: "No product with this id in cart"
                });
            }
        });
};
