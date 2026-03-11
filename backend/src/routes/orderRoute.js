const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const Order = require('../models/order.model.js');
const Services = require('../models/services.model.js');




// routes/orders.js
router.get('/my-orders', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId; // Make sure this is from auth middleware

    const orders = await Order.find({ createdBy: userId })
      .populate('servicesId'); // Populate service details

    res.status(200).json({ orders });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;