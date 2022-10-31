const mongoose = require('mongoose');

const company = mongoose.Schema(
    {
        company_name: { type: String, required: true },
        company_msg: { type: String, required: true },
        phone: { type: String, required: true },
        type: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
    }
);

module.exports = mongoose.model('company', company);