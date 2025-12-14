import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import api from "../../Services/api";
import styles from "../AdminDashboard/AdminDashboard.module.css"; // using same CSS

function HrDashboardHome() {
  const [todayAttendance, setTodayAttendance] = useState(null);

  useEffect(() => {
    api
      .get("/attendence/today")
      .then((res) => setTodayAttendance(res.data.data))
      .catch(() => setTodayAttendance(null));
  }, []);

  const handlePunchIn = async () => {
    try {
      const res = await api.post("/attendence/punch-in");

      Swal.fire({
        icon: res.data.isSuccess ? "success" : "info",
        title: res.data.message,
        text: "You have successfully punched in!",
        timer: 2000,
        // showConfirmButton: false,
      });

      if (res.data.isSuccess) setTodayAttendance(res.data.data);
    } catch (e) {
      Swal.fire({ icon: "error", title: "Something went wrong!" });
    }
  };

  const handlePunchOut = async () => {
    try {
      const res = await api.post("/attendence/punch-out");

      Swal.fire({
        icon: res.data.isSuccess ? "success" : "info",
        title: res.data.message,
        text: "You have successfully punched out!",
        timer: 2000,
        // showConfirmButton: false,
      });

      if (res.data.isSuccess) setTodayAttendance(res.data.data);
    } catch (e) {
      Swal.fire({ icon: "error", title: "Something went wrong!" });
    }
  };

  return (
    <div className={styles.dashboardHome}>
      {/* TOP HEADER + Punch Button */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>HR Dashboard</h2>

        {!todayAttendance?.loginTime ? (
          <button
            style={{
              backgroundColor: "green",
              color: "white",
              padding: "10px 18px",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "16px",
            }}
            onClick={handlePunchIn}
          >
            Punch In
          </button>
        ) : !todayAttendance?.logoutTime ? (
          <button
            style={{
              backgroundColor: "red",
              color: "white",
              padding: "10px 18px",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "16px",
            }}
            onClick={handlePunchOut}
          >
            Punch Out
          </button>
        ) : (
          <span style={{ fontWeight: "bold", color: "green", fontSize: "16px" }}>
            ✔ Attendance Completed Today
          </span>
        )}
      </div>

      {/* HR DASHBOARD CARDS */}
      <div className={styles.cards}>
        <div className={styles.card}>Total Reportees: 12</div>
        <div className={styles.card}>Pending Leave Approvals: 4</div>
        <div className={styles.card}>Tasks Assigned Today: 7</div>
        <div className={styles.card}>Pending Tasks Assignments: 3</div>
      </div>

      {/* FUTURE: Charts or Widgets */}
      <div style={{ marginTop: "25px", textAlign: "center", fontStyle: "italic", opacity: 0.8 }}>
        📊 Charts / Reports Section Coming Soon...
      </div>
    </div>
  );
}

export default HrDashboardHome;

