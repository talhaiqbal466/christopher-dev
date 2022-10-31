const express = require('express');
const routes = express.Router();
console.log("User Route Loaded");

const UserController = require('../controllers/user.controller');

routes.get('/getUsers', UserController.getUsers);
routes.post('/setUser', UserController.setUser);
routes.put('/updateUser', UserController.updateUser);
routes.delete('/deleteUser/:id', UserController.deleteUser);

module.exports = routes;