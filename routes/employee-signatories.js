const express = require('express');
const router = express.Router();
const employeeSignatories = require('../services/employee-signatories');

//GET employee signatories
router.get('/', async function(req, res, next) {
    try {
      res.json(await employeeSignatories.getEmployeeSignatories());
    } catch (err) {
      console.error(`Error while getting employee signatories `, err.message);
      next(err);
    }
});

//GET employee add signatory
router.get('/signatory', async function(req, res, next) {
    try {
      res.json(await employeeSignatories.getEmployeeAddSignatory());
    } catch (err) {
      console.error(`Error while getting employee data `, err.message);
      next(err);
    }
});

//POST employee signatory
router.post('/', async function(req, res, next) {
    try {
      res.json(await employeeSignatories.createEmployeeSignatory(req.body));
    } catch (err) {
      console.error(`Error while creating employee signatory`, err.message);
      next(err);
    }
});

router.put('/:id', async function(req, res, next) {
    try {
      res.json(await employeeSignatories.updateEmployeeSignatory(req.params.id, req.body));
    } catch (err) {
      console.error(`Error while updating employee signatory`, err.message);
      next(err);
    }
});

module.exports = router;