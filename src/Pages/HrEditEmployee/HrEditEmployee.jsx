// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import styles from "./EditEmployee.module.css";
// import Swal from "sweetalert2";
// import api from "../../Services/api";

// function EditEmployee() {
//   const { id } = useParams(); // employee id from URL
//   const navigate = useNavigate();
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [employee, setEmployee] = useState({
//     name: "",
//     company: "",
//     salary: "",
//      role: "",
//   });

//   const imageBaseUrl = "http://localhost:8081/images/";
//   // Fetch employee details by ID
//  useEffect(() => {
//   const fetchEmployee = async () => {
//     try {
//       const response = await api.get(`/employee/employeeDetails/${id}`);
//       setEmployee(response.data.employee);
//       setEmployee({
//         ...empData,
//         role: empData.user?.role || "", // map role from user
//       });
//     } catch (err) {
//       console.error("Error fetching employee:", err);
//     }
//   };

//   fetchEmployee();
// }, [id]);

// const handleImageClick = () => {
//   document.getElementById("profileImageInput").click();
// };

// const handleImageChange = (e) => {
//   if (e.target.files && e.target.files[0]) {
//     setSelectedImage(e.target.files[0]);
//   }
// };
//   // Handle form change
//   const handleChange = (e) => {
//     setEmployee({ ...employee, [e.target.name]: e.target.value });
//   };

//  const handleSubmit = async (e) => {
//   e.preventDefault();

//   try {
//     const formData = new FormData();

//     // Always include the employee JSON
//     formData.append(
//       "employee",
//       JSON.stringify({
//         ...employee,
//         profileImage: employee.profileImage, // keep existing image if not changed
//       })
//     );

//     // Append the image only if a new one is selected
//     if (selectedImage) {
//       formData.append("image", selectedImage);
//     } else {
//       // If no new image, send empty blob (optional)
//       formData.append("image", new Blob(), ""); 
//     }

//     const response = await api.put(
//       `/employee/employeeUpdateById/${id}`,
//       formData,
//       { headers: { "Content-Type": "multipart/form-data" } }
//     );

//     Swal.fire({
//       icon: "success",
//       title: response.data.status,
//       text: response.data.message,
//     });

//     navigate("/admin-dashboard");
//   } catch (err) {
//     console.error("Update error:", err);
//   }
// };




//   return (
//     <div className={styles.editContainer}>
//       <h2 className={styles.editTitle}>Edit Employee</h2>
//       <form onSubmit={handleSubmit} className={styles.editForm}>
//         <input
//           type="text"
//           name="name"
//           value={employee.name}
//           onChange={handleChange}
//           placeholder="Name"
//           className={styles.editInput}
//           required
//         />
//         <input
//           type="company"
//           name="company"
//           value={employee.company}
//           onChange={handleChange}
//           placeholder="company"
//           className={styles.editInput}
//           required
//         />
//         <input
//           type="text"
//           name="salary"
//           value={employee.salary}
//           onChange={handleChange}
//           placeholder="salary"
//           className={styles.editInput}
//           required
//         />
//          <div className={styles.imageContainerWrapper}>
//   <div className={styles.imageContainer} onClick={handleImageClick}>
//     <img
//       src={
//         selectedImage
//           ? URL.createObjectURL(selectedImage)
//           : employee.profileImage
//           ? `${imageBaseUrl}${employee.profileImage}`
//           : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" // fallback if no image
//       }
//       alt="Profile"
//       className={styles.profileImg}
//       onError={(e) => (e.target.src = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png")}
//     />
//     <input
//       type="file"
//       id="profileImageInput"
//       accept="image/*"
//       onChange={handleImageChange}
//       style={{ display: "none" }}
//     />
//   </div>
// </div>

      

//         <button type="submit" className={styles.updateBtn}>
//            Update 
//         </button>
        
//       </form>
//       <button
//                 className={styles.backBtn}
//                 onClick={() => navigate("/admin-dashboard/employees")}
//               >
//                  Back 
//               </button>
//     </div>
//   );
// }

// export default EditEmployee;
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./HrEditEmployee.module.css";
import Swal from "sweetalert2";
import api from "../../Services/api";

function HrEditEmployee() {
  const { id } = useParams(); // userId
  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState(null);
  const [employee, setEmployee] = useState({
    empId: null,
    name: "",
    company: "",
    salary: "",
    profileImage: "",
    hasEmployeeProfile: false,
  });

  const imageBaseUrl = "http://localhost:8081/images/";

  // Fetch user + employee details
  useEffect(() => {
    const fetchUserById = async () => {
      try {
        const res = await api.get(`/users/admin/${id}`);
        if (res.data.isSuccess && res.data.data) {
          const userData = res.data.data;
          const hasEmpData = !!userData.empId;

          setEmployee({
            empId: userData.empId || null,
            name: hasEmpData ? userData.name : userData.username,
            company: hasEmpData ? userData.company : "",
            salary: hasEmpData ? userData.salary : "",
            profileImage: hasEmpData ? userData.profileImage : "",
            hasEmployeeProfile: hasEmpData,
          });
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUserById();
  }, [id]);

  const handleImageClick = () => {
    if (!employee.hasEmployeeProfile) return;
    document.getElementById("profileImageInput").click();
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleChange = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      // Always send current data
      formData.append(
        "employee",
        new Blob(
          [
            JSON.stringify({
              name: employee.name,
              company: employee.company,
              salary: employee.salary,
            }),
          ],
          { type: "application/json" }
        )
      );

      // Only send image if changed
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      // Use employee ID if exists, else user ID
      const idToUpdate = parseInt(id); // ALWAYS USER ID


      const response = await api.put(`/users/userUpdateById/${idToUpdate}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire("Success", response.data.message, "success");
      navigate("/hr-dashboard/settings/profile");
    } catch (err) {
      console.error("Update error:", err);
      Swal.fire("Error", err.response?.data?.message || "Update failed", "error");
    }
  };

  return (
    <div className={styles.editContainer}>
      <h2 className={styles.editTitle}>Edit User</h2>

      <form onSubmit={handleSubmit} className={styles.editForm}>
        {/* Name input (always editable) */}
        <input
          type="text"
          name="name"
          value={employee.name}
          onChange={handleChange}
          placeholder="Name"
          className={styles.editInput}
          required
        />

        {/* Show company & salary only if employee exists */}
        {employee.hasEmployeeProfile && (
          <>
            <input
              type="text"
              name="company"
              value={employee.company}
              onChange={handleChange}
              placeholder="Company"
              className={styles.editInput}
              required
            />
            <input
              type="text"
              name="salary"
              value={employee.salary}
              onChange={handleChange}
              placeholder="Salary"
              className={styles.editInput}
              required
            />
          </>
        )}

        {/* Profile image */}
        <div className={styles.imageContainerWrapper}>
          <div className={styles.imageContainer} onClick={handleImageClick}>
            <img
              src={
                selectedImage
                  ? URL.createObjectURL(selectedImage)
                  : employee.profileImage
                  ? `${imageBaseUrl}${employee.profileImage}`
                  : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              }
              alt="Profile"
              className={styles.profileImg}
              onError={(e) =>
                (e.target.src =
                  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png")
              }
            />
            {employee.hasEmployeeProfile && (
              <input
                type="file"
                id="profileImageInput"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            )}
          </div>
        </div>

        <button type="submit" className={styles.updateBtn}>
          Update
        </button>
      </form>

      <button
        className={styles.backBtn}
        onClick={() => navigate("/hr-dashboard/settings/profile")}
      >
        Back
      </button>
    </div>
  );
}

export default HrEditEmployee;




