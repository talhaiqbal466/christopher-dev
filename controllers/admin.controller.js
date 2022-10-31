const Admin = require('../models/admin.model')
const List = require('../models/list.model')
const File = require('../models/file.model')
const Queue = require('../models/queue.model')
const ScheduleMessage = require('../models/schedule-message.model')
const jwt = require('jsonwebtoken');
const axios = require('axios');
const fs = require('fs');

module.exports.signup = (req, res) => {
    Admin.create(req.body)
        .then(admin => {
            res.status(200).send(admin);
        })
        .catch(err => {
            res.status(500).send(err);
        })
}

module.exports.getAdmin = (req, res) => {
    Admin.find()
        .then(msg => {
            res.status(200).send(msg)
        })
        .catch(err => {
            res.status(500).send(err)
        })
}

module.exports.updateAdmin = (req, res) => {
    Admin.findByIdAndUpdate({ _id: req.body._id }, req.body)
        .then(() => {
            Admin.findById({ _id: req.body._id })
                .then(msg => {
                    res.status(200).send(msg)
                })
                .catch(err => {
                    res.status(500).send(err)
                })
        })
        .catch(err => {
            res.status(500).send(err)
        })
}

module.exports.login = (req, res) => {
    Admin.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                throw new Error('user not found!')
            } else if (req.body.password === user.password) {
                const JWTToken = jwt.sign(
                    {
                        email: user.email,
                        _id: user._id
                    },
                    'secretOfTheChristopherWABot',
                    {
                        expiresIn: '2h'
                    }
                )
                return res.status(200).json({
                    success: 'True',
                    token: JWTToken
                })
            } else {
                throw new Error('Incorrect Password!')
            }
        })
        .catch(error => {
            res.status(500).json({
                stack: error.stack,
                code: error.code,
                message: error.message
            })
        })
}

module.exports.createList = (req, res) => {
    List.create(req.body)
        .then(admin => {
            res.status(200).send(admin);
        })
        .catch(err => {
            res.status(500).send(err);
        })
}

module.exports.getList = (req, res) => {
    List.find()
        .then(admin => {
            res.status(200).send(admin);
        })
        .catch(err => {
            res.status(500).send(err);
        })
}

module.exports.getListDetails = (req, res) => {
    List.findOne({ _id: req.params.id })
        .then(admin => {
            res.status(200).send(admin);
        })
        .catch(err => {
            res.status(500).send(err);
        })
}

module.exports.updateList = (req, res) => {
    List.findByIdAndUpdate({ _id: req.body._id }, req.body)
        .then(admin => {
            res.status(200).send(admin);
        })
        .catch(err => {
            res.status(500).send(err);
        })
}

module.exports.deleteList = (req, res) => {
    List.findByIdAndRemove({ _id: req.params.id })
        .then(data => {
            res.status(200).send(data);
        })
        .catch(err => {
            res.status(500).send(err);
        })
}

module.exports.getScheduleMessage = (req, res) => {
    ScheduleMessage.find()
        .then(admin => {
            res.status(200).send(admin);
        })
        .catch(err => {
            res.status(500).send(err);
        })
}

module.exports.deleteScheduleMessage = (req, res) => {
    ScheduleMessage.findByIdAndRemove({ _id: req.params.id })
        .then(data => {
            res.status(200).send(data);
        })
        .catch(err => {
            res.status(500).send(err);
        })
}

module.exports.currentUser = (req, res) => {
    jwt.verify(req.params.token, 'secretOfTheChristopherWABot', function (err, payload) {
        if (err) {
            throw new Error('unauthorized user')
        } else {
            Admin.findOne({ _id: payload._id })
                .then(user => {
                    res.status(200).send(user)
                })
                .catch(error => {
                    res.status(500).json({
                        stack: error.stack,
                        code: error.code,
                        message: error.message
                    })
                })
        }
    })
}

module.exports.getGroups = (req, res) => {

    Admin.find()
        .then(adm => {
            let api = "https://api.maytapi.com/api/" + adm[0].product_id + "/" + adm[0].phone_id + "/getGroups?full=true";
            const cnfg = {
                headers: {
                    'Content-Type': 'application/json',
                    'x-maytapi-key': adm[0].api_token,
                },
            }
            axios.get(api, cnfg)
                .then((resp) => {
                    res.status(200).send(resp.data.data)
                })
                .catch((err) => {
                    res.status(500).send(err)
                })
        })
        .catch(err => {
            res.status(500).send(err)
        })
}

module.exports.uploadFile = (req, res) => {
    let name = req.body.name;
    let file_ext = getFileExtension(name);
    let file = req.body.file;

    let obj = {
        name: name,
        // file: file,
        file_ext: file_ext,

    }
    File.create(obj).then(result => {
        const fileContents = new Buffer.from(file, 'base64')
        fs.writeFile('./files/' + result._id + file_ext, fileContents, (err) => {
            if (err) {
                console.log(err);
                res.status(500).send(err)
            } else {
                res.status(200).send(result)
            }
        })
    }).catch(err => {
        console.log(err);
        res.status(500).send(err)
    })
}

function getFileExtension(filename) {
    const extension = filename.split('.').pop();
    return '.' + extension;
}

module.exports.addToQueue = (req, res) => {
    Queue.insertMany(req.body.queue).then(que => {
        res.status(200).send(que)
    }).catch(err => {
        res.status(500).send(err)
    })
}

module.exports.scheduleBroadCast = (req, res) => {
    ScheduleMessage.create(req.body).then(resp => {
        res.status(200).send(resp)
    }).catch(err => {
        res.status(500).send(err)
    })
}

// module.exports.sendMedia = (req, res) => {
//     Admin.find()
//         .then(adm => {
//             let api = "https://api.maytapi.com/api/" + adm[0].product_id + "/" + adm[0].phone_id + "/sendMessage";
//             const cnfg = {
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'x-maytapi-key': adm[0].api_token,
//                 },
//             }
//             let obj = {
//                 "to_number": "905301234567@c.us",
//                 "type": "media",
//                 "message": "data:image/png;base64,iVBORw0KG...",
//                 "text": "Message Caption (optional)"
//             }
//             axios.post(api, obj, cnfg)
//                 .then((resp) => {
//                     res.status(200).send(resp.data.data)
//                 })
//                 .catch((err) => {
//                     res.status(500).send(err)
//                 })
//         })
//         .catch(err => {
//             res.status(500).send(err)
//         })
// }