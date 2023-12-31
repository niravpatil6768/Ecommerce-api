const mongoose = require('mongoose');

const Schema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
  
    sellername: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    seller: {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    productImage: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['ELECTRONICS','FASHION', 'SPORTS','ALL'],
        default: 'ALL'
    },
   
    
    //thumbnail_url:{type: String}
});

module.exports = mongoose.model('Products', Schema);