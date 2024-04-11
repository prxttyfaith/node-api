require('dotenv').config();
const express = require("express");
const cors = require("cors");
const app = express();
const host = process.env.API_HOST || "localhost";
const port = process.env.PORT || 3000;
const toDoListRouter = require('./routes/to-do-list');
const employeesRouter = require('./routes/employees');
const employeeDesignationsRouter = require('./routes/employee-designations');
const leaveRequestsRouter = require('./routes/employee-leave-requests');
const employeeSignatoriesRouter = require('./routes/employee-signatories');
const employeePayrollsRouter = require('./routes/employee-payrolls');

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
app.use("/employees", employeesRouter);
app.use("/employee-designations", employeeDesignationsRouter);
app.use("/employee-leave-requests", leaveRequestsRouter);
app.use("/employee-signatories", employeeSignatoriesRouter);
app.use("/employee-payrolls", employeePayrollsRouter);


/* Error handler middleware */
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });
  return;
});
app.listen(port, () => {
  console.log(`Node API is running at: ${host}:${port}`);
});

