const express = require('express');
const router = express.Router();
const employeePayrolls = require('../services/employee-payrolls');

//POST employee payroll earnings
router.post('/earnings', async function(req, res, next) {
    try {
        res.json(await employeePayrolls.createEarnings(req.body));
    } catch (err) {
        console.error(`Error while creating employee earnings`, err.message);
        next(err);
    }
});

//POST employee payroll deductions
router.post('/deductions', async function(req, res, next) {
    try {
        res.json(await employeePayrolls.createDeductions(req.body));
    } catch (err) {
        console.error(`Error while creating employee deductions`, err.message);
        next(err);
    }
});

//POST employee payroll
router.post('/', async function(req, res, next) {
    try {
        res.json(await employeePayrolls.createEmployeePayroll(req.body));
    } catch (err) {
        console.error(`Error while creating employee payroll`, err.message);
        next(err);
    }
});

//GET employee payroll
router.get('/', async function(req, res, next) {
    try {
        res.json(await employeePayrolls.getEmployeePayrolls());
    } catch (err) {
        console.error(`Error while getting employee payrolls `, err.message);
        next(err);
    }
});

module.exports = router;