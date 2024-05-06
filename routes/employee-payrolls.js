const express = require('express');
const router = express.Router();
const employeePayrolls = require('../services/employee-payrolls');


// Endpoint: /employee-payrolls/earnings
// Method: POST
router.post('/earnings', async function(req, res, next) {
    try {
        res.json(await employeePayrolls.addEmployeeEarnings(req.body));
    } catch (err) {
        console.error(`Error while adding employee earnings`, err.message);
        next(err);
    }
});
// Endpoint: /employee-payrolls/deductions
// Method: POST
router.post('/deductions', async function(req, res, next) {
    try {
        res.json(await employeePayrolls.addEmployeeDeductions(req.body));
    } catch (err) {
        console.error(`Error while adding employee deductions`, err.message);
        next(err);
    }
});

// Endpoint: /employee-payrolls
// Method: POST
router.post('/', async function(req, res, next) {
    try {
        res.json(await employeePayrolls.createEmployeePayroll(req.body));
    } catch (err) {
        console.error(`Error while creating employees payroll`, err.message);
        next(err);
    }
});

// Endpoint: /employee-payrolls
// Method: GET

router.get('/', async (req, res) => {
    const pay_period = req.query.pay_period;
    const pay_day = req.query.pay_day;
    if (pay_period && pay_day) {
        try {
            const result = await employeePayrolls.getPayrollsByEmployee(pay_period, pay_day);
            res.status(200).json(result);
        } catch (error) {
            console.error("Error fetching payrolls by employee:", error);
            res.status(500).json({ error: "Error fetching payrolls by employee." });
        }
    } else {
        res.status(400).json({ error: "Missing required parameters" });
    }
});

// Endpoint: /employee-payrolls/payslip
// Method: GET

router.get('/payslip', async function(req, res, next) {
    try {
        const { employee_id, pay_period, pay_day } = req.query;
        if (!employee_id || !pay_period || !pay_day) {
            return res.status(400).json({ error: 'Missing employee_id, pay_period or pay_day parameter' });
        }
        res.json(await employeePayrolls.getPayrollEmployeePayslip(employee_id, pay_period, pay_day));
    } catch (err) {
        console.error(`Error while fetching employee payslip`, err.message);
        next(err);
    }
});


module.exports = router;