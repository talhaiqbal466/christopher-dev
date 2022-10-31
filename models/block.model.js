const mongoose = require('mongoose');

const block = mongoose.Schema(
  {
    block_name: { type: String, required: true },
    block_msg: { type: String, required: true },
    group_id: { type: String, required: true },
    group_name: { type: String, required: true },
    company: {},
    keywords: [
      {
        kw_name: String,
      }
    ],
    tags: [
      {
        tag_name: String,
      }
    ],
    createdAt: { type: Date, default: Date.now }
  }
);

module.exports = mongoose.model('block', block);