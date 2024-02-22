const express = require('express');
const router = express.Router();
const toDoList = require('../services/to-do-list');

/* GET task. */
router.get('/', async function(req, res, next) {
  try {
    res.json(await toDoList.getMultiple(req.query.page));
  } catch (err) {
    console.error(`Error while getting task `, err.message);
    next(err);
  }
});

/* POST task */
router.post('/', async function(req, res, next) {
  try {
    res.json(await toDoList.create(req.body));
  } catch (err) {
    console.error(`Error while creating task`, err.message);
    next(err);
  }
});

/* PUT task */
router.put('/:id', async function(req, res, next) {
  try {
    res.json(await toDoList.update(req.params.id, req.body));
  } catch (err) {
    console.error(`Error while updating task`, err.message);
    next(err);
  }
});

/* DELETE task */
router.delete('/:id', async function(req, res, next) {
  try {
    res.json(await toDoList.remove(req.params.id));
  } catch (err) {
    console.error(`Error while deleting task`, err.message);
    next(err);
  }
});
 
module.exports = router;
