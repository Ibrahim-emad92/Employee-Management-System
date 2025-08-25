const { sql, poolPromise } = require("../db");

exports.getAllEmployees = async (req, res) => {
  try {
    const pool = await poolPromise;
    const data = await pool.request().query("SELECT * FROM NewTableEmployees");
    res.status(200).json({ success: true, data: data.recordset });
  } catch (err) {
    console.error("Error fetching employees:", err);
    res.status(500).json({ success: false, message: "Server error", err });
  }
};

exports.getEmployeeById = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("EmployeeID", sql.Int, req.params.id)
      .query("SELECT * FROM NewTableEmployees WHERE EmployeeID = @EmployeeID");

    if (result.recordset.length === 0) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    res.status(200).json({ success: true, data: result.recordset[0] });
  } catch (err) {
    console.error("Error fetching employee by ID:", err);
    res.status(500).json({ success: false, message: "Server error", err });
  }
};

exports.addEmployee = async (req, res) => {
  try {
    const { EmployeeName, MobileNumber, Department, Salary } = req.body;
    if (!EmployeeName || !Salary) {
      return res.status(400).json({ success: false, message: "EmployeeName and Salary are required" });
    }

    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("EmployeeName", sql.VarChar(100), EmployeeName)
      .input("MobileNumber", sql.VarChar(15), MobileNumber || null)
      .input("Department", sql.VarChar(50), Department || null)
      .input("Salary", sql.Decimal(18, 2), Salary)
      .query(
        "INSERT INTO NewTableEmployees (EmployeeName, MobileNumber, Department, Salary) " +
        "OUTPUT INSERTED.* VALUES (@EmployeeName, @MobileNumber, @Department, @Salary)"
      );

    res.status(201).json({ success: true, message: "Employee added successfully", data: result.recordset[0] });
  } catch (err) {
    console.error("Error adding employee:", err);
    res.status(500).json({ success: false, message: "Server error", err });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const { EmployeeName, MobileNumber, Department, Salary } = req.body;
    const { id } = req.params;
    if (!EmployeeName || !Salary) {
      return res.status(400).json({ success: false, message: "EmployeeName and Salary are required" });
    }

    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("EmployeeID", sql.Int, id)
      .input("EmployeeName", sql.VarChar(100), EmployeeName)
      .input("MobileNumber", sql.VarChar(15), MobileNumber || null)
      .input("Department", sql.VarChar(50), Department || null)
      .input("Salary", sql.Decimal(18, 2), Salary)
      .query(
        "UPDATE NewTableEmployees SET EmployeeName=@EmployeeName, MobileNumber=@MobileNumber, " +
        "Department=@Department, Salary=@Salary OUTPUT INSERTED.* WHERE EmployeeID=@EmployeeID"
      );

    if (result.recordset.length === 0) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    res.status(200).json({ success: true, message: "Employee updated successfully", data: result.recordset[0] });
  } catch (err) {
    console.error("Error updating employee:", err);
    res.status(500).json({ success: false, message: "Server error", err });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("EmployeeID", sql.Int, id)
      .query("DELETE FROM NewTableEmployees OUTPUT DELETED.* WHERE EmployeeID = @EmployeeID");

    if (result.recordset.length === 0) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    res.status(200).json({ success: true, message: "Employee deleted successfully", data: result.recordset[0] });
  } catch (err) {
    console.error("Error deleting employee:", err);
    res.status(500).json({ success: false, message: "Server error", err });
  }
};
