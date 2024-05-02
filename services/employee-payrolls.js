const db = require('./db');
const  helper = require('../helper');
const config = require('../config');

async function addEmployeeEarnings(employeeEarnings){
    try {
        const result = await db.query( `
        INSERT INTO employee_payroll_earnings (employee_id, type, amount, date)
        VALUES (?, ?, ?, ?)`, [employeeEarnings.employee_id, employeeEarnings.type, employeeEarnings.amount, employeeEarnings.date]);

        if (result.affectedRows) {
            return {
                message: "Successfully added employee earnings."
            }
        }
    } catch (error){
        console.error("Error adding employee earnings:", error);
        throw error;
    }
}

async function addEmployeeDeductions(employeeDeductions){
    try {
        const result = await db.query( `
        INSERT INTO employee_payroll_deductions (employee_id, type, amount, date) VALUES (?, ?, ?, ?)`, [employeeDeductions.employee_id,
        employeeDeductions.type, employeeDeductions.amount, employeeDeductions.date]);

        if (result.affectedRows) {
            return {
                message: "Successfully added employee deductions."
            }
        }
    } catch (error) {
        console.error("Error adding employee deductions:", error);
        throw error;
    }
}

//POST employees payroll
async function createEmployeePayroll(payrolls) {
    // console.log(payrolls);
    try {
        // Check if properties are undefined and set them to null
        const payPeriod = payrolls.pay_period !== undefined ? payrolls.pay_period : null;
        const startDate = payrolls.payroll_start_date !== undefined ? payrolls.payroll_start_date : null;
        const endDate = payrolls.payroll_end_date !== undefined ? payrolls.payroll_end_date : null;
        const payDay = payrolls.pay_day !== undefined ? payrolls.pay_day : null;

        const deleteQuery = `
            DELETE FROM employee_payrolls WHERE pay_period = ? AND start_date = ? AND end_date = ? AND pay_day = ?;
        `;
        await db.query(deleteQuery, [payPeriod, startDate, endDate, payDay]);
        
        // This is for semi-monthly payroll only, we will update this if we will add other payroll types.
        const insertQuery = `
            INSERT INTO employee_payrolls (employee_id, pay_period, start_date, end_date, pay_day, basic_pay, pagibig, philhealth, sss, wh_tax, total_earnings, total_deductions)
            SELECT 
                ad.employee_id,
                ? AS pay_period,
                ? AS start_date,
                ? AS end_date,
                ? AS pay_day,
                ad.salary / 2 AS basic_pay,
                ad.pagibig / 2 AS pagibig,
                ad.philhealth / 2 AS philhealth,
                ad.sss / 2 AS sss,
                ad.wh_tax / 2 AS wh_tax,
                COALESCE(epe.total_earnings, 0) AS total_earnings,
                COALESCE(epd.total_deductions, 0) AS total_deductions
            FROM 
                assigned_designation AS ad
            LEFT JOIN 
                (SELECT employee_id, SUM(amount) AS total_earnings 
                FROM employee_payroll_earnings 
                WHERE date BETWEEN ? AND ? 
                GROUP BY employee_id) AS epe ON ad.employee_id = epe.employee_id
            LEFT JOIN 
                (SELECT employee_id, SUM(amount) AS total_deductions 
                FROM employee_payroll_deductions 
                WHERE date BETWEEN ? AND ? 
                GROUP BY employee_id) AS epd ON ad.employee_id = epd.employee_id
            WHERE 
                ad.status = 'Active';
        `;
        
        const result = await db.query(insertQuery, [payPeriod, startDate, endDate, payDay, startDate, endDate, startDate, endDate]);

        if (result.affectedRows) {
            return {
                message: "Employees " + payPeriod + " payroll has been successfully generated for the date of " + startDate + " to " + endDate + ". Pay day on " + payDay + "."
                // message: `Employees ${payPeriod} payroll has been successfully generated for the date of ${startDate} to ${endDate}.\nPay day on ${payDay}.`
            }
        }
    
    } catch (error) {
        console.error("Error generating employees payroll:", error);
        throw error;
    }
}

async function getPayrollEmployees(pay_period, pay_day) {
    // console.log(pay_day);
    try {
        const query = `
        SELECT ep.employee_id, 
        CONCAT(e.first_name, ' ', e.last_name) AS employee_name,
        des.designation_name AS designation,
        dep.department_name AS department,
        ad.salary AS monthly_salary
        FROM employee_payrolls AS ep
        LEFT JOIN employee AS e ON ep.employee_id = e.id
        LEFT JOIN assigned_designation AS ad ON e.id = ad.employee_id
        LEFT JOIN designation AS des ON ad.designation_id = des.id
        LEFT JOIN department AS dep ON des.department_id = dep.id
        WHERE ep.pay_period = ?
        AND ep.pay_day = ?;`;

        const rows = await db.query(query, [pay_period, pay_day]);
        const data = helper.emptyOrRows(rows);

        return {
            data
        };

    } catch (error) {
        console.error("Error fetching employee name list for payslip:", error);
        throw error;
    }
}

async function getPayrollEmployeePayslip(employee_id, pay_period, pay_day) {
    console.log(pay_day);

    try {
        const query = `
        SELECT ep.employee_id, 
        CONCAT(e.first_name, ' ', e.last_name) AS employee_name,
        des.designation_name AS designation,
        dep.department_name AS department,
        ad.employee_type AS employee_type,
        ad.status AS status,
        ep.pay_period,
        DATE_ADD(ep.start_date, INTERVAL 8 HOUR) AS start_date,
        DATE_ADD(ep.end_date, INTERVAL 8 HOUR) AS end_date,
        DATE_ADD(ep.pay_day, INTERVAL 8 HOUR) AS pay_day,
        ep.basic_pay,
        ep.total_earnings,
        ep.total_deductions,
        ep.sss,
        ep.philhealth,
        ep.pagibig,
        ep.wh_tax
        FROM employee_payrolls AS ep
        LEFT JOIN employee AS e ON ep.employee_id = e.id
        LEFT JOIN assigned_designation AS ad ON e.id = ad.employee_id
        LEFT JOIN designation AS des ON ad.designation_id = des.id
        LEFT JOIN department AS dep ON des.department_id = dep.id
        WHERE ep.employee_id = ? 
        AND ep.pay_period = ? 
        AND ep.pay_day = ?;`;

        const rows = await db.query(query, [employee_id, pay_period, pay_day]);
        const data = helper.emptyOrRows(rows);

        const earningsQuery = `
        SELECT type AS earning_type,
            amount AS earning_amount,
            DATE_ADD(date, INTERVAL 8 HOUR) AS earning_date
        FROM employee_payroll_earnings
        WHERE employee_id = ? AND date BETWEEN ? AND ?;`;

        const earningsRows = await db.query(earningsQuery, [employee_id, data[0].start_date, data[0].end_date]);
        const earningsData = helper.emptyOrRows(earningsRows);

        const deductionsQuery = `
        SELECT type AS deduction_type,
            amount AS deduction_amount,
            DATE_ADD(date, INTERVAL 8 HOUR) AS deduction_date
        FROM employee_payroll_deductions
        WHERE employee_id = ? AND date BETWEEN ? AND ?;`;

        const deductionsRows = await db.query(deductionsQuery, [employee_id, data[0].start_date, data[0].end_date]);
        const deductionsData = helper.emptyOrRows(deductionsRows);

        return {
            data,
            earningsData,
            deductionsData
        };

    } catch (error) {
        console.error("Error fetching employee payslip data:", error);
        throw error;
    }
}



module.exports = {
    addEmployeeEarnings,
    addEmployeeDeductions,
    createEmployeePayroll,
    getPayrollEmployees,
    getPayrollEmployeePayslip
}
