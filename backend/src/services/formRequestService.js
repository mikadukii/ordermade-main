const FormRequest = require('../models/FormRequest');
const Content = require('../models/Content');

class FormRequestService {
    async createFormRequest(data) {
        return await FormRequest.create(data);
    }

    async getAllFormRequests() {
        return await FormRequest.find().populate('content');
    }

    async getFormRequestById(id) {
        return await FormRequest.findById(id).populate('content');
    }

    async updateFormRequest(id, data) {
        return await FormRequest.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteFormRequest(id) {
        return await FormRequest.findByIdAndDelete(id);
    }
}

module.exports = new FormRequestService();
