const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  imageURL: {
    type: String,
    required: true,
  },
  price:{
    type: Number,
    required: [true],
  },
  status: {
    type: String,
    enum: ['pending', 'in progress', 'completed', 'cancelled'],
    default: 'pending',
  },
  createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
  },
  servicesId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Services',
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
