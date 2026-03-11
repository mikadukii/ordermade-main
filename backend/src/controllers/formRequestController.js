const Content = require('../models/Content');
const FormRequest = require('../models/FormRequest');
const formRequestService = require('../services/formRequestService');

const formRequestController = {
    async create(req, res) {
        try {
            const formRequest = await formRequestService.createFormRequest(req.body);
            res.status(201).json(formRequest);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async getAll(req, res) {
        try {
            const formRequests = await formRequestService.getAllFormRequests();
            res.json(formRequests);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async getById(req, res) {
        try {
            const formRequest = await formRequestService.getFormRequestById(req.params.id);
            if (!formRequest) return res.status(404).json({ message: 'Form request not found' });
            res.json(formRequest);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async update(req, res) {
        try {
            const formRequest = await formRequestService.updateFormRequest(req.params.id, req.body);
            if (!formRequest) return res.status(404).json({ message: 'Form request not found' });
            res.json(formRequest);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async delete(req, res) {
        try {
            const formRequest = await formRequestService.deleteFormRequest(req.params.id);
            if (!formRequest) return res.status(404).json({ message: 'Form request not found' });
            res.json({ message: 'Form request deleted' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = formRequestController;

