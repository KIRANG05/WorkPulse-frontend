import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "../AdminDashboard/AdminDashboard.module.css"; // 🔥 reuse same CSS

function EmployeeSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  // submenu handling for Settings
  const isSettingsRoute = location.pathname.startsWith("/hr-dashboard/settings");
  const [showSettings, setShowSettings] = useState(isSettingsRoute);

  const isLeaveRoute = location.pathname.startsWith("/hr-dashboard/leaves");
  const [showLeaves, setShowLeaves] = useState(isLeaveRoute);

//   const isTaskRoute = location.pathname.startsWith("/hr-dashboard/tasks");
//   const [showTasks, setShowTasks] = useState(isTaskRoute);

  return (
    <div className={styles.sidebar}>
      <h2 className={styles.logo}>Employee Portal</h2>
      <ul>
        <li
          className={isActive("/employee-dashboard") ? styles.active : ""}
          onClick={() => navigate("/employee-dashboard")}
        >
          🏠 Dashboard
        </li>

        <li
          className={isActive("/employee-dashboard/todo") ? styles.active : ""}
          onClick={() => navigate("/employee-dashboard/todo")}
        >
          📝 Todo
        </li>

       {/* 📅 Leave MAIN MODULE */}
<li
  onClick={() => setShowLeaves(!showLeaves)}
  className={styles.settingsMenu}
>
  <span>📅 Leave</span>
  <span>{showLeaves ? "▲" : "▼"}</span>
</li>

{/* 🔽 Leave submenu */}
{showLeaves && (
  <ul className={styles.submenu}>
    <li
      className={isActive("/employee-dashboard/leaves/apply") ? styles.active : ""}
      onClick={() => navigate("/employee-dashboard/leaves/apply")}
    >
      📝 Apply Leave
    </li>
    <li
      className={isActive("/employee-dashboard/leaves/summary") ? styles.active : ""}
      onClick={() => navigate("/employee-dashboard/leaves/summary")}
    >
      📊 Leave Summary
    </li>
  </ul>
)}


  
     
            <li
              className={isActive("/employee-dashboard/tasks/details") ? styles.active : ""}
              onClick={() => navigate("/employee-dashboard/tasks/details")}
            >
              📋 Task Details
            </li>
       

        <li
          className={isActive("/employee-dashboard/attendance") ? styles.active : ""}
          onClick={() => navigate("/employee-dashboard/attendance")}
        >
          📋 Attendance
        </li>

        {/* ⚙️ Settings main item */}
        <li
          onClick={() => setShowSettings(!showSettings)}
          className={styles.settingsMenu}
        >
          <span>⚙️ Settings</span>
          <span>{showSettings ? "▲" : "▼"}</span>
        </li>

        {/* 🔽 Settings submenu */}
        {showSettings && (
          <ul className={styles.submenu}>
            <li
              className={isActive("/employee-dashboard/settings/profile") ? styles.active : ""}
              onClick={() => navigate("/employee-dashboard/settings/profile")}
            >
              🧍 Profile
            </li>
            <li
              className={isActive("/employee-dashboard/settings/change-password") ? styles.active : ""}
              onClick={() => navigate("/employee-dashboard/settings/change-password")}
            >
              🔒 Change Password
            </li>
          </ul>
        )}

        <li
          className={isActive("/employee-dashboard/notification") ? styles.active : ""}
          onClick={() => navigate("/employee-dashboard/notification")}
        >
          🔔 Notifications
        </li>
      </ul>
    </div>
  );
}

export default EmployeeSidebar;
