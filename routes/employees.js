const express = require('express');
const router = express.Router();
const employees = require('../services/employees');

/* GET employee. */
router.get('/', async function(req, res, next) {
    try {
      res.json(await employees.getEmployees(req.query.page));
    } catch (err) {
      console.error(`Error while getting employee `, err.message);
      next(err);
    }
  });
  router.get('/employee-pays', async function(req, res, next) {
    try {
      res.json(await employees.getEmployeePays(req.query.page));
    } catch (err) {
      console.error(`Error while getting employee pays `, err.message);
      next(err);
    }
  });

  

/* POST employee */
router.post('/', async function(req, res, next) {
    try {
      res.json(await employees.createEmployee(req.body));
    } catch (err) {
      console.error(`Error while adding employee`, err.message);
      next(err);
    }
  });
/* SET employee */
router.put('/:id', async function(req, res, next) {
    try {
      res.json(await employees.updateEmployee(req.params.id, req.body));
    } catch (err) {
      console.error(`Error while updating employee`, err.message);
      next(err);
    }
  });

/* DELETE employee */
router.delete('/:id', async function(req, res, next) {
    try {
      res.json(await employees.removeEmployee(req.params.id));
    } catch (err) {
      console.error(`Error while deleting employee`, err.message);
      next(err);
    }
  });


  module.exports = router;
