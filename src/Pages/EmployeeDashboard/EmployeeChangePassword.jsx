// ChangePassword.jsx
import React, { useState } from "react";
import styles from "./EmployeeChangePassword.module.css";
import Swal from "sweetalert2";
import api from "../../Services/api";

function EmployeeChangePassword() {
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "New Password and Confirm Password do not match!",
      });
      return;
    }

 try {
      const response = await api.post("/users/changePassword", form);

      if (response.data.isSuccess === true) {
        Swal.fire({
          icon: "success",
          title: response.data.status,
          text: response.data.message,
        }).then(() => {
          // clear form and logout
          setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
          localStorage.clear(); // remove any tokens/user info
          window.location.href = "/login"; // redirect to login page
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.data.message,
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Something went wrong!",
      });
    }
  };

 return (
<div className={styles.changePasswordCard}>
  <h2 className={styles.title}>Change Password</h2>

  <form onSubmit={handleSubmit}>
    <div className={styles.formGroup}>
      <label>Current Password</label>
      <input
        type="password"
        name="oldPassword"
        value={form.oldPassword}
        onChange={handleChange}
        className={styles.inputField}
        required
      />
    </div>

    <div className={styles.formGroup}>
      <label>New Password</label>
      <input
        type="password"
        name="newPassword"
        value={form.newPassword}
        onChange={handleChange}
        className={styles.inputField}
        required
      />
    </div>

    <div className={styles.formGroup}>
      <label>Confirm Password</label>
      <input
        type="password"
        name="confirmPassword"
        value={form.confirmPassword}
        onChange={handleChange}
        className={styles.inputField}
        required
      />
    </div>

    <button type="submit" className={styles.changeBtn}>
      Update
    </button>
  </form>
</div>

);

}

export default EmployeeChangePassword;
