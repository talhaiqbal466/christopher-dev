const mongoose = require('mongoose');

const hspBlockMessage = mongoose.Schema(
  {
    block_id: { type: String, required: false },
    // block_name: { type: String, required: false },
    msg_body: { type: String, required: false },
    delay: { type: Number, required: false },
    file: { type: String, required: false },
    createdAt: { type: Date, default: Date.now }
  }
);

module.exports = mongoose.model('hspBlockMessage', hspBlockMessage);