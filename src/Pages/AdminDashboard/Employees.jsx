// EmployeeList.jsx
import React, { useEffect, useState } from "react";
import api from "../../Services/api";
import styles from "./Employees.module.css";
import { Navigate, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Employees() {
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate()

  const imageBaseUrl = "http://localhost:8081/images/";

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await api.get("/employee/employeeDetails");
      setEmployees(response.data.employees || []);
    } catch (err) {
      console.error("Error fetching employees", err);
    }
  };

   // Delete Employee
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Delete!",
    });

    if (confirm.isConfirmed) {
      try {
        const response = await api.delete(`/employee/deleteById/${id}`);
        Swal.fire({
          icon: "success",
          title: response.data.status,
          text: response.data.message,
        });
        fetchEmployees(); // refresh list
      } catch (err) {
        Swal.fire({
          icon: "error",
          title:  response.data.status,
          text: err.response?.data?.message,
        });
        console.error("Delete error:", err);
      }
    }
  };

  return (
    <div className={styles.employeeList}>
      <div className={styles.header}>
        <h2>Employee Details</h2>
        <button className={styles.addBtn} onClick={() => navigate("/add-employee")}>+ Add Employee</button>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Emp Id</th>
            <th>Profile Image</th>
            <th>Name</th>
            <th>Company</th>
            <th>Salary</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.length > 0 ? (
            employees.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.id}</td>
               <td>
          <img
            src={
              emp.profileImage
                ? `${imageBaseUrl}${emp.profileImage}` // Backend folder mapping
                : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" // Default placeholder
            }
            alt={emp.name}
            className={styles.profileImage}
          />
        </td>

                <td>{emp.name}</td>
                <td>{emp.company}</td>
                <td>{emp.salary}</td>
                <td className={styles.actions}>
                  <button className={styles.editBtn} title="Edit" onClick={() => navigate(`/employeeUpdateById/${emp.id}`)}>✏️</button>
                  <button className={styles.deleteBtn} title="Delete" onClick={() => handleDelete(emp.id)}>🗑️</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No employees found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Employees;
