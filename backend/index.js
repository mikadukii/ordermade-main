require('dotenv').config();

const config = require('./config.json');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const express = require('express');
const serverless = require("serverless-http");

// Create an Express apps
// comment
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const upload = require('./multer');
const Order = require('./src/models/order.model.js');

app.use(cors());


const {authenticateToken, isAdmin} = require('./utilities.js');
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Check if the connection is successful
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.log('Error connecting to MongoDB:', err);
});


app.use(cors({
  origin: ["https://ordermade-bay.vercel.app"],
  methods: [POST, GET],
  credentials: true
}));

app.options('*', cors());

//handler for image upload
app.post("/image-upload", upload.single("image"), async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("Received file:", req.file); // Log the received file
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const BASE_URL = process.env.BASE_URL;

    const imageURL = `${BASE_URL}/uploads/${req.file.filename}`;
    res.status(201).json({ imageURL });

  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Use middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const adminRoutes = require('./src/routes/adminRoute.js'); // adjust path as needed
app.use('/api/admin', adminRoutes);

// Define the User model
const User = require('./src/models/user.models.js');
const Portfolio = require('./src/models/portfolio.model.js');
const Services = require('./src/models/services.model.js');

// Register Account
app.post("/api/register", async (req, res) => {
  const { username, email, password, bustSize, waistSize, hipSize } = req.body;

  if (!username || !email || !password || !bustSize || !waistSize || !hipSize) {
    return res.status(400).json({ message: 'Please fill all fields' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const newUser = new User({
      username,
      email,
      password, 
      bustSize,
      waistSize,
      hipSize,
    });

    await newUser.save(); 

    const accessToken = jwt.sign(
      { userId: newUser._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '72h' }
    );

    return res.status(201).json({
      error: false,
      user: { username: newUser.username, email: newUser.email },
      accessToken,
      message: 'User created successfully'
    });
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({ message: 'Internal server error during registration' });
  }
});



app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please fill all fields' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'User did not register the email yet' });
  }

  console.log('Attempt login:', { email, passwordAttempt: password });
  console.log('Stored password hash:', user.password);

  let isPasswordValid = false;
  try {
    isPasswordValid = await bcrypt.compare(password, user.password);
  } catch (error) {
    console.error('bcrypt compare error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }

  console.log('Password valid:', isPasswordValid);

  if (!isPasswordValid) {
    return res.status(400).json({ message: 'Invalid password' });
  }

  const accessToken = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '72h' }
  );

  return res.status(200).json({
    error: false,
    user: {
      userId: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    accessToken,
    message: 'Login successful',
  });
});


// admin-only route
app.get('/admin-dashboard', authenticateToken, isAdmin, (req, res) => {
  res.status(200).json({ message: 'Welcome to the Admin Dashboard!' });
});

app.get("/get-user", authenticateToken, async (req, res) => {
  const { userId } = req.user; // Assuming you are getting the userId from the authenticated token

  try {
    // Find the user by ID, which should return a single user object
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the single user object
    return res.json({
      user,  // Single user object, not an array
      message: "User fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});


app.get("/get-user-profile", authenticateToken, async (req, res) => {
  const { userId } = req.user;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json({ user });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


app.put("/edit-profile/:id", authenticateToken, async (req, res) => {
  const { username, bustSize, waistSize, hipSize } = req.body;
  const { id } = req.params;
  const { userId } = req.user;

  if (!username || !bustSize || !waistSize || !hipSize) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  if (id !== userId) {
    return res.status(403).json({ message: "Unauthorized access" });
  }

  try {
    const updateFields = { username, bustSize, waistSize, hipSize };

    const updatedUser = await User.findByIdAndUpdate(id, updateFields, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      error: false,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});



app.post("/add-portfolio", authenticateToken, isAdmin, async (req, res) => {
  try {
      const { title, description, imageURL } = req.body;
      const { userId } = req.user;

      if (!title || !description || !imageURL) {
          return res.status(400).json({
              error: true,
              message: 'Please fill all fields',
          });
      }

      const portfolio = new Portfolio({
          title,
          description,
          imageURL,
          createdBy: userId,
      });

      await portfolio.save();

      return res.status(201).json({
          error: false,
          message: 'Portfolio created successfully',
      });

  } catch (error) {
      console.error('Error creating portfolio:', error);
      return res.status(500).json({
          error: true,
          message: 'Internal server error',
      });
  }
});


app.post('/place-order', authenticateToken, async (req, res) => {
  const { title, description, imageURL, servicesId } = req.body;
  const { userId } = req.user;

  if (!title || !description || !imageURL || !servicesId) {
    return res.status(400).json({ message: 'Please fill all fields' });
  }

  try {
    const newOrder = new Order({
      title,
      description,
      imageURL,
      servicesId,
      createdBy: req.user.userId,
    });

    await newOrder.save();
    res.status(201).json({ message: 'Order placed successfully' , order: newOrder});
  } catch (error) {
    console.error('Error placing order:', error);
    return res.status(500).json({ message: 'Failed to place order', error: error.message });
  }  
});

// Get logged-in user's own orders
app.get("/user-orders", authenticateToken, async (req, res) => {
  const { userId } = req.user;

  try {
    const orders = await Order.find({ createdBy: userId })
      .populate("servicesId") // Include service details
      .sort({ createdAt: -1 }); // Optional: latest first

    res.status(200).json({ orders });
  } catch (err) {
    console.error("Failed to fetch user orders", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


  
// serve static files from uploads and assets directory
app.use('/uploads', express.static(path.join(__dirname,'uploads')));
app.use('/assets', express.static(path.join(__dirname,'assets')));


//delete image from uploads
app.delete("/delete-image", async (req, res) => {
  const { imageURL } = req.body;
  if (!imageURL) {
      return res.status(400).json({ message: "No image URL provided" });
  }

  try {
    // Check if the file exists
    const filename = path.basename(imageURL);

    // Construct the file path
    const filePath = path.join(__dirname, 'uploads', filename);

    if (fs.existsSync(filePath)) {
      // Delete the file
      fs.unlinkSync(filePath);
      return res.status(200).json({ message: "Image deleted successfully" });
    } else {
      return res.status(404).json({ message: "Image not found" });
    }
  } catch (error) {
    res.status (500).json({ message: "Internal server error" });
  }
});

app.get("/get-portfolio", async (req, res) => {
  try {
    const portfolios = await Portfolio.find(); // You can filter by isPublished if needed
    res.status(200).json({ portfolio: portfolios });
  } catch (error) {
    res.status(500).json({ error: true, message: 'Internal server error' });
  }
});


app.get("/get-services", authenticateToken, async (req, res) => {
    try {
        const isServices = await Services.find({ createdBy : userId});
        res.status(200).json({ services: isServices });
    } catch (error) {
        res.status(500).json({ error: true, message: 'Internal server error' });
    }
})

// Get all services (public)
app.get('/services', async (req, res) => {
  try {
    const services = await Services.find(); // or whatever your model is
    res.json({ services });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch services' });
  }
});

// Get services by ID (public)
app.get('/get-services-id/:id', authenticateToken, async (req, res) => {
  try {
    const services = await Services.findById(req.params.id);
    if (!services) return res.status(404).json({ message: 'Service not found' });
    res.json({ services });
  } catch (err) {
    console.error('GET /services/:id error', err);
    res.status(500).json({ message: 'Server error' });
  }
});


app.put("/edit-portfolio/:id", authenticateToken, isAdmin, async (req, res) => {
    const { title, description, imageURL } = req.body;
    const { userId } = req.user;
    const { id } = req.params;

    // validation
    if (!title || !description || !imageURL) {
        return res.status(400).json({ message: 'Please fill all fields' });
    }

    try {
        const portfolio = await Portfolio.findByIdAndUpdate(id, {
            title,
            description,
            imageURL,
            userId,
        }, { new: true });

        return res.status(201).json({
            error: false,
            message: 'Portfolio updated successfully',
        });
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
})
  


app.delete("/delete-portfolio/:id", authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  try {
    const portfolio = await Portfolio.findOne({ _id: id, createdBy: userId });
    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    const imageURL = portfolio.imageURL;
    const filename = path.basename(imageURL);
    const filePath = path.join(__dirname, 'uploads', filename);

    // Delete portfolio
    await Portfolio.deleteOne({ _id: id, createdBy: userId });

    // Delete image file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return res.status(200).json({ message: "Portfolio deleted successfully" });
  } catch (error) {
    console.error('Error deleting portfolio:', error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/delete-services/:id", authenticateToken, isAdmin, async (req, res) => {
    const { id } = req.params;
    const { userId } = req.user;
    try {
        await Services.findByIdAndDelete(id);
        res.status(200).json({ message: "Services deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: true, message: 'Internal server error' });
    }

    // delete services from database
    await Services.deleteOne({ _id: id, userId: userId });
    
    const imageURL = services.imageURL;
    const filename = path.basename(imageURL);

    const filePath = path.join(__dirname, 'uploads', filename);

    fs.unlink(filePath, (err) => {
        if (err) {
            console.error('Error deleting file:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        console.log('File deleted successfully:', filePath);
    });
    res.status(200).json({ message: 'Services deleted successfully' });
});


//stripe payment integration
const stripe = require('stripe')('sk_test_51RRpyq2eCI3ypHyOVP4Ycj1IUB8IBiV7xDFlTQO4Bhu2fH6dEyAODcVzz7BVXYpSQquRQK0HTYnkZT8Az7RauXaB002TsoCUOi'); 

app.post('/create-checkout-session', authenticateToken, async (req, res) => {
  const { servicesId, title, description, imageURL } = req.body;

  try {
    const services = await Services.findById(servicesId);
    if (!services) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Construct query string to redirect back after Stripe
    const successUrl = new URL(`${BASE_URL}/order-success`);
    successUrl.searchParams.append('servicesId', servicesId);
    successUrl.searchParams.append('title', encodeURIComponent(title));
    successUrl.searchParams.append('desc', encodeURIComponent(description));
    successUrl.searchParams.append('imageURL', encodeURIComponent(imageURL));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: services.title,
              images: [services.imageURL], // ✅ must be a full URL
            },
            unit_amount: services.price * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl.toString(),
      cancel_url: 'http://localhost:5173/order-cancelled',
    });

    return res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe session error:', err);
    return res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

app.get('/recommended-services', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const orders = await Order.find({ userId }).populate('servicesId');

    if (!orders.length) {
      const fallbackServices = await Services.find().limit(5);
      return res.status(200).json({ recommended: fallbackServices });
    }

    const categoryCount = {};
    orders.forEach(order => {
      const category = order.servicesId.category || 'general';
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });

    const mostFrequentCategory = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0][0];

    const recommended = await Services.find({ category: mostFrequentCategory }).limit(5);

    res.status(200).json({ recommended });
  } catch (error) {
    console.error('Error fetching recommended services:', error);
    res.status(500).json({ message: 'Error fetching recommendations' });
  }
});

// Start the server
module.exports = app;


