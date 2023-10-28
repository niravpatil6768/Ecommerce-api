const User = require("./user.model");
const jwt = require("jsonwebtoken"); //for handing JSON WEB TOKEN
const { isValidObjectId } = require("mongoose"); //to check validobjectid or not.
const bcrypt = require("bcryptjs"); // use to parse password, store parse pass. and compare it.
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
       
          //new user object created
          const user = new User({
            
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
  
  // compare body pass with hashed pass using bcrypt.compare
      const result = await bcrypt.compare(req.body.password,user.password);
      console.log(req.body.password);
      console.log(result);
      console.log(user.password);
      if (result) {
        secret = "27676ghgtysj"
        //generate JSON web token which contain user-related info. such as user Id, email, type. it's signed using secret key.
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

  //get all users
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

 

  exports.deleteUser = async (req, res) => {
    const userId = req.params.userId;
    const loggedInUserRole = req.userType;
  
    if (!isValidObjectId(userId))
      return res.status(400).json({
        message: "User not found with given id",
        id: req.params.id,
      });
  
    try {
      const user = await User.findOneAndDelete({ _id: userId });
  
      if (user) {
        
          return res.status(200).json({
            message: "User Deleted Successfully",
            
          });
        
      } else {
        return res.status(404).json({
          message: "User not found",
        });
      }
    } catch (err) {
      return res.status(500).json({
        message: "Error while deleting user",
        error: err,
      });
    }
  };
  

 