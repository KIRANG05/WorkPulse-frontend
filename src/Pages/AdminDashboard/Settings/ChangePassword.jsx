// ChangePassword.jsx
import React, { useState } from "react";
import styles from "./ChangePassword.module.css";
import Swal from "sweetalert2";
import api from "../../../Services/api";

function ChangePassword() {
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
    <div className={styles.container}>
      <h2 className={styles.title}>Change Password</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label>Old Password</label>
          <input
            type="password"
            name="oldPassword"
            value={form.oldPassword}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label>New Password</label>
          <input
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className={styles.submitBtn}>Change Password</button>
      </form>
    </div>
  );
}

export default ChangePassword;
