//middleware to upload file/photos to add for portfolio
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const createUploadDirs = () => {
    const dirs = ['uploads', 'uploads/portfolio', 'uploads/profile'];
    dirs.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });
};

createUploadDirs();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const folder = file.fieldname === 'portfolio' ? 
        'uploads/portfolio' : 
        'uploads/profile';
        cb(null, folder);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const fileFilter = (req, file, cb) => {
    // Accept images only
    if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    // Limit file size to 5MB
    if (file.size > 5 * 1024 * 1024) {
        return cb(new Error('File size exceeds 5MB!'), false);
    }
    cb(null, true);
}
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    }


const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024, } // 5 MB limit
}).fields([
    { name: 'portfolio', maxCount: 1 },
    { name: 'profile', maxCount: 1 }
]);
