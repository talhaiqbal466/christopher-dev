const express = require('express');
const routes = express.Router();
console.log("company Route Loaded");

const CompanyController = require('../controllers/company.controller');

routes.get('/getCompanies', CompanyController.getCompanies);
routes.post('/setCompany', CompanyController.setCompany);
routes.put('/updateCompany', CompanyController.updateCompany);
routes.delete('/deleteCompany/:id', CompanyController.deleteCompany);

module.exports = routes;