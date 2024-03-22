const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getEmployeeSignatories() {
    try {
        const query = `
        SELECT
        CONCAT(e1.first_name, ' ', e1.last_name) AS employee_name,
        CONCAT(e2.first_name, ' ', e2.last_name) AS signatory_name,
        es.signatory_status
       FROM employee AS e1
        INNER JOIN employee_signatories AS es ON e1.id = es.employee_id
        INNER JOIN employee AS e2 ON es.signatory = e2.id;`;

        const rows = await db.query(query);
        const data = helper.emptyOrRows(rows);
    
        return {
          data
        };
      } catch (error) {
        console.error("Error fetching employee signatories data:", error);
        throw error;
      }

}

async function getEmployeeAddSignatory() {
    try {
        const query = `
        SELECT e.id, 
        CONCAT(e.first_name, ' ', e.last_name) AS employee_name    
        FROM employee AS e`;

        const rows = await db.query(query);
        const data = helper.emptyOrRows(rows);

        return {
            data
        };
    } catch (error){
        console.error("Error fetching employee data:", error);
        throw error;
    }
}
async function createEmployeeSignatory(employeeSignatory) {
    const checkRecord = await db.query(`SELECT employee_id FROM employee_signatories WHERE employee_id = '${employeeSignatory.employee_id}'`)

    if (checkRecord.length > 0) {
        return {message: 'Employee signatory already exists'};
    }
    
    const result = await db.query(
        `INSERT INTO employee_signatories (employee_id, signatory, signatory_status) VALUES
        ('${employeeSignatory.employee_id}', '${employeeSignatory.signatory}', '${employeeSignatory.signatory_status}')`
    );
    let message = 'Error in creating employee signatory';

    if (result.affectedRows) {
        message = 'Employee signatory created successfully';
    }
    return {message};
}

module.exports = {
    getEmployeeSignatories,
    createEmployeeSignatory,
    getEmployeeAddSignatory
}