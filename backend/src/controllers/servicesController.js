const Services = require('../models/Services');
const fs = require('fs').promises;
const path = require('path');

exports.getAllServices = async (req, res) => {
    try {
        const  { search, category, sortBy = 'newest', page = 1, limit = 10 } = req.query;
        const query = {};
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        if (category) 
            query.category = category;

        if(!req.userRole || req.userRole !== 'admin') {
            query.status = 'published';
        }

        const sortOptions =  {
            newest: { createdAt: -1 },
            oldest: { createdAt: 1 },
            priceLowToHigh: { price: 1 },
            priceHighToLow: { price: -1 },
            aToZ: { title: 1 },
            zToA: { title: -1 }
        };

        const skip = (page - 1) * limit;
        const total = await Services.countDocuments(query);

        const content = await Services.find(query)
            .sort(sortOptions[sortBy])
            .skip(skip)
            .limit(limit)
            .populate('user', 'name email profilePicture')

        res.json({
            success: true,
            content,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching services',
            error: error.message
        });
    }
};

exports.getServices = async (req, res) => {
    try {
        const services = await Services.findById(req.params.id)
            .populate('createdBy', 'username');
        
        if (!services) {
            return res.status(404).json({
                success: false,
                message: 'Services not found'
            });
        }


        res.json({
            success: true,
            data: services
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching services',
            error: error.message
        });
    }
};

//upload services
exports.uploadServices = async (req, res) => {
    try {
        console.log('Uploading services...');
        console.log('Headers:', req.headers);
        console.log('User ID:', req.userId);
        console.log('Files:', req.files);
        console.log('Body:', req.body);
        
        //file validation
        if (!req.files?.file?.[0] || !req.files?.thumbnail?.[0]) {
            return res.status(400).json({
                success: false,
                message: 'Services sample and thumbnail are required'
            });
        }

        //input validation
        const { title, description, price, category } = req.body;
        if (!title || !description || !price || !category) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        //userID validation
        if (!req.userId) {
            return res.status(401).json({
                success: false,
                message: 'User ID not found'
            });
        }

        const servicesFile = req.files.file[0];
        const thumbnailFile = req.files.thumbnail[0];

        //create new services
        const services = new Services({
            title: title.trim(),
            description: description.trim(),
            price,
            category,
            fileUrl: `/uploads/services/${servicesFile.filename}`,
            thumbnail: `/uploads/thumbnails/${thumbnailFile.filename}`,
            fileName: servicesFile.originalname,
            fileSize: servicesFile.size,
            fileType: servicesFile.mimetype,
            createdBy: req.userId,
            status: 'published'
        });
        await services.save();

        res.status(201).json({
            success: true,
            message: 'Services uploaded successfully',
            data: services
        });

    } catch (error) {
        console.error('Error uploading services:', error.message);
        if (req.files) {
        try {
            const filesToDelete = [
                req.files.file?.[0]?.path,
                req.files.thumbnail?.[0]?.path
            ].filter(Boolean);

        await Promise.all(
            filesToDelete.map(filePath => 
                fs.unlink(filePath).catch(err => 
                    console.error( `Error deleting file ${filePath}:` , err)
                )
            )
        );
    } catch (cleanupError) {
        console.error('Error during cleanup:', cleanupError);
    }
}
        res.status(500).json({
            success: false,
            message: 'Error uploading services',
            error: error.message
        });
    }
};

//update services
exports.updateServices = async (req, res) => {
    try {
        const services = await Services.findById(req.params.id);
        if (!services) {
            return res.status(404).json({
                success: false,
                message: 'Services not found'
            });
        }

        //File updates
        if (req.files?.file?.[0]) {
            const oldFilePath = path.join(__dirname, '../..', services.fileUrl);
            await fs.unlink(oldFilePath);

            services.fileUrl = `/uploads/services/${req.files.file[0].filename}`;
            services.fileName = req.files.file[0].originalname;
            services.fileSize = req.files.file[0].size;
            services.fileType = req.files.file[0].mimetype;
        }

        if (req.files?.thumbnail?.[0]) {
            const oldThumbnailPath = path.join(__dirname, '../..', services.thumbnail);
            await fs.unlink(oldThumbnailPath);

            services.thumbnail = `/uploads/thumbnails/${req.files.thumbnail[0].filename}`;
        }

        //Update services
        const allowedUpdates = [ 'title', 'description', 'price', 'category' ];
        allowedUpdates.forEach(update => {
            if (req.body[update] !== undefined) {
                services[update] = req.body[update];
            }
        });

        await services.save();

        res.json({
            success: true,
            data: services
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

//delete services
exports.deleteServices = async (req, res) => {
    try {
        const services = await Services.findById(req.params.id);
        if (!services) {
            return res.status(404).json({
                success: false,
                message: 'Services not found'
            });
        }

        //Delete files
        const filePath = path.join(__dirname, '../..', services.fileUrl);
        const thumbnailPath = path.join(__dirname, '../..', services.thumbnail);

        await Promise.all([
            fs.unlink(filePath),
            fs.unlink(thumbnailPath)
        ]);

        await services.remove();

        res.json({
            success: true,
            message: 'Services deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
