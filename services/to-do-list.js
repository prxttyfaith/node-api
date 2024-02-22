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

//PUT
async function update(id, task){
  const result = await db.query(
    `UPDATE tasks
    SET name='${task.name}'
    WHERE id=${id}`
  );

  let message = 'Error in updating task';

  if (result.affectedRows) {
    message = 'task updated successfully';
  }

  return {message};
}

//DELETE
async function remove(id){
  const result = await db.query(
    `DELETE FROM tasks
    WHERE id=${id}`
  );

  let message = 'Error in deleting task';

  if (result.affectedRows) {
    message = 'task deleted successfully';
  }

  return {message};
}

module.exports = {
  getMultiple,
  create,
  update,
  remove
}

