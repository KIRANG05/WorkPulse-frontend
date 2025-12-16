import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import api from "../../Services/api";
import { PieChart, Pie, Cell, Tooltip, Legend , ResponsiveContainer} from "recharts";
import styles from "../AdminDashboard/AdminDashboard.module.css"; // using same CSS

function HrDashboardHome() {
  const [todayAttendance, setTodayAttendance] = useState(null);

  const [summary, setSummary] = useState({
    totalReportees: 0,
    pendingLeaveApprovals: 0,
    tasksAssignedToday: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overDueTasks: 0,
  });

  const loggedInHr = localStorage.getItem("username");

  useEffect(() => {
    api
      .get("/attendence/today")
      .then((res) => setTodayAttendance(res.data.data))
      .catch(() => setTodayAttendance(null));
  


    // HR Dashboard Summary
   api
      .get("/hr/dashboard/summary")
      .then((res) => {
        if (res.data.isSuccess) {
          const data = res.data.data;
          setSummary((prev) => ({
            ...prev,
            totalReportees: data.totalReportees ?? 0,
            pendingLeaveApprovals: data.pendingLeaveApprovals ?? 0,
          }));
        }
      })
      .catch(() => Swal.fire("Error", "Failed to load reportees or leave approvals", "error"));


    // 3️⃣ Fetch HR-assigned tasks summary
  api
      .get(`/reports/taskSummaryByHr?hrName=${loggedInHr}`)
      .then((res) => {
        if (res.data.isSuccess) {
          // This API returns counters at root level, not inside `data`
          setSummary((prev) => ({
            ...prev,
            tasksAssignedToday: res.data.taskAssignedToday ?? 0,
            totalTasks: res.data.totalTasks ?? 0,
            completedTasks: res.data.completedTasks ?? 0,
            pendingTasks: res.data.pendingTasks ?? 0,
            overDueTasks: res.data.overDueTasks ?? 0,
          }));
        }
      })
      .catch(() => Swal.fire("Error", "Failed to load HR tasks summary", "error"));

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

  const pieData = [
    { name: "Completed", value: summary.completedTasks },
    { name: "Pending", value: summary.pendingTasks },
    { name: "Overdue", value: summary.overDueTasks },
  ];
  const COLORS = ["#28a745", "#ffc107", "#dc3545"]; // green, yellow, red

  return (
    <div className={styles.dashboardHome}>
      {/* TOP HEADER + Punch Button */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Dashboard Overview</h2>

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
       {/* HR DASHBOARD CARDS */}
      <div className={styles.cards}>
        <div className={styles.card}>👥 Total Reportees: {summary.totalReportees}</div>
        <div className={styles.card}>🕒 Pending Leave Approvals: {summary.pendingLeaveApprovals}</div>
        <div className={styles.card}>📋 Tasks Assigned Today: {summary.tasksAssignedToday}</div>
        <div className={styles.card}>⚠️ Overdue Tasks: {summary.overDueTasks}</div>
      </div>

      {/* TASK SUMMARY (TEXT – PIE CAN BE ADDED NEXT) */}
      <div className={styles.cards} style={{ marginTop: "20px" }}>
        <div className={styles.card}>📊 Total Tasks: {summary.totalTasks}</div>
        <div className={styles.card}>✅ Completed: {summary.completedTasks}</div>
        <div className={styles.card}>⏳ Pending: {summary.pendingTasks}</div>
      </div>

      {/* PIE CHART */}
      <div style={{ width: "100%", height: 300, marginTop: "30px" }}>
        <h3 style={{ textAlign: "left", marginBottom: "10px" }}>Task Status Summary</h3>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>

    
  );
}

export default HrDashboardHome;

