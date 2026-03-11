// scripts/createAdmin.js
// this is for creating scripts for admin creation
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/user.models'); // Adjust the path as necessary

// Load environment variables (if using .env for DB connection string)
dotenv.config();

// Replace with your actual MongoDB URI
const mongoURI = process.env.MONGO_URI || 'mongodb+srv://michachael707:WenDqE4iy75PDi5x@cluster0.ybnmkfq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('MongoDB connected');
    createAdmin();
  })
  .catch(err => console.log('MongoDB connection error:', err));

async function createAdmin() {
  const email = 'ordermade@gmail.com';
  const password = 'ordermadeAdmin'; // default password
  const username = 'ordermade';

  try {
    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      console.log('⚠️ Admin user already exists:', existingAdmin.email);
    } else {
      const adminUser = new User({
        username,
        email,
        password,
        role: 'admin',
      });

      await adminUser.save();
      console.log('✅ Admin user created successfully!');
    }
  } catch (err) {
    console.error('❌ Error creating admin user:', err);
  } finally {
    mongoose.connection.close();
  }
}
