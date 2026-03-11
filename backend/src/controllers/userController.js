const User = require('../models/User');


exports.register = async (req, res) => {    
    try {
        const { name, email, password } = req.body;
        // Check if user already exists
        const existingUser = await User.findOne({ 
            $or: [{ email }, { name }]
        });
        if (existingUser) {
            return res.status(400).json({ 
                success: false,
                message: existingUser.email === email? 'Email already registered' : 'Name already taken' 
            });
        }
        // Create new user
        const newUser = new User({ 
            name, 
            email, 
            password,
            role: 'user', // Default role
            bustSize,
            waistSize,
            hipSize,
            profilePicture: req.file ? req.file.path : 'default.jpg' // Assuming you're using multer for file uploads
        });
        await newUser.save();

        res.status(201).json({ 
            success: true, 
            message: 'User registered successfully', 
            user: { id: newUser._id, name: newUser.name, email: newUser.email } 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'User Registration Failed',
            error: error.message
         });
    }
}