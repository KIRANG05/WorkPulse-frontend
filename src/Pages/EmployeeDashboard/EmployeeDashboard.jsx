import React from "react";
import { Outlet } from "react-router-dom";

import EmployeeSidebar from "../../Pages/EmployeeDashboard/EmployeeSidebar";
import styles from "../AdminDashboard/AdminDashboard.module.css"; // reuse CSS

function EmployeeDashboard() {
  return (
    <div className={styles.container}>
      <EmployeeSidebar />
      <div className={styles.main}>
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default EmployeeDashboard;