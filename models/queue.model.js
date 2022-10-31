const mongoose = require('mongoose');

const queue = mongoose.Schema(
    {
        user_name: { type: String, required: false },
        phone: { type: String, required: false },
        text: { type: String, required: false },
        file_path: { type: String, required: false },
        type: { type: String, required: false },
        s_id: { type: String, required: false },
        last: { type: Boolean, required: false },
        createdAt: { type: Date, default: Date.now }
    }
);

module.exports = mongoose.model('queue', queue);