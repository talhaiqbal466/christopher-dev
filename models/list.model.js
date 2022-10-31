const mongoose = require('mongoose');

const list = mongoose.Schema(
    {
        list_name: { type: String, required: false },
        list_users: { type: Array, required: false },
        createdAt: { type: Date, default: Date.now }
    }
);

module.exports = mongoose.model('list', list);