const express = require('express');
const router = express.Router();
const leaveRequests = require('../services/employee-leave-requests');

//GET leave request
router.get('/', async function(req, res, next) {
    try {
      res.json(await leaveRequests.getLeaveRequests(req.query.page));
    } catch (err) {
      console.error(`Error while getting leave request `, err.message);
      next(err);
    }
  });

//POST leave request
router.post('/', async function(req, res, next) {
    try {
      res.json(await leaveRequests.createLeaveRequest(req.body));
    } catch (err) {
      console.error(`Error while creating leave request`, err.message);
      next(err);
    }
  });

//UPDATE leave request
// router.put('/:id', async function(req, res, next) {
//     try {
//       res.json(await leaveRequests.updateLeaveRequest(req.params.id, req.body));
//     } catch (err) {
//       console.error(`Error while updating leave request`, err.message);
//       next(err);
//     }
//   });

  module.exports = router;