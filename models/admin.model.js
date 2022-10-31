const mongoose = require('mongoose');

const admin = mongoose.Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone_id: { type: String, required: false },
    product_id: { type: String, required: false },
    api_token: { type: String, required: false },
    createdAt: { type: Date, default: Date.now }
  }
);

module.exports = mongoose.model('admin', admin);