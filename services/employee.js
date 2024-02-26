const db = require('./db');
const helper = require('../helper');
const config = require('../config');


//GET ALL EMPLOYEE
async function getEmployee(page = 1){
    const rows = await db.query(
      `SELECT *
      FROM employee`
    );
    const data = helper.emptyOrRows(rows);
    const meta = {page};
  
    return {
      data,
      meta
    }
  }

//POST
async function createEmployee(employee) {
    const result = await db.query(
      `INSERT INTO employee (first_name, middle_name, last_name, street_address, city, state, country, zip_code, designation, department, type, status)
       VALUES 
      ('${employee.first_name}', '${employee.middle_name}', '${employee.last_name}', '${employee.street_address}', '${employee.city}', '${employee.state}', '${employee.country}', '${employee.zip_code}', '${employee.designation}', '${employee.department}', '${employee.type}', '${employee.status}')`
    );
  
    let message = 'Error in creating employee';
  
    if (result.affectedRows) {
      message = 'employee created successfully';
    }
  
    return {message};
}

//SET
async function updateEmployee(id, employee){
    const result = await db.query(
      `UPDATE employee
      SET first_name='${employee.first_name}', middle_name='${employee.middle_name}', last_name='${employee.last_name}', street_address='${employee.street_address}', city='${employee.city}', state='${employee.state}', country='${employee.country}', zip_code='${employee.zip_code}', designation='${employee.designation}', department='${employee.department}', type='${employee.type}', status='${employee.status}'
      WHERE id=${id}`
    );
  
    let message = 'Error in updating employee';
  
    if (result.affectedRows) {
      message = 'employee updated successfully';
    }
  
    return {message};
  }

//DELETE
async function removeEmployee(id){
    const result = await db.query(
      `DELETE FROM employee
      WHERE id=${id}`
    );
  
    let message = 'Error in deleting employee';
  
    if (result.affectedRows) {
      message = 'employee deleted successfully';
    }
  
    return {message};
  }

module.exports = {
    getEmployee,
    createEmployee,
    updateEmployee,
    removeEmployee
  }