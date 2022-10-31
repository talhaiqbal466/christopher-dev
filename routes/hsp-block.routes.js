const express = require('express');
const routes = express.Router();
console.log("block Route Loaded");

const HSPBlockController = require('../controllers/hsp-block.controller');

routes.get('/getBlocks', HSPBlockController.getBlocks);
routes.post('/setBlock', HSPBlockController.setBlock);
routes.get('/getBlockMessages/:id', HSPBlockController.getBlockMessages);
routes.post('/setBlockMessage', HSPBlockController.setBlockMessage);
routes.put('/updateBlockMessage', HSPBlockController.updateBlockMessage);
routes.delete('/deleteHspBlock/:id', HSPBlockController.deleteHspBlock);
routes.delete('/deleteHspBlockMessage/:id', HSPBlockController.deleteHspBlockMessage);

module.exports = routes;