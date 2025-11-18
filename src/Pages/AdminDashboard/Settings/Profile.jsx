import React, { useState, useEffect } from "react";
import styles from "./Profile.module.css";
import { useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";  
import api from "../../../Services/api";


function Profile() {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState({
      name: "",
      company: "",
      salary: "",
      profileImage:"",
    });

  const imageBaseUrl = "http://localhost:8081/images/";

  useEffect(() => {
  const fetchEmployee = async () => {
    try {
      const id = localStorage.getItem("userId"); // 👈 Get ID from localStorage
      if (!id) {
        console.error("User ID not found in localStorage");
        return;
      }

      const response = await api.get(`/employee/employeeDetails/${id}`);
     setEmployee((prev) => ({ ...prev, ...response.data.employee })); // assuming API returns the employee directly
    } catch (err) {
      console.error("Error fetching employee:", err);
    }
  };

  fetchEmployee();
}, []);


  const handleEdit = () => {
    navigate(`/employeeUpdateById/${localStorage.getItem("userId")}`); // change dynamically later
  };

  return (
    <div className={styles.outerContainer}>
      <div className={styles.profileContainer}>
        <div className={styles.headerRow}>
          <h2>Profile</h2>
          <FaEdit className={styles.editIcon} onClick={handleEdit} />
        </div>

        <div className={styles.contentRow}>
          <div className={styles.leftSection}>
            <img
  src={
    employee?.profileImage
      ? `${imageBaseUrl}${employee.profileImage}`
      : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
  }
  alt={employee.name}
  className={styles.profileImage}
/>

          </div>

          <div className={styles.rightSection}>
            <div className={styles.infoRow}>
              <span className={styles.label}>Name:</span>
              <span className={styles.value}>{employee.name}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Company:</span>
              <span className={styles.value}>{employee.company}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Salary:</span>
              <span className={styles.value}>{employee.salary}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
