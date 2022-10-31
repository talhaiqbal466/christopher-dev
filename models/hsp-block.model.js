const mongoose = require('mongoose');

const hspBlock = mongoose.Schema(
  {
    block_name: { type: String, required: false },
    active: { type: Boolean, required: false },
    // messages: [
    //   {
    //     msg_body: String,
    //     index: Number,
    //     delay: Number
    //   }
    // ],
    // file: { type: String, required: false },
    createdAt: { type: Date, default: Date.now }
  }
);

module.exports = mongoose.model('hspBlock', hspBlock);