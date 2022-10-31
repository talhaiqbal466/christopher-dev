const mongoose = require('mongoose');

const file = mongoose.Schema(
    {
        name: { type: String, required: false },
        file: { type: String, required: false },
        file_ext: { type: String, required: false },
        msg_id: { type: String, required: false },
        createdAt: { type: Date, default: Date.now }
    }
);

module.exports = mongoose.model('file', file);