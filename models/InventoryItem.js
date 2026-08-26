const mongoose = require('mongoose');
const inventoryItemSchema = new mongoose.Schema({
    item:{
        type: String,
        required: true,
    },
    quantity:{
        type: Number,
        required: true,
        min: 0,
    },
    unit : {
        type: String,
        required: true,
        enum : ['kgs','litres','grams','pieces']
    },
    lowStockThreshold:{
        type : Number,
        default: 5,
    }

})

module.exports = mongoose.model('InventoryItem',inventoryItemSchema)