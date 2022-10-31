const express = require('express')
const compression = require('compression')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors');
const cron = require('node-cron');
const Admin = require('./models/admin.model');
const User = require('./models/users.model');
const UnsubscribeUser = require('./models/unsubscribe.model');
const List = require('./models/list.model');
const HspBlock = require('./models/hsp-block.model');
const HspBlockMesssage = require('./models/hsp-block-msg.model');
const Queue = require('./models/queue.model');
const ScheduleMessage = require('./models/schedule-message.model')
const https = require('https');
const fs = require("fs");
const app = express()
app.use(compression())
const router = require('./routes/index.routes');
const axios = require('axios');

const port = process.env.PORT || 3003

mongoose
  .connect("", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
  .then(data => {
    console.log('Connected');
    // mongoose.close();
  })
  .catch(err => {
    console.log('Error')
    console.log(err)
  })

app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.json({ limit: '50mb' }));
// app.use(express.urlencoded({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }))
app.use(bodyParser.json())

app.use("/api", router);


var task = cron.schedule('*/30 * * * *', () => {
  let today = new Date();
  today.setHours(today.getHours() + 2)
  let date = today.getDate();
  let month = today.getMonth() + 1;
  let year = today.getFullYear();
  let h = today.getHours();
  let m = today.getMinutes();

  let time = h + ':' + m;
  ScheduleMessage.find().then(schedule => {
    schedule.map(async (sm) => {
      let td = parseInt(sm.date.split('-')[2]);
      let tm = parseInt(sm.date.split('-')[1]);
      let ty = parseInt(sm.date.split('-')[0]);
      if (sm.hour == h && sm.minute == m && td == date && tm == month && ty == year) {
        // console.log(sm.hour, sm.minute, td, tm, ty, '  ', h, m, date, month, year)
        if (sm.type == 'list') {
          let list = [];
          let queue = [];
          Promise.all(
            sm.contacts.map(async (cl) => {
              let listData = await List.findOne({ _id: cl._id })
              list = list.concat(listData.list_users)
            })
          ).then(() => {
            list.map((ul, i) => {
              let uObj = {
                phone: ul.phone,
                user_name: ul.user_name ? ul.user_name : '',
                file_path: sm.file_path ? sm.file_path : '',
                text: sm.text,
                s_id: sm._id,
                type: sm.file_path ? 'media' : 'text'
              }
              if (i == list.length - 1) { uObj['last'] = true; }
              queue.push(uObj)
            })
            Queue.insertMany(queue).then(que => { }).catch(err => { })
          })
        } else if (sm.type == 'group') {
          let queue = [];
          sm.contacts.map((ul, i) => {
            let uObj = {
              phone: ul.phone,
              user_name: ul.user_name ? ul.user_name : '',
              file_path: sm.file_path ? sm.file_path : '',
              text: sm.text,
              s_id: sm._id,
              type: sm.file_path ? 'media' : 'text'
            }
            if (i == sm.contacts.length - 1) { uObj['last'] = true; }
            queue.push(uObj)
          })
          Queue.insertMany(queue).then(que => { }).catch(err => { })
        } else if (sm.type == 'contact') {
          let queue = [];
          sm.contacts.map((ul, i) => {
            let uObj = {
              phone: ul.phone,
              user_name: ul.user_name ? ul.user_name : '',
              file_path: sm.file_path ? sm.file_path : '',
              text: sm.text,
              s_id: sm._id,
              type: sm.file_path ? 'media' : 'text'
            }
            if (i == sm.contacts.length - 1) { uObj['last'] = true; }
            queue.push(uObj)
          })
          Queue.insertMany(queue).then(que => { }).catch(err => { })
        }
      }
    })
  }).catch(err => { })
});

var task = cron.schedule('*/30 * * * * *', () => {
  Admin.find().then(r => {
    const cnfg = {
      headers: {
        'Content-Type': 'application/json',
        'x-maytapi-key': r[0].api_token
      }
    }
    let api = `https://api.maytapi.com/api/${r[0].product_id}/${r[0].phone_id}/sendMessage`;
    // console.log(cnfg, api);
    HspBlock.find({ active: true }).then(blockMsgList => {
      blockMsgList.map(bml => {
        let dt = new Date();
        User.find({ $and: [{ block_id: bml._id }, { hsp_user: true }, { next_msg: { $lte: new Date(dt) } }] }, { company_msg: false, company_name: false, tags: false }).then(result => {
          result.map(usr => {
            sendMessage(usr, bml, api, cnfg);
          })
        }).catch(err => { })
      })
    }).catch(err => { })
  }).catch(err => { })
});

var task = cron.schedule('*/30 * * * * *', () => {
  Queue.findOne().then(que => {
    if (que) {
      Admin.find().then(r => {
        const cnfg = {
          headers: {
            'Content-Type': 'application/json',
            'x-maytapi-key': r[0].api_token
          }
        }
        let api = `https://api.maytapi.com/api/${r[0].product_id}/${r[0].phone_id}/sendMessage`;
        UnsubscribeUser.findOne({ phone: user.phone }).then(unsub => {
          if (!unsub) {
            if (que.type == 'media') {
              sendBroadcastMedia(que, api, cnfg);
            }
            if (que.type == 'text') {
              sendBroadcastMessage(que, api, cnfg);
            }
          }
        })
      })
    }
  }).catch(err => {

  })
});

app.get('/file/:_id', (req, res) => {

  let file = req.params._id
  let path = './files/' + req.params._id;
  if (fs.existsSync(path)) {
    let type = getFileExtension(file)
    let content_type = '';
    if (type == 'png' || type == 'gif' || type == 'webp') {
      content_type = 'image/' + type
    } else if (type == 'jpg' || type == 'jpeg') {
      content_type = 'image/jpeg'
    } else if (type == 'mp4' || type == 'mkv' || type == 'webm' || type == 'mpeg') {
      content_type = 'video/' + type
    } else if (type == '7z') {
      content_type = 'application/x-7z-compressed'
    } else if (type == 'zip') {
      content_type = 'application/zip'
    } else if (type == 'svg') {
      content_type = 'image/svg+xml'
    } else if (type == 'rar') {
      content_type = 'application/vnd.rar'
    } else if (type == 'pdf') {
      content_type = 'application/pdf'
    }
    console.log(content_type);
    res.writeHead(200, {
      'Content-Type': content_type,
    });
    fs.createReadStream(path).pipe(res);
  } else {
    res.status(200).send('File not exist')
  }
})


function getFileExtension(filename) {
  const extension = filename.split('.').pop();
  return extension;
}

app.listen(port, function () {
  console.log('Server is running on Port', port)
})

function sendMessage(user, block, api, cnfg) {

  HspBlockMesssage.find({ block_id: block._id }).skip(user.last_msg).limit(1).then(async (bm) => {
    let block_msg = bm[0];
    if (block_msg) {
      let dt = new Date();
      dt.setHours(dt.getHours() + block_msg.delay);
      let obj = {}
      if (block_msg.file) {
        obj = {
          type: "media",
          to_number: user.phone,
          text: block_msg.msg_body.replace('@name', user.user_name),
          message: `https://christopher-dev.herokuapp.com/file/${block_msg.file}`
        }
      } else {
        obj = {
          type: "text",
          to_number: user.phone,
          message: block_msg.msg_body.replace('@name', user.user_name)
        }
      }
      axios.post(api, obj, cnfg)
        .then(async (resp) => {
          console.log(resp.data);
          let updtObj = {
            last_msg: user.last_msg + 1,
            next_msg: dt
          }
          let updtUser = await User.findByIdAndUpdate({ _id: user._id }, updtObj)
        })
        .catch((err) => {
          console.log(err);
        })
    } else {
      let updtObj = {
        last_msg: 0,
        hsp_user: false,
        block_id: ''
      }
      let updtUser = await User.findByIdAndUpdate({ _id: user._id }, updtObj)
    }
  }).catch(err => {
    console.log(err);
  })
}

async function sendBroadcastMessage(msg, api, cnfg) {
  if (msg.phone) {
    let obj = {
      type: "text",
      to_number: msg.phone,
      message: msg.text.replace('@name', msg.user_name)
    }
    axios.post(api, obj, cnfg)
      .then(async (resp) => {
        let updtUser = await Queue.findByIdAndRemove({ _id: msg._id })
        if (msg.last && msg.s_id) {
          let updtSm = await ScheduleMessage.findByIdAndUpdate({ _id: msg.s_id }, { status: 'Completed' })
        }
      }).catch((err) => {
        console.log(err);
      })
  } else {
    let updtUser = await Queue.findByIdAndRemove({ _id: msg._id })
    if (msg.last && msg.s_id) {
      let updtSm = await ScheduleMessage.findByIdAndUpdate({ _id: msg.s_id }, { status: 'Completed' })
    }
  }
}

async function sendBroadcastMedia(msg, api, cnfg) {
  if (msg.phone) {
    let obj = {
      type: "media",
      to_number: msg.phone,
      text: msg.text.replace('@name', msg.user_name),
      message: `https://christopher-dev.herokuapp.com/file/${msg.file_path}`
    }
    axios.post(api, obj, cnfg)
      .then(async (resp) => {
        console.log('send');
        let updtUser = await Queue.findByIdAndRemove({ _id: msg._id })
        if (msg.last && msg.s_id) {
          let updtSm = await ScheduleMessage.findByIdAndUpdate({ _id: msg.s_id }, { status: 'Completed' })
        }
      }).catch((err) => {
        console.log(err);
      })
  } else {
    let updtUser = await Queue.findByIdAndRemove({ _id: msg._id })
    if (msg.last && msg.s_id) {
      let updtSm = await ScheduleMessage.findByIdAndUpdate({ _id: msg.s_id }, { status: 'Completed' })
    }
  }
}

