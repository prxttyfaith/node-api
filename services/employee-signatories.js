const db = require('./db');
const helper = require('../helper');
const config = require('../config');

// Use by app: /employee-manager/signatory-list
async function getEmployeeSignatories() {
    try {
        const query = `
        SELECT
        e1.id AS employee_id,
        CONCAT(e1.first_name, ' ', e1.last_name) AS employee_name,
        CONCAT(e2.first_name, ' ', e2.last_name) AS signatory_name,
        es.signatory_status
       FROM employee AS e1
        INNER JOIN employee_signatories AS es ON e1.id = es.employee_id
        INNER JOIN employee AS e2 ON es.signatory = e2.id
        ORDER by es.id ASC;`;

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

// Use by app: /employee-manager/add-signatory
async function getEmployeeAddSignatory() {
    try {
        const query = `
        SELECT e.id, 
        CONCAT(e.first_name, ' ', e.last_name) AS employee_name    
        FROM employee AS e;`;

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

// Use by app: /employee-manager/add-signatory
async function createEmployeeSignatory(employeeSignatory) {
    try {
        const checkRecord = await db.query(`
            SELECT employee_id
            FROM employee_signatories
            WHERE employee_id = '${employeeSignatory.employee_id}'`);
            
        const [getEmployeeName] = await db.query(`
            SELECT CONCAT(first_name, ' ', last_name) AS employee_name 
            FROM employee
            WHERE id = ?`, [employeeSignatory.employee_id]);
        
        if (checkRecord.length > 0) {
            return {
                message: `Already assigned a signatory to ${getEmployeeName.employee_name}. Please check the signatory list page.`
            };
        }
        
        const result = await db.query(`
            INSERT INTO employee_signatories (employee_id, signatory, signatory_status)
            VALUES (?, ?, ?)`, [employeeSignatory.employee_id, employeeSignatory.signatory, employeeSignatory.signatory_status]);

        if (result.affectedRows) {
            return {
                message: `Successfully assigned a signatory to "${getEmployeeName.employee_name}".`
            };
        }
        
        throw new Error('Failed to add employee signatory. Please try again later.');
    } catch (error) {
        throw new Error('Error encountered while adding a new employee to the signatory list. Please try again later.');
    }
}

async function updateEmployeeSignatory(e_id, employeeSignatory) {
    try {
        const result = await db.query(`
            UPDATE employee_signatories
            SET signatory = ?, signatory_status = ?
            WHERE employee_id = ?`, [employeeSignatory.signatory, employeeSignatory.signatory_status, e_id]);

        if (result.affectedRows) {
            return {
                message: `Successfully updated signatory for employee ID: ${e_id}.`
            };
        }

        throw new Error('Failed to update employee signatory. Please try again later.');
    } catch (error) {
        throw new Error('Error encountered while updating the employee signatory. Please try again later.');
    }
}

async function deleteEmployeeSignatory(e_id) {
    try {
        const result = await db.query(`
            DELETE FROM employee_signatories
            WHERE employee_id = ?`, [e_id]
        );

        let message = 'Error in deleting employee';
        if (result.affectedRows > 0) {
          message = 'employee record deleted successfully';
        }
        return { message };

    } catch (error) {
        throw new Error('Error encountered while removing the employee signatory. Please try again later.');
    }
}



module.exports = {
    getEmployeeSignatories,
    createEmployeeSignatory,
    getEmployeeAddSignatory,
    updateEmployeeSignatory,
    deleteEmployeeSignatory
    
}