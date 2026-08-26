const mongoose = require('mongoose')
const reservationSchema = new mongoose.Schema({
    tableId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Table',
        required: true,
    },
    customerName : {
        type: String,
        required: true,
    },
    dateTime:{
        type : Date,
        required: true,
    },
    partySize: {
        type: Number,
        required: true,
    },
    createdAt:{
        type: Date,
        default: Date.now,
    }

})

module.exports = mongoose.model('Reservation',reservationSchema)