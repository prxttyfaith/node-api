const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;
const toDoListRouter = require('./routes/to-do-list');
const employeeRouter = require('./routes/employee');
app.use(cors());
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
app.use("/employee", employeeRouter);
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

