-- Clean up broken records --
DELETE FROM employee_payroll_deductions WHERE employee_id NOT IN (SELECT employee_id FROM assigned_designation);
DELETE FROM employee_payroll_earnings WHERE employee_id NOT IN (SELECT employee_id FROM assigned_designation);
DELETE FROM employee_leave_requests WHERE employee_id NOT IN (SELECT employee_id FROM assigned_designation);
DELETE FROM employee_signatories WHERE employee_id NOT IN (SELECT employee_id FROM assigned_designation);
DELETE FROM employee_signatories WHERE signatory NOT IN (SELECT id FROM employee WHERE id IN (SELECT employee_id FROM assigned_designation));
DELETE FROM employee WHERE id NOT IN (SELECT employee_id FROM assigned_designation);
TRUNCATE TABLE employee_payrolls;