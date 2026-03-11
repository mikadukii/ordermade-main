// routes/recommended.js
const express = require('express');
const router = express.Router();
const Order = require('../models/order.model.js'); // assuming you have an Order model
const Services = require('../models/services.model.js'); // assuming you have a Service model


router.get('/recommended-services/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // 1. Get user's past orders
    const orders = await Order.find({ userId }).populate('servicesId'); // assuming each order has serviceId

    if (!orders.length) {
      // Fallback to default popular or random services
      const fallbackServices = await Services.find().limit(5);
      return res.status(200).json({ recommended: fallbackServices });
    }

    // 2. Count most frequent service categories from past orders
    const categoryCount = {};
    orders.forEach(order => {
      const category = order.servicesId.category || 'general';
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });

    const mostFrequentCategory = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0][0];

    // 3. Recommend services from that category
    const recommended = await Services.find({ category: mostFrequentCategory }).limit(5);

    res.status(200).json({ recommended });
  } catch (error) {
    console.error('Error fetching recommended services:', error);
    res.status(500).json({ message: 'Error fetching recommendations' });
  }
});


module.exports = router;
