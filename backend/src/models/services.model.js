const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const servicesSchema = new Schema({
    title:{
        type: String,
        required: [true, 'Title is required'],
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['formal dress', 'cosplay', 'wedding']
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    imageURL: {
        type: String,
        required: [true, 'image URL is required']
    },
    fileName: String,
    fileType: String,
    fileSize: Number,
    featured: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
}, {
    timestamps: true //createdAt, updatedAt
});

servicesSchema.index({ title: 'text', description: 'text' });
servicesSchema.index({ price: 1 });
servicesSchema.index({ category: 1 });
servicesSchema.index({ createdAt: 1 });
servicesSchema.index({ updatedAt: 1 });

module.exports = mongoose.model('Services', servicesSchema);
