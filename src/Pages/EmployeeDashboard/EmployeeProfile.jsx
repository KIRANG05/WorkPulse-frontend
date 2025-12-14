import React, { useState, useEffect } from "react";
import styles from "./EmployeeProfile.module.css";
import { useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import api from "../../Services/api";

function EmployeeProfile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: "",
    role: "",
    company: "",
    salary: "",
    profileImage: "",
    hasEmployeeProfile: false,
  });

  const imageBaseUrl = "http://localhost:8081/images/";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        const res = await api.get(`/users/admin/${userId}`);

        if (res.data.isSuccess && res.data.data) {
          const data = res.data.data;
          const hasEmp = !!data.empId;

          setProfile({
            name: hasEmp ? data.name : data.username,
            role: data.role,
            company: hasEmp ? data.company : "",
            salary: hasEmp ? data.salary : "",
            profileImage: hasEmp ? data.profileImage : "",
            hasEmployeeProfile: hasEmp,
          });
        }
      } catch (err) {
        console.error("Error fetching profile", err);
      }
    };

    fetchProfile();
  }, []);

  const handleEdit = () => {
    navigate(`/empemployeeUpdateById/${localStorage.getItem("userId")}`);
  };

  return (
    <div className={styles.outerContainer}>
      <div className={styles.profileContainer}>
        <div className={styles.headerRow}>
          <h2>Profile</h2>
          <FaEdit className={styles.editIcon} onClick={handleEdit} />
        </div>

        <div className={styles.contentRow}>
          {/* LEFT: IMAGE */}
          <div className={styles.leftSection}>
            <img
              src={
                profile.hasEmployeeProfile && profile.profileImage
                  ? `${imageBaseUrl}${profile.profileImage}`
                  : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              }
              alt={profile.name}
              className={styles.profileImage}
            />
          </div>

          {/* RIGHT: DETAILS */}
          <div className={styles.rightSection}>
            <div className={styles.infoRow}>
              <span className={styles.label}>Name:</span>
              <span className={styles.value}>{profile.name}</span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.label}>Role:</span>
              <span className={styles.value}>{profile.role}</span>
            </div>

            {/* Show only if employee exists */}
            {profile.hasEmployeeProfile && (
              <>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Company:</span>
                  <span className={styles.value}>{profile.company}</span>
                </div>

                <div className={styles.infoRow}>
                  <span className={styles.label}>Salary:</span>
                  <span className={styles.value}>{profile.salary}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeProfile;