const mongoose = require('mongoose');
const tableSchema = new mongoose.Schema({
    tableNo: {
        type: Number,
        unique: true,
        required: true,
    },
    capacity:{
        type: Number,
        required: true,
    },
    status:{
        type: String,
        required: true,
        enum: ['Free','Occupied','Reserved'],
        default: 'Free',
    }
})
module.exports = mongoose.model('Table',tableSchema)