import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

import api from "../../Services/api";
import styles from "../AdminDashboard/AdminDashboard.module.css"; // same css

function EmployeeDashboardHome() {
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [taskSummary, setTaskSummary] = useState({
    assigned: 0,
    pending: 0,
    completed: 0,
    overdue: 0
  });
 
  const taskProgress =
  taskSummary.assigned > 0
    ? Math.round((taskSummary.completed / taskSummary.assigned) * 100)
    : 0;

    const totalTasks =
  taskSummary.completed +
  taskSummary.pending +
  taskSummary.overdue;


    

const pieData = [
  { name: "Completed", value: taskSummary.completed },
  { name: "Pending", value: taskSummary.pending },
  { name: "Overdue", value: taskSummary.overdue }
];

const COLORS = {
  Completed: "#59A14F",
  Pending: "#F28E2B",
  Overdue: "#E15759"
};


 useEffect(() => {
  const username = localStorage.getItem("username");

  // Attendance
  api.get("/attendence/today")
    .then(res => setTodayAttendance(res.data.data))
    .catch(() => setTodayAttendance(null));

  // Task summary
  api.get("/reports/taskSummaryByEmployee", {
    params: { employeeName: username }
  })
  .then(res => {
    setTaskSummary({
      assigned: res.data.totalTasks ?? 0,
      completed: res.data.completedTasks ?? 0,
      pending: res.data.pendingTasks ?? 0,
      overdue: res.data.overDueTasks ?? 0
    });
  })
  .catch(() => {
    setTaskSummary({
      assigned: 0,
      completed: 0,
      pending: 0,
      overdue: 0
    });
  });

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
    } catch {
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
    } catch {
      Swal.fire({ icon: "error", title: "Something went wrong!" });
    }
  };

  return (
    <div className={styles.dashboardHome}>
      {/* HEADER + Punch Button */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Employee Dashboard</h2>

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
          
          onClick={handlePunchIn}>Punch In</button>
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
          
          onClick={handlePunchOut}>Punch Out</button>
        ) : (
          <span style={{ fontWeight: "bold", color: "green", fontSize: "16px" }}>
            ✔ Attendance Completed Today
          </span>
        )}
      </div>

      {/* EMPLOYEE DASHBOARD CARDS */}
      <div className={styles.cards}>
  <div className={styles.card}>📋 Tasks Assigned: {taskSummary.assigned}</div>
  <div className={styles.card}>⏳ Pending Tasks: {taskSummary.pending}</div>
  <div className={styles.card}>✅ Completed Tasks: {taskSummary.completed}</div>
  <div className={styles.card}>⚠️ Overdue Tasks: {taskSummary.overdue}</div>
</div>

<div className={styles.horizontalCards}>

  <div className={styles.card}>
    <h4>🕒 Today’s Status</h4>

    <p>
      <strong>Punch In:</strong>{" "}
      {todayAttendance?.loginTime
        ? todayAttendance.loginTime
        : "Not punched in"}
    </p>

    <p>
      <strong>Punch Out:</strong>{" "}
      {todayAttendance?.logoutTime
        ? todayAttendance.logoutTime
        : "Not punched out"}
    </p>
  </div>

  <div className={styles.card}>
    <h4>📊 Task Progress</h4>

    <div className={styles.progressBar}>
      <div
        className={styles.progressFill}
        style={{ width: `${taskProgress}%` }}
      />
    </div>

    <p className={styles.progressText}>
      {taskProgress}% Completed ({taskSummary.completed} / {taskSummary.assigned})
    </p>
  </div>

  <div className={styles.card}>
    <h4>⚠️ Pending Actions</h4>

    <ul>
      {taskSummary.pending > 0 && (
        <li>{taskSummary.pending} task(s) pending</li>
      )}

      {!todayAttendance?.logoutTime && todayAttendance?.loginTime && (
        <li>Punch out pending</li>
      )}

      {taskSummary.pending === 0 &&
        todayAttendance?.logoutTime && (
          <li>All tasks and attendance completed 🎉</li>
        )}
    </ul>
  </div>

</div>


<div style={{ position: "relative", width: "320px", margin: "0 auto" }}>
  <PieChart width={320} height={260}>
    <Pie
      data={pieData}
      dataKey="value"
      cx="50%"
      cy="50%"
      innerRadius={60}
      outerRadius={90}
    >
      {pieData.map((entry, index) => (
        <Cell key={index} fill={COLORS[entry.name]} />
      ))}
    </Pie>
    <Tooltip />
    <Legend />
  </PieChart>

  {/* CENTER TEXT */}
  <div
    style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      textAlign: "center"
    }}
  >
    <div style={{ fontSize: "20px", fontWeight: "bold" }}>
      {totalTasks}
    </div>
    <div style={{ fontSize: "12px", opacity: 0.7 }}>
      Total Tasks
    </div>
  </div>
</div>



      {/* LATEST NOTIFICATIONS */}
      {/* <h3 style={{ marginTop: "30px" }}>🔔 Latest Notifications</h3> */}
      {/* {notifications.length > 0 ? ( */}
        {/* <ul> */}
          {/* {notifications.slice(0, 3).map((n) => ( */}
            {/* <li key={n.id}>📌 {n.message}</li> */}
          {/* ))} */}
        {/* </ul> */}
      {/* ) : ( */}
        {/* <p style={{ opacity: 0.7 }}>No notifications</p> */}
      {/* )} */}

      {/* FUTURE WIDGETS */}
      {/* <div style={{ marginTop: "25px", textAlign: "center", fontStyle: "italic", opacity: 0.8 }}>
        📌 More features coming soon...
      </div> */}
    </div>
  );
}

export default EmployeeDashboardHome;
