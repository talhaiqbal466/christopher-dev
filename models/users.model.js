const mongoose = require('mongoose');

const user = mongoose.Schema(
    {
        user_name: { type: String, required: false },
        phone: { type: String, required: false },
        block_id: { type: String, required: false },
        company_name: { type: String, required: false },
        company_phone: { type: String, required: false },
        company_msg: { type: String, required: false },
        unsubscribe: { type: Boolean, required: false },
        hsp_user: { type: Boolean, required: false },
        active_hsp: { type: Boolean, required: false },
        last_msg: { type: Number, required: false },
        tags: [
            {
                tag_name: String
            }
        ],
        next_msg: { type: Date, required: false },
        end_msg: { type: Date, required: false },
        createdAt: { type: Date, default: Date.now }
    }
);

module.exports = mongoose.model('user', user);