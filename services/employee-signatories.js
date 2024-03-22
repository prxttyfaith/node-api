const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getEmployeeSignatories() {
    try {
        const query = `
        SELECT * FROM employee_signatories;`;

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