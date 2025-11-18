import React, { useEffect, useState } from "react";
import api from "../../Services/api";
import styles from "./AdminLeaves.module.css";

function LeaveList() {
  const [leaveList, setLeaveList] = useState([]);

  useEffect(() => {
    fetchAllLeaves();
  }, []);

  // 🔹 Fetch All Leaves
  const fetchAllLeaves = async () => {
    try {
      const response = await api.get("/leaves/allLeaves");
      setLeaveList(response.data.data || []);  // your GenericResponse.data
    } catch (err) {
      console.error("Error fetching leaves", err);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "PENDING":
        return styles["status-pending"];
      case "APPROVED":
        return styles["status-approved"];
      case "REJECTED":
        return styles["status-rejected"];
      default:
        return "";
    }
  };

  return (
    <div className={styles.leaveList}>
      <div className={styles.header}>
        <h2>Leave Requests</h2>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Emp ID</th>
            <th>Employee Name</th>
            <th>From</th>
            <th>To</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Applied On</th>
          </tr>
        </thead>

        <tbody>
          {leaveList.length > 0 ? (
            leaveList.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.employeeName}</td>
                <td>{item.fromDate}</td>
                <td>{item.toDate}</td>
                <td>{item.reason}</td>
                <td>
                  <span className={getStatusClass(item.leaveStatus)}>
                    {item.leaveStatus}
                  </span>
                </td>
                <td>{item.appliedAt?.split("T")[0]}</td>

              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>
                No leave requests found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default LeaveList;
