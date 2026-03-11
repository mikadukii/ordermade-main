const express = require('express');
const router = express.Router();
const { authenticateToken, isAdmin } = require('../../utilities');
const Services = require('../models/services.model.js');
const Order = require('../models/order.model.js');



router.post("/add-services", authenticateToken, isAdmin, async (req, res) => {
  try {
      const { title, price, category, description, imageURL } = req.body;
      console.log(req.body);  // Log the received data for debugging

      const { userId } = req.user;

      // Validate input fields
      if (!title || !price || !category || !description || !imageURL) {
          return res.status(400).json({
              error: true,
              message: 'Please fill all fields',
          });
      }

      // Create and save the service to the database
      const newServices = new Services({
          title,
          price,
          category,
          description,
          imageURL,
          createdBy: userId,
      });

      await newServices.save();

      return res.status(201).json({
          error: false,
          message: 'Services created successfully',
      });

  } catch (error) {
      console.error('Error adding services:', error);
      return res.status(500).json({
          error: true,
          message: 'Internal server error',
      });
  }
});

// Delete services (admin only)
router.delete('/delete-services/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const deleted = await Services.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Service not found' });
    res.json({ message: 'Service deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

router.put("/edit-services/:id", authenticateToken, isAdmin, async (req, res) => {
    const { title, price, category, description, imageURL } = req.body;
    const { userId } = req.user;
    const { id } = req.params;
  
    // Validation
    if (!title || !price || !category || !description || !imageURL) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }
  
    try {
      const services = await Services.findByIdAndUpdate(id, {
        title,
        price,
        category,
        description,
        imageURL,
        updatedBy: userId,
      }, { new: true });
  
      return res.status(201).json({
        services: services,
        message: 'Services updated successfully',
      });
    } catch (error) {
      return res.status(400).json({ error: true, message: 'Internal server error' });
    }
  }
); 

// Get services by ID (public)
// in your services router (e.g. routes/services.js)
router.get('get-services/:id', authenticateToken, async (req, res) => {
  try {
    const svc = await Services.findById(req.params.id);
    if (!svc) return res.status(404).json({ message: 'Service not found' });
    res.json(svc);
  } catch (err) {
    console.error('GET /services/:id error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// View all services (admin only)
router.get('/all-services', authenticateToken, isAdmin, async (req, res) => {
  try {
    const services = await Services.find();
    res.json({ services });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all services' });
  }
});

// View all orders (admin only)
router.get('/all-orders', authenticateToken, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('servicesId')   // ✅ Correct field from schema
      .populate('createdBy');   // ✅ Correct field from schema

    res.json({ orders });
  } catch (error) {
    console.error('Fetch orders error:', error);
    res.status(500).json({ message: 'Error fetching all orders', error: error.message });
  }
});

router.put('/update-order-status/:orderId', authenticateToken, isAdmin, async (req, res) => {
    try {
      const { status } = req.body;
      const updatedOrder = await Order.findByIdAndUpdate(
        req.params.orderId,
        { status },
        { new: true }
      );
      if (!updatedOrder) return res.status(404).json({ error: 'Order not found' });
      res.json(updatedOrder);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update order status' });
    }
  });  

module.exports = router;
