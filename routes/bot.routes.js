const express = require('express');
const routes = express.Router();
console.log("bot Route Loaded");

const BotController = require('../controllers/bot.controller');

routes.post('/getMessage', BotController.getMessage);
routes.post('/getValue', BotController.getValue);

module.exports = routes;

// {
//     messages: [
//         {
//             id: 'false_923212453466@c.us_F7353499767D3DC216ED793A661423D8',
//             body: 'Tes',
//             fromMe: false,
//             self: 0,
//             isForwarded: 0,
//             author: '923212453466@c.us',
//             time: 1587285315,
//             chatId: '923212453466@c.us',
//             messageNumber: 18,
//             type: 'chat',
//             senderName: 'Talha Iqbal',
//             caption: null,
//             quotedMsgBody: null,
//             quotedMsgId: null,
//             chatName: '+92 321 2453466'
//         }
//     ],
//         instanceId: '118405'
// }

// {
//     "message": {
//         "type": "text",
//             "text": "Yes",
//                 "fromMe": false
//     },
//     "user": {
//         "phone": "923212453466",
// }
// }