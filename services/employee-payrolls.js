const db = require('./db');
const  helper = require('../helper');
const config = require('../config');

async function createEarnings(employeeEarnings){
    try {
        const result = await db.query( `
        INSERT INTO employee_payroll_earnings (employee_id, type, amount, date)
        VALUES (?, ?, ?, ?)`, [employeeEarnings.employee_id, employeeEarnings.type, employeeEarnings.amount, employeeEarnings.date]);

        if (result.affectedRows) {
            return {
                message: "Successfully created employee earnings."
            }
        }
    } catch (error){
        console.error("Error creating employee earnings:", error);
        throw error;
    }
}

async function createDeductions(employeeDeductions){
    try {
        const result = await db.query( `
        INSERT INTO employee_payroll_deductions (employee_id, type, amount, date) VALUES (?, ?, ?, ?)`, [employeeDeductions.employee_id,
        employeeDeductions.type, employeeDeductions.amount, employeeDeductions.date]);

        if (result.affectedRows) {
            return {
                message: "Successfully created employee deductions."
            }
        }
    } catch (error) {
        console.error("Error creating employee deductions:", error);
        throw error;
    }
}

//POST employee payroll
async function createEmployeePayroll (employeePayroll) {
    try {
        const result = await db.query( `
        INSERT INTO employee_payrolls (employee_id, pay_period, start_date, end_date, gross_pay, total_earnings, total_deductions, govt_sss, govt_philhealth, govt_pagibig, govt_tin, net_pay) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [employeePayroll.employee_id, employeePayroll.pay_period, employeePayroll.start_date, employeePayroll.end_date, employeePayroll.gross_pay, employeePayroll.total_earnings, employeePayroll.total_deductions, employeePayroll.govt_sss, employeePayroll.govt_philhealth, employeePayroll.govt_pagibig, employeePayroll.govt_tin, employeePayroll.net_pay]);

        if (result.affectedRows) {
            return {
                message: "Successfully created employee payroll."
            }
        }
    
    } catch (error) {
        console.error("Error creating employee payroll:", error);
        throw error;
    }
}

//GET employee payroll
async function getEmployeePayrolls() {
    try {
        const query = `
        SELECT ep.id, 
        CONCAT(e.first_name, ' ', e.last_name) AS employee_name,
        ep.employee_id,
        ep.pay_period,
        ep.start_date,
        ep.end_date,
        ep.gross_pay,
        ep.total_earnings,
        ep.total_deductions,
        ep.govt_sss,
        ep.govt_philhealth,
        ep.govt_pagibig,
        ep.govt_tin,
        ep.net_pay
        FROM employee_payrolls AS ep
        LEFT JOIN employee AS e ON ep.employee_id = e.id;`;

        const rows = await db.query(query);
        const data = helper.emptyOrRows(rows);

        return {
            data
        };
    } catch (error) {
        console.error("Error fetching employee payroll data:", error);
        throw error;
    }
}

module.exports = {
    createEarnings,
    createDeductions,
    createEmployeePayroll,
    getEmployeePayrolls
}
