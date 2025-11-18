import React, { useState } from "react";
import api from "../../Services/api";
import Swal from "sweetalert2";
import styles from "./AddEmployee.module.css";
import { useNavigate } from "react-router-dom";

function AddEmployee() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    company: "",
    salary: "",
  });

   const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file)); // for live preview
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

     const formData = new FormData();
  formData.append("employee", JSON.stringify(form)); // 👈 send as JSON string
  if (image) {
    formData.append("image", image);
  }
    try {
      

      const response = await api.post("/employee/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire({
        icon: "success",
        title: response.data.status,
        text: response.data.message,
      });
      setForm({ name: "", company: "", salary: "" });
      setImage(null);
      setPreview(null);
      navigate("/admin-dashboard"); // redirect back to employee list
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
      <div className={styles.formBox}>
        <h2 className={styles.title}>Add Employee</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter employee name"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Company</label>
            <input
              type="text"
              name="company"
              value={form.company}
              onChange={handleChange}
              placeholder="Enter company name"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Salary</label>
            <input
              type="number"
              name="salary"
              value={form.salary}
              onChange={handleChange}
              placeholder="Enter salary"
              required
            />
          </div>

        <div className={styles.inputGroup}>
  <label>Profile Image</label>
  <div className={styles.imageUploadSection}>
    <label htmlFor="imageUpload" className={styles.imageLabel}>
      <img
        src={preview || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
        alt="Profile Preview"
        className={styles.profileImage}
      />
      <div className={styles.overlay}>
        <span className={styles.editText}>📷</span>
      </div>
    </label>
    <input
      id="imageUpload"
      type="file"
      accept="image/*"
      onChange={handleImageChange}
      style={{ display: "none" }}
    />
  </div>
</div>



          <button type="submit" className={styles.submitBtn}>
             Add 
          </button>
        </form>

        <button
          className={styles.backBtn}
          onClick={() => navigate("/admin-dashboard/employees")}
        >
           Back 
        </button>
      </div>
    </div>
  );
}

export default AddEmployee;
