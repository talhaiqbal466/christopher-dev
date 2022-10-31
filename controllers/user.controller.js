const User = require('../models/users.model');

module.exports.setUser = (req, res) => {
    User.create(req.body)
        .then(usr => {
            res.status(200).send(usr)
        })
        .catch(err => {
            res.status(500).send(err)
        })
}

module.exports.getUsers = (req, res) => {
    User.find()
        .then(usr => {
            res.status(200).send(usr)
        })
        .catch(err => {
            res.status(500).send(err)
        })
}

module.exports.updateUser = (req, res) => {
    User.findByIdAndUpdate({ _id: req.body._id }, req.body)
        .then(() => {
            User.findById({ _id: req.body._id })
                .then(usr => {
                    res.status(200).send(usr)
                })
                .catch(err => {
                    res.status(500).send(err)
                })
        })
        .catch(err => {
            res.status(500).send(err)
        })
}

module.exports.deleteUser = (req, res) => {
    User.findByIdAndRemove({ _id: req.params.id })
        .then(usr => {
            res.status(200).send(usr)
        })
        .catch(err => {
            res.status(500).send(err)
        })
}