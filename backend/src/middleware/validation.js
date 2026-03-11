const validateProfile = (req, res, next) => {
    const  { username, email, password } = req.body;
    const errors = [];
    if (!username || username.trim().length < 3) {
        errors.push('userame must be at least 3 characters long');
    }

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
        errors.push('Invalid email address');
    }
    if (!password || password.length < 6) {
        errors.push('Password must be at least 6 characters long');
    }

    if (!req.body.bustSize || isNaN(req.body.bustSize)) {
        errors.push('Bust size must be a number in centimeters (cm)');
    }
    if (!req.body.waistSize || isNaN(req.body.waistSize)) {
        errors.push('Waist size must be a number in centimeters (cm)');
    }
    if (!req.body.hipSize || isNaN(req.body.hipSize)) {
        errors.push('Hip size must be a number in centimeters (cm)');
    }

    if (errors.length > 0) {
        return res.status(400).json({ 
            success: false,
            message: 'Validation failed',
            errors });
    }
    next();
    };

module.exports= { validateProfile };