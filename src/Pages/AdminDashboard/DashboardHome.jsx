import React, { useEffect, useState } from "react";
import styles from "./AdminDashboard.module.css";
import DashboardPieChart from "./DashboardPieChart";
import EmployeePieChart from "../Charts/EmployeePieChart";
import SalaryBarChart from "../Charts/SalaryBarChart";
import EmployeeGrowthChart from "../Charts/EmployeeGrowthChart";
import api from "../../Services/api";
import Swal from "sweetalert2";
function DashboardHome() {

    const employees = [
    { name: "John", salary: 25000, company: "Google" },
    { name: "Anna", salary: 45000, company: "Amazon" },
    { name: "Mike", salary: 60000, company: "Microsoft" },
    { name: "Sara", salary: 15000, company: "Google" },
  ];
  const [todayAttendance, setTodayAttendance] = useState(null);

useEffect(() => {
  api.get("/attendence/today")
    .then(res => setTodayAttendance(res.data.data))
    .catch(() => setTodayAttendance(null));
}, []);




const handlePunchIn = async () => {
  try {
    const res = await api.post("/attendence/punch-in");

    Swal.fire({
      icon: res.data.isSuccess ? "success" : "info",
      title: res.data.message,
      text:"You have successfully punched in!",   // backend message
      timer: 2000,
      // showConfirmButton: false,
    });

    if (res.data.isSuccess) {
      setTodayAttendance(res.data.data);
    }

  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Something went wrong!",
    });
  }
};


const handlePunchOut = async () => {
  try {
    const res = await api.post("/attendence/punch-out");

    Swal.fire({
      icon: res.data.isSuccess ? "success" : "info",
      title: res.data.message,
      text:"You have been Punched out successfully!" , // backend message
      timer: 2000,
      // showConfirmButton: false,
    });

    if (res.data.isSuccess) {
      setTodayAttendance(res.data.data);
    }

  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Something went wrong!",
    });
  }
};



  return (
    <div className={styles.dashboardHome}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
  <h2>Dashboard Overview</h2>

  {/* Punch Button */}
  {!todayAttendance?.loginTime ? (
    <button
      style={{
        backgroundColor: "green",
        color: "white",
        padding: "10px 18px",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "16px"
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
        fontSize: "16px"
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

      <div className={styles.cards}>
        <div className={styles.card}>Total Employees: 25</div>
        <div className={styles.card}>HR Users: 3</div>
        <div className={styles.card}>Active Tasks: 12</div>
        <div className={styles.card}>Pending Approvals: 5</div>
      </div>
       <div className={styles.chartsRow}>
  <div className={styles.chartBox}>
    <EmployeePieChart employees={employees} />
  </div>
  <div className={styles.chartBox}>
    <SalaryBarChart employees={employees} />
  </div>
</div>

      {/* growth line chart */}
      <EmployeeGrowthChart />
    </div>
  );
}

export default DashboardHome;
    