const User = require('../models/users.model');
const UnsubscribeUser = require('../models/unsubscribe.model');
const Block = require('../models/block.model');
const List = require('../models/list.model');
const HspBlock = require('../models/hsp-block.model');
const HspBlockMesssage = require('../models/hsp-block-msg.model');
const Admin = require('../models/admin.model');
const axios = require('axios');
// const e = require('express');
// const { update } = require('../models/users.model');
// const INSTANCE_URL = 'https://api.maytapi.com/api';
let PRODUCT_ID = '';
// let zipCodeList = [];
// let queryList = [];
let PHONE_ID = '';
let api = '';
const INSTANCE_URL = 'https://api.maytapi.com/api';

const cnfg = {
    headers: {
        'Content-Type': 'application/json',
        'x-maytapi-key': '',
    },
}

module.exports.getValue = async (req, res) => {
    Admin.find().then(r => {
        PHONE_ID = r[0].phone_id;
        PRODUCT_ID = r[0].product_id;
        cnfg.headers['x-maytapi-key'] = r[0].api_token;
        api = `${INSTANCE_URL}/${PRODUCT_ID}/${PHONE_ID}/sendMessage`;
        let phone = req.body.Phone.replace(/[^a-zA-Z0-9]/g, '');
        phone = phone.replace(/\s/g, '')
        console.log(phone);
        if (phone[0] == 3 && phone[1] == 1) {
            if (phone[2] == 0) {
                phone = phone.slice(0, 0) + phone.slice(3);
                phone = "31" + phone;
            }
        }
        else if (phone[0] == 0 && phone[1] == 6) {
            phone = phone.slice(0, 0) + phone.slice(1);
            phone = "31" + phone;
        }
        else if (phone[0] == 0 && phone[1] == 3 && phone[1] == 1) {
            phone = phone.slice(0, 0) + phone.slice(1);
        }
        else if (phone[0] == 6) {
            phone = "31" + phone;
        }
        req.body.Phone = phone;
        User.findOne({ phone: phone }).then(auther => {
            if (auther) {
                if (req.body.Block_id) {
                    hspBlockMessage(req.body, auther)
                }
                if (req.body.List_id) {
                    addToList(req.body, auther);
                }
                res.status(200).send(true)
            } else {
                let obj = {
                    phone: phone,
                    user_name: req.body.Name,
                    tags: req.body.Tag,
                    hsp_user: true,
                    active_hsp: true,
                    last_msg: 0,
                }
                User.create(obj)
                    .then(user => {
                        if (req.body.List_id) {
                            addToList(req.body, user);
                        }
                        if (req.body.Block_id) {
                            hspBlockMessage(req.body, user)
                        }
                        res.status(200).send(true)
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(200).send(err)
                    })
            }
        })
    })
}

async function addToList(data, user) {
    List.findOne({ _id: data.List_id }).then(list => {
        let user_list = [];
        if (list.list_users.length) { user_list = list.list_users }
        let found = user_list.find(ul => ul.phone == user.phone)
        if (!found) {
            user_list.push(user);
            List.findByIdAndUpdate({ _id: list._id }, { list_users: user_list }).then(() => { console.log('added to list'); })
        }
    }).catch(err => {

    })
}

async function hspBlockMessage(data, user) {
    UnsubscribeUser.findOne({ phone: user.phone }).then(unsub => {
        if (unsub) {
            UnsubscribeUser.findByIdAndRemove({ _id: unsub._id }).then(us => { console.log(us); })
        }
    })
    HspBlock.findOne({ $and: [{ _id: req.body.Block_id }, { active: true }] }).then(block => {
        if (block) {
            HspBlockMesssage.findOne({ block_id: req.body.Block_id }).then(blockMsg => {
                if (blockMsg) {
                    let dt = new Date();
                    dt.setHours(dt.getHours() + blockMsg.delay);
                    let msg = blockMsg.msg_body;
                    let next = dt;
                    let obj = {
                        type: "text",
                        to_number: data.Phone,
                        message: msg
                    }
                    axios.post(api, obj, cnfg)
                        .then((resp) => {
                            let updtObj = {
                                block_id: req.body.Block_id,
                                last_msg: 1,
                                hsp_user: true,
                                active_hsp: true,
                                next_msg: next
                            }
                            // console.log(updtObj);
                            User.findByIdAndUpdate({ _id: user._id }, updtObj).then(sm => {
                                console.log(sm);
                            })
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                }
            })
        }
    }).catch(err => {
        console.log(err);
    })
}

module.exports.getMessage = async (req, res) => {
    let data = req.body;
    console.log(data);
    // res.status(200).send(true)
    if (data.type == 'message') {
        if (!data.message.fromMe && data.message.type == 'text') {
            let admin = await Admin.find()
                .then(r => {
                    PHONE_ID = r[0].phone_id;
                    PRODUCT_ID = r[0].product_id;
                    cnfg.headers['x-maytapi-key'] = r[0].api_token;
                    api = `${INSTANCE_URL}/${PRODUCT_ID}/${PHONE_ID}/sendMessage`;
                })
            if (data.participants) {
                let block = await Block.findOne({ group_id: data.conversation })
                if (block) {
                    var uselessWordsArray = block.keywords.map(kw => kw.kw_name)
                    var expStr = uselessWordsArray.join("|");
                    let string = data.message.text.toLowerCase();
                    string = string.replace(/[&,.:'-/?/!;]/g, '');
                    string = string.match(new RegExp('\\b(' + expStr + ')\\b', 'gi'), ' ')
                    if (string) {
                        User.findOne({ phone: data.user.phone })
                            .then(auther => {
                                if (auther) {

                                    let tagList = auther.tags.concat(block.tags)
                                    let tgl = Array.from(new Set(tagList.map(a => a.tag_name.toLowerCase())))
                                        .map(tag_name => {
                                            return tagList.find(a => a.tag_name.toLowerCase() === tag_name.toLowerCase())
                                        })

                                    let obj = {
                                        user_name: data.user.name,
                                        company_phone: block.company.phone,
                                        company_name: block.company.company_name,
                                        company_msg: block.company.company_msg,
                                        last_msg: 1,
                                        tags: tgl
                                    }

                                    User.findByIdAndUpdate({ _id: auther._id }, obj)
                                        .then(user => {
                                            blockMessage(data, block, user)
                                            res.status(200).send(true)
                                        })
                                        .catch(err => {
                                            res.status(200).send(false)
                                        })
                                } else {
                                    let obj = {
                                        user_name: data.user.name,
                                        phone: data.user.phone,
                                        company_phone: block.company.phone,
                                        company_name: block.company.company_name,
                                        company_msg: block.company.company_msg,
                                        hsp_user: false,
                                        active_hsp: false,
                                        last_msg: 1,
                                        tags: block.tags
                                    }

                                    User.create(obj)
                                        .then(user => {
                                            blockMessage(data, block, user)
                                            res.status(200).send(true)
                                        })
                                        .catch(err => {
                                            console.log(err);
                                            res.status(200).send(err)
                                        })
                                }
                            }).catch(err => {
                                res.status(500).send(err)
                            })
                    } else { res.status(500).send(false) }
                }
            } else {
                User.findOne({ phone: data.user.phone })
                    .then(auther => {
                        if (auther) {
                            if (data.message.text.toLowerCase() == 'unsubscribe') {
                                UnsubscribeUser.findOne({ phone: data.user.phone }).then(unsub => {
                                    if (!unsub) {
                                        let obj = {
                                            user_name: auther.user_name,
                                            phone: data.user.phone
                                        }
                                        UnsubscribeUser.create(obj).then(us => { console.log(us); })
                                    }
                                })
                            }
                            // if (auther.hsp_user) {
                            //     sendHspMessage(data, auther);
                            // } else {
                            //     if (auther.last_msg == 1) {
                            //         if (data.message.text == '1' || data.message.text.toLowerCase() == 'yes') {
                            //             let url = `${INSTANCE_URL}/${PRODUCT_ID}/${PHONE_ID}/createGroup`
                            //             let obj = {
                            //                 name: auther.company_name + ' ' + auther.user_name,
                            //                 numbers: [
                            //                     auther.company_phone,
                            //                     auther.phone
                            //                 ]
                            //             }
                            //             axios.post(url, obj, cnfg)
                            //                 .then(async (resp) => {
                            //                     let updtObj = {
                            //                         last_msg: 2
                            //                     }
                            //                     let updt = await User.findByIdAndUpdate({ _id: auther._id }, updtObj);
                            //                     companyMessage(auther, resp.data)
                            //                     res.status(200).send(true)
                            //                 })
                            //                 .catch((err) => {
                            //                     res.status(500).send(err)
                            //                 })
                            //         } else if (data.message.text == '2' || data.message.text.toLowerCase() == 'no') {
                            //         }
                            //     } else { res.status(200).send(false) }
                            // }
                        }
                    }).catch(err => {
                        res.status(200).send(err)
                    })
            }
        }
    }
}

async function sendHspMessage(data, user) {
    if (data.message.text.toLowerCase() == 'stop') {
        let updtObj = {
            active_hsp: false,
        }
        console.log(updtObj);
        User.findByIdAndUpdate({ _id: user._id }, updtObj).then(sm => {
            console.log(sm);
        })
    } else {
        if (user.last_msg == 2) {
            HspBlock.find().then(blockMsg => {
                let msg = '';
                if (data.message.text.toLowerCase() == 'yes') {
                    msg = blockMsg[0].messages[2].msg_body;
                    sendVisualization(user, msg, blockMsg[0], true);
                }
                else if (data.message.text.toLowerCase() == 'no') {
                    msg = blockMsg[0].messages[3].msg_body;
                    sendVisualization(user, msg, blockMsg[0], false);
                }
            }).catch(err => {
                console.log(err);
            })
        }
    }
}

async function sendVisualization(user, msg, blockMsg, check) {
    if (check) {
        let dt = new Date();
        dt.setHours(dt.getHours() + blockMsg.messages[2].delay);
        let next = dt;
        let obj = {
            "to_number": user.phone,
            "type": "media",
            "message": blockMsg.file,
            "text": msg
        }
        axios.post(api, obj, cnfg)
            .then((resp) => {
                let updtObj = {
                    last_msg: 3,
                    hsp_user: true,
                    active_hsp: true,
                    end_msg: next
                }
                console.log(updtObj);
                User.findByIdAndUpdate({ _id: user._id }, updtObj).then(sm => {
                    console.log(sm);
                })
            })
            .catch((err) => {
                console.log(err);
            })
    } else {
        let obj = {
            type: "text",
            to_number: user.phone,
            message: msg
        }
        axios.post(api, obj, cnfg)
            .then((resp) => {
                let updtObj = {
                    last_msg: 0,
                    hsp_user: true,
                    active_hsp: true,
                }
                console.log(updtObj);
                User.findByIdAndUpdate({ _id: user._id }, updtObj).then(sm => {
                    console.log(sm);
                })
            })
            .catch((err) => {
                console.log(err);
            })
    }
}

async function companyMessage(user, group) {
    let obj = {
        type: "text",
        to_number: group.data.id,
        message: user.company_msg
    }
    console.log(api, obj, cnfg);

    axios.post(api, obj, cnfg)
        .then((resp) => {
            console.log(resp.data);
        })
        .catch((err) => {
            console.log(err);
        })
}

async function blockMessage(data, block, user) {
    let sendMsg = block.block_msg;
    let obj = {
        type: "text",
        to_number: data.user.phone,
        message: sendMsg
    }
    console.log(api, obj, cnfg);

    axios.post(api, obj, cnfg)
        .then((resp) => {
            console.log(resp.data);
        })
        .catch((err) => {
            console.log(err);
        })
}