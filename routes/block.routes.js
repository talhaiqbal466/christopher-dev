const express = require('express');
const routes = express.Router();
console.log("block Route Loaded");

const BlockController = require('../controllers/block.controller');

routes.get('/getBlocks', BlockController.getBlocks);
routes.post('/setBlock', BlockController.setBlock);
routes.put('/updateBlock', BlockController.updateBlock);
routes.delete('/deleteBlock/:id', BlockController.deleteBlock);

module.exports = routes;