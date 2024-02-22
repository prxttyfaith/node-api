const db = require('./db');
const helper = require('../helper');
const config = require('../config');
//GET
async function getMultiple(page = 1){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT id, name
    FROM tasks LIMIT ${offset},${config.listPerPage}`
  );
  const data = helper.emptyOrRows(rows);
  const meta = {page};

  return {
    data,
    meta
  }
}
//POST
async function create(task){
  const result = await db.query(
    `INSERT INTO tasks (name) VALUES 
    ('${task.name}')`
  );

  let message = 'Error in creating task';

  if (result.affectedRows) {
    message = 'task created successfully';
  }

  return {message};
}
module.exports = {
  getMultiple,
  create
}

