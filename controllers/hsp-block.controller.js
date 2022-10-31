const HspBlock = require('../models/hsp-block.model');
const hspBlockMessage = require('../models/hsp-block-msg.model');

module.exports.getBlocks = (req, res) => {
    HspBlock.find({}, { file: false })
        .then(blk => {
            res.status(200).send(blk)
        })
        .catch(err => {
            res.status(500).send(err)
        })
}

module.exports.setBlock = (req, res) => {
    HspBlock.create(req.body)
        .then(blk => {
            res.status(200).send(blk)
        })
        .catch(err => {
            res.status(500).send(err)
        })
}

module.exports.deleteHspBlock = (req, res) => {
    HspBlock.findByIdAndRemove({ _id: req.params.id })
        .then(blk => {
            res.status(200).send(blk)
        })
        .catch(err => {
            res.status(500).send(err)
        })
}

module.exports.setBlockMessage = (req, res) => {
    hspBlockMessage.create(req.body)
        .then(blk => {
            res.status(200).send(blk)
        })
        .catch(err => {
            res.status(500).send(err)
        })
}

module.exports.getBlockMessages = (req, res) => {
    hspBlockMessage.find({ block_id: req.params.id })
        .then(blk => {
            res.status(200).send(blk)
        })
        .catch(err => {
            res.status(500).send(err)
        })
}

module.exports.updateBlockMessage = (req, res) => {
    hspBlockMessage.findByIdAndUpdate({ _id: req.body._id }, req.body)
        .then(() => {
            hspBlockMessage.findOne({ _id: req.body._id })
                .then(blk => {
                    res.status(200).send(blk)
                })
                .catch(err => {
                    res.status(500).send(err)
                })
        })
        .catch(err => {
            res.status(500).send(err)
        })
}

module.exports.deleteHspBlockMessage = (req, res) => {
    hspBlockMessage.findByIdAndRemove({ _id: req.params.id })
        .then(blk => {
            res.status(200).send(blk)
        })
        .catch(err => {
            res.status(500).send(err)
        })
}