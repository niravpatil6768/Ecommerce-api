const User = require("./user.model");
const jwt = require("jsonwebtoken");
const { isValidObjectId } = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const express = require("express");
const router = express.Router();


/*exports.register = async (req, res, next) => {
    
   
        let body = req.body;
        let newUser = new User(body);
    
        newUser.save().then(() => {
            return newUser.createSession();
        }).then((refreshToken) => {
            //session created successfully - refreshtoken returned.
            //now we generate an access auth token for the user
    
            return newUser.generateAccessAuthToken().then((accessToken) => {
                return {accessToken, refreshToken}
            });
    }).then((authTokens) => {
        res
        .header('x-refresh-token', authTokens.refreshToken)
        .header('x-access-token', authTokens.accessToken)
        .send(newUser);
    }).catch((e) => {
        res.status(400).send(e);
        console.log("32");
    })
       
    };


  exports.login = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
 
    User.findByCredentials(email, password).then((user) => {
     return user.createSession().then((refreshToken) => {
        
         return user.generateAccessAuthToken().then((accessToken) => {
             return {accessToken, refreshToken}
         });
     }).then((authTokens) => {
         res
         .header('x-refresh-token', authTokens.refreshToken)
         .header('x-access-token', authTokens.accessToken)
         .send(user);
     })
     }).catch((e) => {
         res.status(400).send(e);
         console.log(email);
         console.log(password);
    })
 };*/



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
      } /*else {
        try {
          await this.emailVerification(req, res);
          console.log("User verification success");
        } catch (error) {
          return res.status(500).json({
            pathofmethod: "77 Error while sending email",
            error: error,
          });
        }*/
        try {
          const hash = await bcrypt.hash(req.body.password, 10);
  
          const user = new User({
            //firstName: req.body.firstName,
            //lastName: req.body.lastName,
            email: req.body.email,
            password: hash,
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
        const token = jwt.sign(
          {
            _id: user._id,
            email: user.email,
           // type: user.type,
          },
          process.env.JWT_SECRET
        );
  
        return res.status(200).json({
          message: "Login successful",
          token: token,
         
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
  

// module.exports = router; 