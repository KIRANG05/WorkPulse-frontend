import { Link, NavLink } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import styles from "./Navbar.module.css";
import Logout from "../../Pages/Logout/Logout";
import { useAuth } from "../../Context/AuthContext.jsx";
import { useNotifications } from "../../Context/NotificationContext.jsx";
import React, { useEffect, useState } from "react";
import api from "../../Services/api";

import { FaBell } from "react-icons/fa";



function Navbar() {
const { notifications, setNotifications, markAllAsRead, updateCounter } = useNotifications();

const [showDropdown, setShowDropdown] = useState(false);



const [unreadCount, setUnreadCount] = useState(0);

useEffect(() => {
  setUnreadCount(notifications.filter(n => !n.read).length);
}, [notifications]);






  const { isLoggedIn } = useAuth();
  const role = localStorage.getItem("role");


  

const handleBellClick = async () => {
  const newState = !showDropdown;
  setShowDropdown(newState);

  if (!newState) return; // dropdown closed

  const unreadNotifications = notifications.filter(n => !n.read);

  for (let n of unreadNotifications) {
    try {
      await api.put(`/notification/read`, null, { params: { notificationId: n.id } });
    } catch (err) {
      console.error("Mark read failed", err);
    }
  }

  setNotifications(prev => prev.map(n => ({ ...n, read: true })));
};




const handleSingleNotificationClick = async (id) => {
  await api.put(`/notification/read?notificationId=${id}`);

  setNotifications(prev =>
    prev.map(n => n.id === id ? { ...n, read: true } : n)
  );
};







  return (
    <nav className={styles.navbar}>
      {/* Left Logo */}
      <div className={styles.logo}>
        <FaHome className={styles.icon} />
        <span>EMS</span>
      </div>

      {/* Center Links */}
      <div className={styles.links}>
        {!isLoggedIn ? (
          <>
            <NavLink to="/" className={({ isActive }) => (isActive ? styles.active : styles.link)}>Home</NavLink>
            <NavLink to="/about" className={({ isActive }) => (isActive ? styles.active : styles.link)}>About</NavLink>
            <NavLink to="/services" className={({ isActive }) => (isActive ? styles.active : styles.link)}>Services</NavLink>
            <NavLink to="/contact" className={({ isActive }) => (isActive ? styles.active : styles.link)}>Contact</NavLink>
          </>
        ) : (
          <>
            {role === "ADMIN" && (
              <NavLink to="/admin/dashboard" className={({ isActive }) => (isActive ? styles.active : styles.link)}>Admin Dashboard</NavLink>
            )}
            {role === "HR" && (
              <NavLink to="/hr/dashboard" className={({ isActive }) => (isActive ? styles.active : styles.link)}>HR Dashboard</NavLink>
            )}
            {role === "EMPLOYEE" && (
              <NavLink to="/employee/dashboard" className={({ isActive }) => (isActive ? styles.active : styles.link)}>Employee Dashboard</NavLink>
            )}
          </>
        )}
      </div>

      {/* Right Side Buttons */}
      <div className={styles.authButtons}>
        {!isLoggedIn ? (
          <>
            <Link to="/login" className={styles.login}>Login</Link>
            <Link to="/register" className={styles.register}>Register</Link>
          </>
        ) : (
          <>
    {/* Bell Icon */}
    <div className={styles.notificationWrapper}>
      <FaBell className={styles.bell} onClick={handleBellClick} />
      {unreadCount > 0 && <span className={styles.badge}></span>}




       {showDropdown && (
                <div className={styles.dropdown}>
                  {notifications.length === 0 ? (
                    <p className={styles.noNotification}>No notifications</p>
                  ) : (
                    notifications
  .slice(0, 5)
  .map((n, index) => (
    <div
      key={index}
      className={`${styles.notificationItem} ${!n.read ? styles.unread : ""}`}
onClick={() => handleSingleNotificationClick(n.id)}

    >
      <strong>{index + 1}. {n.message}</strong>
      <small style={{ color: "#888", fontSize: "0.8rem" }}>
        {/* {new Date(n.createdAt).toLocaleString("en-IN")} */}
        {n.createdAt}

      </small>
    </div>
  ))

                  )}
                </div>
              )}
            </div>

    <Logout />
  </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
