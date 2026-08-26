const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  // Which table this order belongs to — a reference, same pattern as Reservation's tableId
  tableId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Table',
    required: true,
  },

  // The list of items ordered. Each entry is its OWN small object containing
  // a reference to a MenuItem, plus how many of that item were ordered.
  items: [
    {
      menuItemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenuItem',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1, 
      },
    },
  ],

  totalPrice: {
    type: Number,
    required: true,
    min: 0,
  },

  status: {
    type: String,
    required: true,
    enum: ['Pending', 'Preparing', 'Served', 'Paid'],
    default: 'Pending', 
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Order', orderSchema);