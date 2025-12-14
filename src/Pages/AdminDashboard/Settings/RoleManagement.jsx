import React, { useEffect, useState } from "react";
import api from "../../../Services/api";
import Swal from "sweetalert2";
import styles from "./RoleManagement.module.css";

function RoleManagement() {
  const [employees, setEmployees] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState({}); // track selected roles

  // 1️⃣ Fetch all employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await api.get("/users/allUsers");
        if (response.data.isSuccess) {
          setEmployees(response.data.users  || []);
          // Initialize selectedRoles with current roles
          const initialRoles = {};
          response.data.users.forEach(user  => {
            initialRoles[user.id] = user.role;
          });
          setSelectedRoles(initialRoles);
        }
      } catch (error) {
        Swal.fire("Error", "Failed to fetch employees!", "error");
      }
    };
    fetchEmployees();
  }, []);

  // 2️⃣ Handle dropdown change locally
  const handleSelectChange = (empId, value) => {
    setSelectedRoles(prev => ({ ...prev, [empId]: value }));
  };

  // 3️⃣ Handle "Change Role" button click
  const handleChangeRoleClick = async (empId) => {
    const newRole = selectedRoles[empId];
    try {
      const response = await api.put(`/users/updateRole/${empId}?newRole=${newRole}`);
      if (response.data.isSuccess) {
        Swal.fire("Success", response.data.message || "Role updated!", "success");
        setEmployees(prev =>
          prev.map(emp =>
            emp.id === empId ? { ...emp, role: newRole } : emp
          )
        );
      } else {
        Swal.fire("Error", response.data.message || "Role update failed", "error");
      }
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Something went wrong!",
        "error"
      );
    }
  };

  return (
    <div className={styles.container}>
      <h2>Role Management</h2>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Name</th>
            <th>Current Role</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {employees.length === 0 ? (
            <tr>
              <td colSpan="5">No employees found.</td>
            </tr>
          ) : (
            employees.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.id}</td>
                <td>{emp.username}</td>
                <td>{emp.role}</td>
                <td>
                  <select
                    value={selectedRoles[emp.id] || emp.role}
                    onChange={(e) => handleSelectChange(emp.id, e.target.value)}
                    className={styles.dropdown}
                  >
                    <option value="EMPLOYEE">EMPLOYEE</option>
                    <option value="HR">HR</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </td>
                <td>
                  <button
                    onClick={() => handleChangeRoleClick(emp.id)}
                    className={styles.changeRoleBtn}
                  >
                    Change Role
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default RoleManagement;
