const mongoose = require('mongoose');

const scheduleMessage = mongoose.Schema(
  {
    hour: { type: Number, required: false },
    minute: { type: Number, required: false },
    date: { type: String, required: false },
    name: { type: String, required: false },
    type: { type: String, required: false },
    contacts: { type: Array, required: false },
    text: { type: String, required: false },
    file_path: { type: String, required: false },
    status: { type: String, required: false },
    createdAt: { type: Date, default: Date.now }
  }
);

module.exports = mongoose.model('scheduleMessage', scheduleMessage);