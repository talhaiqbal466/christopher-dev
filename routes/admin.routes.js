const express = require('express');
const routes = express.Router();
console.log("admin Route Loaded");

const AdminController = require('../controllers/admin.controller');

routes.get('/:token', AdminController.currentUser);
routes.get('/', AdminController.getAdmin);
routes.get('/contact/list', AdminController.getList);
routes.get('/list/details/:id', AdminController.getListDetails);
routes.get('/whatsapp/groups', AdminController.getGroups);
routes.get('/schedule/messages', AdminController.getScheduleMessage);
routes.post('/login', AdminController.login);
routes.post('/', AdminController.signup);
routes.post('/addToQueue', AdminController.addToQueue);
routes.post('/scheduleBroadcast', AdminController.scheduleBroadCast);
routes.post('/file', AdminController.uploadFile);
routes.post('/createList', AdminController.createList);
routes.put('/updateAdmin', AdminController.updateAdmin);
routes.put('/updatelist', AdminController.updateList);
routes.delete('/list/:id', AdminController.deleteList);
routes.delete('/schedule/messages/:id', AdminController.deleteScheduleMessage);

module.exports = routes;
