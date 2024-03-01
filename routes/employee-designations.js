//node-api/routes/employee-designations.js
const express = require('express');
const router = express.Router();
const employeeDesignations = require('../services/employee-designations');

/* GET employee designations. */
router.get('/', async function(req, res, next) {
    try {
      res.json(await employeeDesignations.getEmployeeDesignations(req.query.page));
    } catch (err) {
      console.error(`Error while getting employee `, err.message);
      next(err);
    }
  });

  module.exports = router;
