import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../Services/api"; // axios instance
import styles from "./Login.module.css"; // your CSS module
import { useAuth } from "../../Context/AuthContext"; 

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth(); 
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  // handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", form);
      console.log("Backend Login Response:", response.data);

      if (response.data.isSuccess) {

        login({
          id: response.data.id,
        token: response.data.accessToken,
        refreshToken: response.data.refreshToken,
        username: response.data.username,
        role: response.data.role,
      });
        // save token + user info
        localStorage.setItem("token", response.data.accessToken);
        localStorage.setItem("username", response.data.username);
        localStorage.setItem("role", response.data.role);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        localStorage.setItem("userId", response.data.id);

        Swal.fire({
          icon: "success",
          title: response.data.message,
          text: `Welcome ${response.data.username}!`,
          confirmButtonText: "OK",
        }).then(() => {
           const role = response.data.role;

  if (role === "ROLE_ADMIN") navigate("/admin-dashboard");
  else if (role === "ROLE_HR") navigate("/hr-dashboard");
  else if (role === "ROLE_EMPLOYEE") navigate("/employee-dashboard");
  else navigate("/dashboard");// 👈 redirect after login
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: response.data.message,
        });
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "An error occurred. Please try again.";
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: errorMsg,
      });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <h2 className={styles.title}>Login</h2>

        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Username</label>
            <input
              className={styles.input}
              type="text"
              name="username"
              placeholder="Enter your username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Password</label>
            <input
              className={styles.input}
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className={styles.button}>
            Login
          </button>
        </form>

        <div className={styles.footer}>
          <p>
            New user? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
