// import React, { useEffect, useState } from "react";
// import styles from "./AdminDashboard.module.css";
// import DashboardPieChart from "./DashboardPieChart";
// import EmployeePieChart from "../Charts/EmployeePieChart";
// import SalaryBarChart from "../Charts/SalaryBarChart";
// import EmployeeGrowthChart from "../Charts/EmployeeGrowthChart";
// import api from "../../Services/api";
// import Swal from "sweetalert2";
// import EmployeeRolePieChart from "../Charts/EmployeeRolePieChart";
// import AttendancePieChart from "../Charts/AttendancePieChart";
// import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
// function DashboardHome() {

//   const [summary, setSummary] = useState(null);
// const [loading, setLoading] = useState(true);


//     const employees = [
//     { name: "John", salary: 25000, company: "Google" },
//     { name: "Anna", salary: 45000, company: "Amazon" },
//     { name: "Mike", salary: 60000, company: "Microsoft" },
//     { name: "Sara", salary: 15000, company: "Google" },
//   ];
//   const [todayAttendance, setTodayAttendance] = useState(null);

// useEffect(() => {
//   api.get("/attendence/today")
//     .then(res => setTodayAttendance(res.data.data))
//     .catch(() => setTodayAttendance(null));
// }, []);

// useEffect(() => {
//   api.get("/admin/dashboard/summary")
//     .then(res => {
//       setSummary(res.data.data);
//       setLoading(false);
//     })
//     .catch(() => {
//       Swal.fire({
//         icon: "error",
//         title: "Failed to load dashboard summary"
//       });
//       setLoading(false);
//     });
// }, []);



// const handlePunchIn = async () => {
//   try {
//     const res = await api.post("/attendence/punch-in");

//     Swal.fire({
//       icon: res.data.isSuccess ? "success" : "info",
//       title: res.data.message,
//       text:"You have successfully punched in!",   // backend message
//       timer: 2000,
//       // showConfirmButton: false,
//     });

//     if (res.data.isSuccess) {
//       setTodayAttendance(res.data.data);
//     }

//   } catch (error) {
//     Swal.fire({
//       icon: "error",
//       title: "Something went wrong!",
//     });
//   }
// };


// const handlePunchOut = async () => {
//   try {
//     const res = await api.post("/attendence/punch-out");

//     Swal.fire({
//       icon: res.data.isSuccess ? "success" : "info",
//       title: res.data.message,
//       text:"You have been Punched out successfully!" , // backend message
//       timer: 2000,
//       // showConfirmButton: false,
//     });

//     if (res.data.isSuccess) {
//       setTodayAttendance(res.data.data);
//     }

//   } catch (error) {
//     Swal.fire({
//       icon: "error",
//       title: "Something went wrong!",
//     });
//   }
// };



//   return (
//     <div className={styles.dashboardHome}>
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//   <h2>Dashboard Overview</h2>

//   {/* Punch Button */}
//   {!todayAttendance?.loginTime ? (
//     <button
//       style={{
//         backgroundColor: "green",
//         color: "white",
//         padding: "10px 18px",
//         border: "none",
//         borderRadius: "6px",
//         cursor: "pointer",
//         fontSize: "16px"
//       }}
//       onClick={handlePunchIn}
//     >
//       Punch In
//     </button>
//   ) : !todayAttendance?.logoutTime ? (
//     <button
//       style={{
//         backgroundColor: "red",
//         color: "white",
//         padding: "10px 18px",
//         border: "none",
//         borderRadius: "6px",
//         cursor: "pointer",
//         fontSize: "16px"
//       }}
//       onClick={handlePunchOut}
//     >
//       Punch Out
//     </button>
//   ) : (
//     <span style={{ fontWeight: "bold", color: "green", fontSize: "16px" }}>
//       ✔ Attendance Completed Today
//     </span>
//   )}
// </div>

//       {loading ? (
//   <p>Loading dashboard summary...</p>
// ) : (
//   <div className={styles.cards}>
//     <div className={styles.card}>
//       👥 <b>Total Employees</b>
//       <p>{summary?.totalEmployees}</p>
//     </div>

//     <div className={styles.card}>
//       🧑‍💼 <b>HR Users</b>
//       <p>{summary?.totalHRs}</p>
//     </div>

//     <div className={styles.card}>
//       🟢 <b>Present Today</b>
//       <p>{summary?.presentToday}</p>
//     </div>

//     <div className={styles.card}>
//       🌴 <b>On Leave Today</b>
//       <p>{summary?.onLeaveToday}</p>
//     </div>

//     <div className={styles.card}>
//       📋 <b>Active Tasks</b>
//       <p>{summary?.activeTasks}</p>
//     </div>

//     <div className={styles.card}>
//       ⏳ <b>Pending Leaves</b>
//       <p>{summary?.pendingLeaves}</p>
//     </div>
//   </div>
// )}

//        <div className={styles.chartsRow}>
//   <div className={styles.chartBox}>
//     <EmployeePieChart employees={employees} />
//   </div>
//   <div className={styles.chartBox}>
//     <SalaryBarChart employees={employees} />
//   </div>
// </div>

//       {/* growth line chart */}
//       <EmployeeGrowthChart />
//     </div>
//   );
// }

// export default DashboardHome;


import React, { useEffect, useState } from "react";
import styles from "./AdminDashboard.module.css";
import api from "../../Services/api";
import Swal from "sweetalert2";

// Charts
import EmployeeRolePieChart from "../Charts/EmployeeRolePieChart";
import AttendancePieChart from "../Charts/AttendancePieChart";
import LeaveStatusPieChart from "../Charts/LeaveStatusPieChart";
import EmployeeGrowthChart from "../Charts/EmployeeGrowthChart";

function DashboardHome() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [todayAttendance, setTodayAttendance] = useState(null);

  // Fetch today attendance (Punch in/out)
  useEffect(() => {
    api.get("/attendence/today")
      .then(res => setTodayAttendance(res.data.data))
      .catch(() => setTodayAttendance(null));
  }, []);

  // Fetch admin dashboard summary
  useEffect(() => {
    api.get("/admin/dashboard/summary")
      .then(res => {
        setSummary(res.data.data);
        setLoading(false);
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "Failed to load dashboard summary"
        });
        setLoading(false);
      });
  }, []);

  const handlePunchIn = async () => {
    try {
      const res = await api.post("/attendence/punch-in");
      Swal.fire({
        icon: "success",
        title: res.data.message,
        text:"You have successfully punched in!", 
        timer: 2000
      });
      setTodayAttendance(res.data.data);
    } catch {
      Swal.fire({ icon: "error", title: "Punch in failed" });
    }
  };

  const handlePunchOut = async () => {
    try {
      const res = await api.post("/attendence/punch-out");
      Swal.fire({
        icon: "success",
        title: res.data.message,
        text:"You have been Punched out successfully!",
        timer: 2000
      });
      setTodayAttendance(res.data.data);
    } catch {
      Swal.fire({ icon: "error", title: "Punch out failed" });
    }
  };

  return (
    <div className={styles.dashboardHome}>

      {/* Header + Punch */}
      <div className={styles.headerRow}>
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
        fontSize: "16px"
      }}  
          onClick={handlePunchIn}>
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
          onClick={handlePunchOut}>
            Punch Out
          </button>
        ) : (
          <span style={{ fontWeight: "bold", color: "green", fontSize: "16px" }}>
      ✔ Attendance Completed Today
   </span>
        )}
      </div>

      {/* Cards */}
      {loading ? (
        <p>Loading dashboard...</p>
      ) : (
        <div className={styles.cards}>
          <div className={styles.card}>
            👥 <b>Total Employees</b>
            <p>{summary?.totalEmployees}</p>
          </div>

          <div className={styles.card}>
            🧑‍💼 <b>HR Users</b>
            <p>{summary?.totalHRs}</p>
          </div>

          <div className={styles.card}>
            🟢 <b>Present Today</b>
            <p>{summary?.presentToday}</p>
          </div>

          <div className={styles.card}>
            🌴 <b>On Leave Today</b>
            <p>{summary?.onLeaveToday}</p>
          </div>

          <div className={styles.card}>
            📋 <b>Active Tasks</b>
            <p>{summary?.activeTasks}</p>
          </div>

          <div className={styles.card}>
            ⏳ <b>Pending Leaves</b>
            <p>{summary?.pendingLeaves}</p>
          </div>
        </div>
      )}

      {/* Pie Charts */}
      {!loading && (
        <div className={styles.chartsRow}>

          <div className={styles.chartBox}>
            <EmployeeRolePieChart
              adminCount={summary?.roleCounts?.ROLE_ADMIN || 0}
              hrCount={summary?.roleCounts?.ROLE_HR || 0}
              employeeCount={summary?.roleCounts?.ROLE_EMPLOYEE || 0}
            />
          </div>

          <div className={styles.chartBox}>
            <AttendancePieChart
              present={summary?.presentToday}
              onLeave={summary?.onLeaveToday}
              absent={
                summary?.totalEmployees -
                (summary?.presentToday + summary?.onLeaveToday)
              }
            />
          </div>

          <div className={styles.chartBox}>
            <LeaveStatusPieChart
              pendingLeaves={summary?.pendingLeaves}
              approvedLeaves={summary?.approvedLeaves || 0}
            />
          </div>
        </div>

        
        
      )}
      <div className={styles.growthChartBox}>
        <EmployeeGrowthChart totalEmployees={summary?.totalEmployees} />
      </div>

    </div>
  );
}

export default DashboardHome;

    