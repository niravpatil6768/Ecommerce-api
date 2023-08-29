const mongoose=require('mongoose');

const CartSchema = mongoose.Schema({
    user: {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    products: [{
        productId:{
            type: mongoose.Schema.Types.ObjectId,
            required:true,
            ref: 'Products' 
        },
        price:{
            type:Number,
            required:true
        }
    }
    ],
    subTotal: {
        type: Number,
        default: 0        
    }
}, {
    timestamps: true
})
module.exports = mongoose.model('cart', CartSchema);