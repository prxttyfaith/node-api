//node-api/services/employee-designations.js
const db = require('./db');
const helper = require('../helper');
const config = require('../config');

//GET ALL EMPLOYEE-DESIGNATIONS
async function getEmployeeDesignations() {
  try {
    const query = `
      SELECT des.id, des.designation_name, dep.department_name
      FROM designation des
      LEFT JOIN department dep ON des.department_id = dep.id`;

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


module.exports = {
  getEmployeeDesignations
}