const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Fast Food', 'Desserts', 'Drinks']
    },
    price: {
        type: Number,
        required: true,
    },
    // Each ingredient is now an OBJECT, not just a plain string —
    // it points to a real InventoryItem AND records how much of it is used
    ingredients: [
        {
            inventoryItemId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'InventoryItem',
                required: true,
            },
            quantityUsed: {
                type: Number,
                required: true,
                min: 0,
            },
        },
    ],
})

module.exports = mongoose.model('MenuItem', itemSchema)