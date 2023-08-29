const mongoose = require('mongoose');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs')

const jwtSecret = "22794756100663983720febngrbgv3120945259";

/*const Schema = mongoose.Schema({
    
    email: { type: String, required: true, minlength: 1,
         unique: true, trim: true,
        // match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: {type: String, required: true, minlength: 8},
    sessions: [{
        token: {
            type: String,
            required: true
        },
        expiresAt: {
            type: Number,
            required: true
        }
    }],
    products: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Products'
    }],
    resetToken:{
        type:String,
        default:''
    },
    resetTokenExpiration:{
        type:String,
        default:''
    },
});*/

const Schema = mongoose.Schema({
   
    email: {
        type: String,
        required: true
    },
    password: { 
        type: String,
        required: true 
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Products'
    }],
    resetToken:{
        type:String,
        default:''
    },
    resetTokenExpiration:{
        type:String,
        default:''
    }
});


Schema.methods.toJSON = function(){
    const user=  this;
    const userObject = user.toObject();

    //return the doc except the password and sessions 
    return _.omit(userObject, ['password', 'sessions']);
}

Schema.methods.generateAccessAuthToken = function(){
    const user = this;
    return new Promise((resolve, reject) => {
        //create json web token
        jwt.sign({_id: user._id.toHexString()}, jwtSecret, {expiresIn: '15m'}, (err, token) => {
            if(!err){
                resolve(token);
            } else{
                reject();
            }
        })
    })
}

Schema.methods.generateRefreshAuthToken = function(){
    //this mothod simply generate a 64byte hex string - it doesn't save it to the database
    return new Promise((resolve, reject) => {
      crypto.randomBytes(64,(err, buf) => {
        if(!err){
            let token = buf.toString('hex');
            return resolve(token);
        }
      })
    })
}

Schema.methods.createSession = function(){
    let user = this;

    return user.generateRefreshAuthToken().then((refreshToken) => {
        return saveSessionToDatabase(user, refreshToken);
    }).then((refreshToken) => {
        return refreshToken;
    }).catch((e) => {
        return Promise.reject('failed to save session to database.\n' +e);
    })
}

Schema.statics.getJWTSecret = () => {
    return jwtSecret;
}

//model methos(static methods)

Schema.statics.getJWTSecret = () => {
    return jwtSecret;
}
Schema.statics.findByIdAndToken = function(_id, token){
    //find user by id and token
    //used in auth middleware (varifysession)

    const User = this;
    return User.findOne({
        _id,
        'sessions.token': token
    })
}

Schema.statics.findByCredentials = function(email, password){
    let User = this;
    return User.findOne({email}).then((user) => {
        if(!user) return Promise.reject();

        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if(res){
                     resolve(user);
                }
                else{
                    reject();
                }
            })
        })
    })
}

Schema.statics.hasRefreshTokenExpired = (expiresAt) => {
    let secondsSinceEpoch = Date.now()/1000;
    if(expiresAt > secondsSinceEpoch)
    {
        //hasn't expired
        return false;
    }else{
        return true;
    }
}

//middleware
//before a user document is saved, this code runs
Schema.pre('save', function(next){
    let user = this;
    let costFactor = 10;

    if(user.isModified('password')){
        //if the password field has been edited/changed then run this code

        //generate salt and hash password
        bcrypt.genSalt(costFactor,(err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            })
        })
    } else{
        next();
    }
});



//helper methods
let saveSessionToDatabase = (user, refreshToken) => {
    return new Promise((resolve, reject) => {
        let expiresAt = generateRefreshTokenExpiryTime();

        user.sessions.push({'token': refreshToken, expiresAt});

        user.save().then(() => {
            return resolve(refreshToken);
        }).catch((e) => {
            reject(e);
        })
    })
}

let generateRefreshTokenExpiryTime = () => {
    let daysUntilExpire = "10";
    let secondsUntilExpire = ((daysUntilExpire * 24) * 60) * 60;
    return ((Date.now() / 1000) + secondsUntilExpire);
}

module.exports = mongoose.model('User', Schema);