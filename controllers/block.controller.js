const Block = require('../models/block.model');

module.exports.setBlock = (req, res) => {
    Block.create(req.body)
        .then(blk => {
            res.status(200).send(blk)
        })
        .catch(err => {
            res.status(500).send(err)
        })
}

module.exports.getBlocks = (req, res) => {
    Block.find()
        .then(blk => {
            res.status(200).send(blk)
        })
        .catch(err => {
            res.status(500).send(err)
        })
}

module.exports.updateBlock = (req, res) => {
    Block.findByIdAndUpdate({ _id: req.body._id }, req.body)
        .then(() => {
            Block.findById({ _id: req.body._id })
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

module.exports.deleteBlock = (req, res) => {
    Block.findByIdAndRemove({ _id: req.params.id })
        .then(blk => {
            res.status(200).send(blk)
        })
        .catch(err => {
            res.status(500).send(err)
        })
}

// let obj = {
//    product_id: '0c559376-a6ce-40e2-a5f2-d8654d1da9f3',
//    phone_id: 2587,
//    message: {
//      type: 'text',
//      text: 'Restart',
//      id: 'false_923212453466@c.us_40B23E2DB64BBE7704793BA07D668072',
//      _serialized: 'false_923212453466@c.us_40B23E2DB64BBE7704793BA07D668072',
//      fromMe: false
//    },
//    user: {
//      id: '923212453466@c.us',
//      name: 'Talha',
//      phone: '923212453466',
//      image: 'https://pps.whatsapp.net/v/t61.24694-24/97998963_281875886275312_3001805697404695918_n.jpg?oe=5EDBAD65&oh=f75cccd65fa9d1ef6ca006689ee51e49'
//    },
//    conversation: '923212453466@c.us',
//    conversation_name: 'Talha',
//    receiver: '923352588622',
//    timestamp: 1591294050,
//    type: 'message',
//    reply: 'https://api.maytapi.com/api/0c559376-a6ce-40e2-a5f2-d8654d1da9f3/2587/sendMessage',
//    productId: '0c559376-a6ce-40e2-a5f2-d8654d1da9f3',
//    phoneId: 2587
//  }