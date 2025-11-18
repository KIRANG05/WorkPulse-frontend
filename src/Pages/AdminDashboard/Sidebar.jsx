import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./AdminDashboard.module.css";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ detect if current page is inside /settings/*
  const isSettingsRoute = location.pathname.startsWith("/admin-dashboard/settings");

  // ✅ control expand/collapse of Settings menu
  const [showSettingsSubmenu, setShowSettingsSubmenu] = useState(isSettingsRoute);

  // ✅ automatically open settings submenu when user is inside any settings page
  useEffect(() => {
    setShowSettingsSubmenu(isSettingsRoute);
  }, [isSettingsRoute]);

  // ✅ helper to highlight active links
  const isActive = (path) => location.pathname === path;

  return (
    <div className={styles.sidebar}>
      <h2 className={styles.logo}>Admin Portal</h2>
      <ul>
        <li
          className={isActive("/admin-dashboard") ? styles.active : ""}
          onClick={() => navigate("/admin-dashboard")}
        >
          🏠 Dashboard
        </li>

        <li
          className={isActive("/admin-dashboard/employees") ? styles.active : ""}
          onClick={() => navigate("/admin-dashboard/employees")}
        >
          👨‍💼 Employees
        </li>

        <li
          className={isActive("/admin-dashboard/tasks") ? styles.active : ""}
          onClick={() => navigate("/admin-dashboard/tasks")}
        >
          📝 Tasks
        </li>

        <li
          className={isActive("/admin-dashboard/reports") ? styles.active : ""}
          onClick={() => navigate("/admin-dashboard/reports")}
        >
          📊 Reports
        </li>

        <li
  className={isActive("/admin-dashboard/leaves") ? styles.active : ""}
  onClick={() => navigate("/admin-dashboard/leaves")}
>
  📅 Leaves
</li>


        {/* ⚙️ SETTINGS MAIN ITEM */}
        <li
          onClick={() => setShowSettingsSubmenu(!showSettingsSubmenu)}
          className={styles.settingsMenu}
        >
          <span>⚙️ Settings</span>
          <span>{showSettingsSubmenu ? "▲" : "▼"}</span>
        </li>

        {/* 🔽 SETTINGS SUBMENU (visible only when expanded) */}
        {showSettingsSubmenu && (
          <ul className={styles.submenu}>
            <li
              className={isActive("/admin-dashboard/settings/profile") ? styles.active : ""}
              onClick={() => navigate("/admin-dashboard/settings/profile")}
            >
              🧍 Profile
            </li>
            <li
              className={isActive("/admin-dashboard/settings/role") ? styles.active : ""}
              onClick={() => navigate("/admin-dashboard/settings/role")}
            >
              🧑‍💼 Role Management
            </li>
            <li
              className={isActive("/admin-dashboard/settings/change-password") ? styles.active : ""}
              onClick={() => navigate("/admin-dashboard/settings/change-password")}
            >
              🔒 Change Password
            </li>
          </ul>
        )}
      </ul>
    </div>
  );
}

export default Sidebar;
