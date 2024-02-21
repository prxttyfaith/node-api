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

module.exports = router;

const express = require("express");
const app = express();
const port = 3000;
const toDoListRouter = require("./routes/to-do-list");
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.get("/", (req, res) => {
  res.json({ message: "ok" });
});
app.use("/to-do-list", toDoListRouter);
/* Error handler middleware */
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });
  return;
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});