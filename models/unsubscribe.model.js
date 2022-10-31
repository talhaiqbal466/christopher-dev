const mongoose = require('mongoose');

const unsubscribeUser = mongoose.Schema(
    {
        user_name: { type: String, required: false },
        phone: { type: String, required: false },
        createdAt: { type: Date, default: Date.now }
    }
);

module.exports = mongoose.model('unsubscribeUser', unsubscribeUser);