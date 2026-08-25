const mongoose = require('mongoose')
const itemSchema = new mongoose.Schema({
    name : {
        type: String,
        required : true
    },
    category : {
        type: String,
        required: true,
        enum: ['Fast Food','Desserts' , 'Drinks']
    },
    price : {
        type: Number,
        required: true,
    },
    ingredients: {
        type: [String],
    } 
})

module.exports = mongoose.model('MenuItem',itemSchema)