const db = require('./db');
const helper = require('../helper');
const config = require('../config');

// Use by app: /employee-manager/leave-request
async function getLeaveRequests() {
  try {
    const query = `
    SELECT
    elr.id,
    elr.employee_id, 
    CONCAT(e1.first_name, ' ', e1.last_name) AS employee_name,  
    elr.type, 
    DATE_FORMAT(elr.start_date, '%Y-%m-%d') AS start_date,
    DATE_FORMAT(elr.end_date, '%Y-%m-%d') AS end_date,
    CONCAT(e2.first_name, ' ', e2.last_name) AS signatory_name,
    elr.status      
    FROM employee_leave_requests AS elr
    INNER JOIN employee AS e1 ON elr.employee_id = e1.id
    INNER JOIN employee_signatories AS es ON elr.employee_id = es.employee_id
    INNER JOIN employee AS e2 ON es.signatory = e2.id;`;

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

// Use by app: /employee-manager/leave-request
async function createLeaveRequest(leaveRequest) {
  try {
    const [getEmployeeName] = await db.query(`
            SELECT CONCAT(first_name, ' ', last_name) AS employee_name 
            FROM employee
            WHERE id = ?`, [leaveRequest.employee_id]);

    const result = await db.query(
      `INSERT INTO employee_leave_requests 
      (employee_id, type, start_date, end_date, status) 
      VALUES 
      ('${leaveRequest.employee_id}', '${leaveRequest.type}', '${leaveRequest.start_date}', '${leaveRequest.end_date}', '${leaveRequest.status}')`
    );

    let message = "There was an error in submitting the leave request. Please try again.";

    if (result.affectedRows) {
      return {
          message: `${getEmployeeName.employee_name} leave request has been successfully submitted. Please await for approval.`
      };
  }

    return { message };
  } catch (error) {
    console.error("Error in submitting the leave request:", error);
    throw error;
  }
}

// Use by app: /employee-manager/leave-request-status
async function updateLeaveRequest(id, leaveRequestData) {
  try {
    const leaveRequestUpdateQuery = `
    UPDATE employee_leave_requests
    set status = ?
    WHERE id = ? AND employee_id = ?;`;

    const leaveRequestUpdateValues = [
      leaveRequestData.status,
      id,
      leaveRequestData.employee_id
    ];

    const leaveRequestUpdateResult = await db.query(leaveRequestUpdateQuery, leaveRequestUpdateValues);
    console.log('leaveRequestUpdateResult:', leaveRequestUpdateResult);

    let message = 'Error in updating leave request status.';
    if (leaveRequestUpdateResult.affectedRows) {
      message = 'Leave request status has been successfully updated.';
    }
    return { message };
  }
  catch (error) {
    console.error("Error updating leave request:", error);
    throw error;
  }
}




module.exports = {
  getLeaveRequests,
  createLeaveRequest,
  updateLeaveRequest
}