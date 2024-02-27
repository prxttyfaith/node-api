const express = require('express');
const router = express.Router();
const employee = require('../services/employee');

/* GET employee. */
router.get('/', async function(req, res, next) {
    try {
      res.json(await employee.getEmployee(req.query.page));
    } catch (err) {
      console.error(`Error while getting employee `, err.message);
      next(err);
    }
  });

  // /* GET assigned_designation. */
  // router.get('/', async function(req, res, next) {
  //   try {
  //     res.json(await employee.getAssignedDesignation(req.query.page));
  //   } catch (err) {
  //     console.error(`Error while getting assigned designation `, err.message);
  //     next(err);
  //   }
  // });
  

/* POST employee */
router.post('/', async function(req, res, next) {
    try {
      res.json(await employee.createEmployee(req.body));
    } catch (err) {
      console.error(`Error while creating employee`, err.message);
      next(err);
    }
  });
/* SET employee */
router.put('/:id', async function(req, res, next) {
    try {
      res.json(await employee.updateEmployee(req.params.id, req.body));
    } catch (err) {
      console.error(`Error while updating employee`, err.message);
      next(err);
    }
  });

/* DELETE employee */
router.delete('/:id', async function(req, res, next) {
    try {
      res.json(await employee.removeEmployee(req.params.id));
    } catch (err) {
      console.error(`Error while deleting employee`, err.message);
      next(err);
    }
  });


  module.exports = router;
