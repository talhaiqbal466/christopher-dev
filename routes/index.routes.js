const express = require('express');

const adminRoute = require('./admin.routes')
const blockRoute = require('./block.routes')
const hspBlockRoute = require('./hsp-block.routes')
const userRoute = require('./user.routes')
const companyRoute = require('./company.routes')
const botRoute = require('./bot.routes')

const routes = express.Router();

routes.use('/admin', adminRoute);
routes.use('/bot', botRoute);
routes.use('/block', blockRoute);
routes.use('/hsp-block', hspBlockRoute);
routes.use('/user', userRoute);
routes.use('/company', companyRoute);

module.exports = routes;