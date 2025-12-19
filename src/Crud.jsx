import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Crud.css";
const API_URL = "http://localhost:7654/emp";

const Crud = () => {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    id: "",
    gender: "",
    department: "",
    shift: "",
    employeetype: "",
  });
  const [editId, setEditId] = useState(null);
  const GENDER_OPTIONS = ["male", "female", "transgender"];

  const SHIFT_OPTIONS = ["morning shift", "mid shift", "night shift"];
  const [error, setError] = useState("");

  const DEPARTMENT_OPTIONS = [
    "Production",
    "Maintenance",
    "Quality",
    "Packing",
    "HR",
    "Security",
  ];

  const EMPLOYEE_TYPE_OPTIONS = ["Permanent", "Contract", "Daily Wage"];

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(API_URL);
      setEmployees(res.data.message);
    } catch (err) {
      console.log(err.response.data.message);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async () => {
    // 🔴 Frontend validation
    if (
      !formData.name ||
      !formData.id ||
      !formData.gender ||
      !formData.department ||
      !formData.shift ||
      !formData.employeetype
    ) {
      setError("⚠️ All fields are mandatory");
      return;
    }

    try {
      setError(""); // clear error

      if (editId) {
        await axios.put(`${API_URL}/${editId}`, formData);
      } else {
        await axios.post(API_URL, formData);
      }

      resetForm();
      fetchEmployees();
    } catch (err) {
      // backend error message (if any)
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleEdit = (emp) => {
    setEditId(emp._id);

    setFormData({
      name: emp.name,
      id: emp.id,
      gender: emp.gender,
      department: emp.department,
      shift: emp.shift,
      employeetype: emp.employeetype,
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchEmployees();
      setFormData({
        name: "",
        id: "",
        gender: "",
        department: "",
        shift: "",
        employeetype: "",
      });
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      id: "",
      gender: "",
      department: "",
      shift: "",
      employeetype: "",
    });
    setEditId(null);
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Employee Maual Entry List</h2>
      {error && (
        <div className="alert alert-danger text-center fw-semibold">
          {error}
        </div>
      )}
      <div className="card p-3 mb-4">
        <div className="row g-2">
          <div className="col-md-4">
            <input
              className="form-control"
              name="name"
              placeholder="NAME"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <input
              className="form-control"
              name="id"
              placeholder="EMP ID"
              value={formData.id}
              onChange={handleChange}
              disabled={!!editId}
            />
          </div>

          <div className="col-md-4">
            <select
              className="form-select"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              {GENDER_OPTIONS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <select
              className="form-select"
              name="department"
              value={formData.department}
              onChange={handleChange}
            >
              <option value="">Select Department</option>
              {DEPARTMENT_OPTIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <select
              className="form-select"
              name="shift"
              value={formData.shift}
              onChange={handleChange}
            >
              <option value="">Select Shift</option>
              {SHIFT_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <select
              className="form-select"
              name="employeetype"
              value={formData.employeetype}
              onChange={handleChange}
            >
              <option value="">Select Employee Type</option>
              {EMPLOYEE_TYPE_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button className="btn btn-primary mt-3" onClick={handleSubmit}>
          {editId ? "Update Employee" : "Add Employee"}
        </button>
      </div>

      <table className="table table-bordered text-center table-gradient">
        <thead>
          <tr>
            <th>Name</th>
            <th>Emp ID</th>
            <th>Gender</th>
            <th>Department</th>
            <th>Shift</th>
            <th>Type</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp._id}>
              <td>{emp.name}</td>
              <td>{emp.id}</td>
              <td>{emp.gender}</td>
              <td>{emp.department}</td>
              <td>{emp.shift}</td>
              <td>{emp.employeetype}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => handleEdit(emp)}
                >
                  Edit
                </button>
              </td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(emp._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Crud;
