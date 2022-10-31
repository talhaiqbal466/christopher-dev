const Company = require('../models/company.model');

module.exports.setCompany = (req, res) => {
    Company.create(req.body)
        .then(comp => {
            res.status(200).send(comp)
        })
        .catch(err => {
            res.status(500).send(err)
        })
}

module.exports.getCompanies = (req, res) => {
    Company.find()
        .then(comp => {
            res.status(200).send(comp)
        })
        .catch(err => {
            res.status(500).send(err)
        })
}

module.exports.updateCompany = (req, res) => {
    Company.findByIdAndUpdate({ _id: req.body._id }, req.body)
        .then(() => {
            Company.findById({ _id: req.body._id })
                .then(comp => {
                    res.status(200).send(comp)
                })
                .catch(err => {
                    res.status(500).send(err)
                })
        })
        .catch(err => {
            res.status(500).send(err)
        })
}

module.exports.deleteCompany = (req, res) => {
    Company.findByIdAndRemove({ _id: req.params.id })
        .then(comp => {
            res.status(200).send(comp)
        })
        .catch(err => {
            res.status(500).send(err)
        })
}
