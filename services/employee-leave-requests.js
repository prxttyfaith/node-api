const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getLeaveRequests() {
  try {
    const query = `
    SELECT CONCAT(e.first_name, ' ', e.last_name) AS employee_name,  
    elr.type, 
    elr.start_date, 
    elr.end_date,
    elr.status      
    FROM employee_leave_requests AS elr
    INNER JOIN employee AS e ON elr.employee_id = e.id;`;

    const rows = await db.query(query);
    const data = helper.emptyOrRows(rows);

    return {
      data
    };
  } catch (error) {
    console.error("Error fetching leave request data:", error);
    throw error;
  }
}

async function createLeaveRequest(leaveRequest) {
  try {
    const result = await db.query(
      `INSERT INTO employee_leave_requests 
      (employee_id, type, start_date, end_date, status) 
      VALUES 
      ('${leaveRequest.employee_id}', '${leaveRequest.type}', '${leaveRequest.start_date}', '${leaveRequest.end_date}', '${leaveRequest.status}')`
    );

    let message = "Error in creating leave request";

    if (result.affectedRows) {
      message = "Leave request created successfully";
    }

    return { message };
  } catch (error) {
    console.error("Error creating leave request:", error);
    throw error;
  }
}

// async function updateLeaveRequest(leaveRequest) {
//   try {
//     const result = await db.query(
//       `UPDATE leave_request 
//       SET status = '${leaveRequest.status}' 
//       WHERE id = '${leaveRequest.id}'`
//     );

//     let message = "Error in updating leave request";

//     if (result.affectedRows) {
//       message = "Leave request updated successfully";
//     }

//     return { message };
//   }
//   catch (error) {
//     console.error("Error updating leave request:", error);
//     throw error;
//   }
// }

module.exports = {
  getLeaveRequests,
  createLeaveRequest
  // updateLeaveRequest
}