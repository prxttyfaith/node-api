const db = require('./db');
const helper = require('../helper');
const config = require('../config');

//GET ALL EMPLOYEE
async function getEmployees() {
  try {
    const query = `
      SELECT e.*, ad.employee_type, ad.status, ad.salary, ad.designation_id, des.designation_name, d.department_name
      FROM employee e
      LEFT JOIN assigned_designation ad ON e.id = ad.employee_id
      LEFT JOIN designation des ON ad.designation_id = des.id
      LEFT JOIN department d ON des.department_id = d.id`;

    const rows = await db.query(query);
    const data = helper.emptyOrRows(rows);

    return {
      data
    };
  } catch (error) {
    console.error("Error fetching employee data:", error);
    throw error;
  }
}

//GET EMPLOYEE(concat name) AND GROSS PAY
async function getEmployeePays() {
  try {
    const query = `
      SELECT e.id AS employee_id, CONCAT(e.first_name, ' ', e.last_name) AS employee_name, ad.salary
      FROM employee e
      LEFT JOIN assigned_designation ad ON e.id = ad.employee_id`;

    const rows = await db.query(query);
    const data = helper.emptyOrRows(rows);

    return {
      data
    };
  } catch (error) {
    console.error("Error fetching employee data:", error);
    throw error;
  }
}


//POST
async function createEmployee(employee) {
  try {
    const employeeData = {
      first_name: employee.first_name || null,
      middle_name: employee.middle_name || null,
      last_name: employee.last_name || null,
      birthdate: employee.birthdate || null,
      address_line: employee.address_line || null,
      city: employee.city || null,
      state: employee.state || null,
      country: employee.country || null,
      zip_code: employee.zip_code || null,
      designation_id: employee.designation_id || null,
      employee_type: employee.employee_type || null,
      status: employee.status || null,
      salary: employee.salary || null,
      pagibig: employee.pagibig || null,
      philhealth: employee.philhealth || null,
      sss: employee.sss || null,
      wh_tax: employee.wh_tax || null
    };

    // Insert into employee table
    const employeeQuery = `
          INSERT INTO employee 
          (first_name, middle_name, last_name, birthdate, address_line, city, state, country, zip_code) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const employeeValues = [
      employeeData.first_name,
      employeeData.middle_name,
      employeeData.last_name,
      employeeData.birthdate,
      employeeData.address_line,
      employeeData.city,
      employeeData.state,
      employeeData.country,
      employeeData.zip_code
    ];

    // Mo execute ta ug query to insert the employee
    const employeeResult = await db.query(employeeQuery, employeeValues);

    // Let's get the id of the newly inserted employee para sa pag insert sa assigned_designation table
    const employeeId = employeeResult.insertId;

    // Insert into assigned_designation table
    const designationQuery = `
          INSERT INTO assigned_designation 
          (employee_id, designation_id, employee_type, status, salary, pagibig, philhealth, sss, wh_tax) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const designationValues = [
      employeeId,
      employeeData.designation_id,
      employeeData.employee_type,
      employeeData.status,
      employeeData.salary,
      employeeData.pagibig,
      employeeData.philhealth,
      employeeData.sss,
      employeeData.wh_tax
    ];

    // Finally, execute the query to insert the assigned designation
    const designationResult = await db.query(designationQuery, designationValues);

    let message = 'Error in creating employee';

    if (employeeResult.affectedRows && designationResult.affectedRows) {
      message = 'Employee created successfully';
    }

    return { message };
  } catch (error) {
    console.error("Error creating employee:", error);
    throw error;
  }
}

//SET
async function updateEmployee(employeeId, employee) {
  try {
    const employeeData = {
      first_name: employee.first_name || null,
      middle_name: employee.middle_name || null,
      last_name: employee.last_name || null,
      birthdate: employee.birthdate || null,
      address_line: employee.address_line || null,
      city: employee.city || null,
      state: employee.state || null,
      country: employee.country || null,
      zip_code: employee.zip_code || null,
      designation_id: employee.designation_id || null,
      employee_type: employee.employee_type || null,
      status: employee.status || null,
      salary: employee.salary || null,
      pagibig: employee.pagibig || null,
      philhealth: employee.philhealth || null,
      sss: employee.sss || null,
      wh_tax: employee.wh_tax || null
    };

    const employeeUpdateQuery = `
    UPDATE employee
    set first_name = ?, middle_name = ?, last_name = ?, birthdate = ?, address_line = ?, city = ?, state = ?, country = ?, zip_code = ? 
    WHERE id = ${employeeId}`;

    const employeeUpdateValues = [
      employeeData.first_name,
      employeeData.middle_name,
      employeeData.last_name,
      employeeData.birthdate,
      employeeData.address_line,
      employeeData.city,
      employeeData.state,
      employeeData.country,
      employeeData.zip_code
    ];

    const employeeUpdateResult = await db.query(employeeUpdateQuery, employeeUpdateValues);

    const designationUpdateQuery = `
    UPDATE assigned_designation
    set designation_id = ?, employee_type = ?, status = ?, salary = ?, pagibig = ?, philhealth = ?, sss = ?, wh_tax = ?
    WHERE employee_id = ${employeeId}`;

    const designationUpdateValues = [
      employeeData.designation_id,
      employeeData.employee_type,
      employeeData.status,
      employeeData.salary,
      employeeData.pagibig,
      employeeData.philhealth,
      employeeData.sss,
      employeeData.wh_tax
    ];

    const designationUpdateResult = await db.query(designationUpdateQuery, designationUpdateValues);
    console.log('designationUpdateResult:', designationUpdateResult);

    let message = 'Error in updating employee';
    if (employeeUpdateResult.affectedRows && designationUpdateResult.affectedRows) {
      message = 'Employee updated successfully';
    }

    return { message };
  }
  catch (error) {
    console.error("Error updating employee:", error);
    throw error;
  }
}

//DELETE
async function removeEmployee(employeeId) {
  try {
    const deleteEmployee = await db.query(
      `DELETE FROM employee
     WHERE id = ?`, [employeeId]
    );

    const deleteDesignation = await db.query(
      `DELETE FROM assigned_designation
      WHERE employee_id = ?`, [employeeId]
    );

    let message = 'Error in deleting employee';
    if (deleteEmployee.affectedRows > 0) {
      message = 'employee record deleted successfully';
    }

    return { message };
  }
  catch (error) {
    console.error("Error deleting employee:", error);
    throw error;
  }
}

module.exports = {
  getEmployees,
  createEmployee,
  updateEmployee,
  removeEmployee,
  getEmployeePays,
}