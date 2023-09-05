const User = require("./user.model");
const jwt = require("jsonwebtoken");
const { isValidObjectId } = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const express = require("express");
const router = express.Router();




/*>>>>>>>*/
 exports.register = async (req, res, next) => {
    try {
      if (!this.validateEmail(req.body.email)) {
        return res.status(400).json({ msg: "Invalid email" });
      }
  
      const users = await User.find({ email: req.body.email }).exec();
      console.log(users);
      if (users.length != 0) {
        return res.status(409).json({
          msg: "already user exist with this email!",
        });
      } 
        try {
       
          const user = new User({
            //firstName: req.body.firstName,
            //lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            type: req.body.type,
          });
  
          try {
            const response = await user.save();
            return res.status(200).json({
              message: "registered successfully",
            });
          } catch (error) {
            return res.status(500).json({
              pathofmethod: "Error while registering users",
              error,
            });
        }
        } catch (error) {
          return res.status(500).json({
            error,
          });
        }
      }
    
    catch (error) {
      res.status(500).json({
        error: error,
        message: "Error while finding user",
      });
    }
  };

  exports.validateEmail = function (email) {
    var re = new RegExp("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$");
    if (!re.test(email)) return false;
    return true;
  };

 exports.login = async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email }).exec();
      
      if (!user) {
        return res.status(401).json({
          message: "Authentication failed: User not found",
        });
      }
  
      //const hash = await bcrypt.hash(req.body.password, 10);
  
      const result = await bcrypt.compare(req.body.password,user.password);
      console.log(req.body.password);
      console.log(result);
      console.log(user.password);
      if (result) {
        secret = "27676ghgtysj"
        const token = jwt.sign(
          {
            _id: user._id,
            email: user.email,
            type: user.type,
          },
          secret
        );
  
        return res.status(200).json({
          message: "Login successful",
          token: token,
          type: user.type
         
        });
      }
  
      return res.status(401).json({
        message: "Invalid credentials",
      });
    } catch (error) {
      return res.status(500).json({
        error: error,
        message: "Error while logging in",
      });
    }
  };

  exports.getUsers = (req, res, next) => {
    const loggedInUserRole = req.userType;
    let tempQuery = {};
    if (loggedInUserRole == "SUPERADMIN") {
      tempQuery = {};
    } 
    
  
    User.find(tempQuery)
      .exec()
      .then((response) => {
        res.status(200).json(response);
      })
      .catch((err) => {
        res.status(500).json({
          pathofmethod: "Error while getting users",
          error: err,
        });
      });
  };

  exports.deleteUser = (req, res) => {
    let userId = req.params.userId;
    //const loggedInUserRole = req.userType;
   // console.log("1"+loggedInUserRole);
    console.log("2"+req.userType);
    if (!isValidObjectId(userId))
      return res.status(400).json({
        message: "User not found with given id",
        id: req.params.id,
      });
  
    User.findOneAndRemove(userId, (err, user) => {
      if (!err) {
        if (user != null) {
          {
            res.status(200).json({
              message: "User Deleted Successfully",
              user,
            });
          }
        } else {
          res.status(404).json({
            message: "User not found",
          });
        }
      } else {
        res.status(500).json({
          message: "Error while deleting user",
          error: err,
        });
      }
    });
  };

 