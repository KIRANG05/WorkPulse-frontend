import React, { useEffect, useState } from "react";
import api from "../../../Services/api";
import styles from "./EmployeeTaskDetails.module.css";
import DatePicker from "react-datepicker";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";

function EmployeeTaskDetails() {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();
  const loggedEmployee = localStorage.getItem("username");

  const [filters, setFilters] = useState({
    fromDate: null,
    toDate: null,
    assignedBy: "",
    status: ""
  });

  const [hrList, setHrList] = useState([]);

  useEffect(() => {
    fetchHrList();
    fetchFilteredTasks({ assignedTo: loggedEmployee });
  }, []);

  const fetchHrList = async () => {
    try {
      const res = await api.get("/users/hrList"); // HR list API
      if (res.data.isSuccess) setHrList(res.data.usernames);
    } catch {
      Swal.fire("Error", "Failed to load HR list", "error");
    }
  };

  const fetchFilteredTasks = async (queryParams = {}) => {
    try {
      const response = await api.get("/tasks/filter", { params: queryParams });
      setTasks(response.data.data.tasks || []);
    } catch {
      Swal.fire("Error", "Failed to fetch tasks", "error");
    }
  };

  const formatDate = (date) => {
    const d = String(date.getDate()).padStart(2, "0");
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const y = date.getFullYear();
    return `${y}-${m}-${d}`;
  };

  const handleFilter = () => {
    const params = { assignedTo: loggedEmployee };

    if (filters.fromDate) params.fromDateStr = formatDate(filters.fromDate);
    if (filters.toDate) params.toDateStr = formatDate(filters.toDate);
    if (filters.assignedBy) params.assignedBy = filters.assignedBy;
    if (filters.status) params.status = filters.status;

    fetchFilteredTasks(params);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "PENDING": return "status-pending";
      case "IN_PROGRESS": return "status-inprogress";
      case "ON_HOLD": return "status-hold";
      case "COMPLETED": return "status-completed";
      default: return "";
    }
  };

  return (
    <div className={styles.taskList}>
      <div className={styles.header}>
        <h2>Task Details</h2>

        <div className={styles.filters}>

          {/* Assigned Date */}
          <div className={styles.dateContainer}>
            <label className={styles.dateLabel}>Assigned Date</label>
            <DatePicker
              selected={filters.fromDate}
              onChange={(date) => setFilters({ ...filters, fromDate: date })}
              dateFormat="dd-MM-yyyy"
              placeholderText="Select Date"
            />
          </div>

          {/* Due Date */}
          <div className={styles.dateContainer}>
            <label className={styles.dateLabel}>Due Date</label>
            <DatePicker
              selected={filters.toDate}
              onChange={(date) => setFilters({ ...filters, toDate: date })}
              dateFormat="dd-MM-yyyy"
              placeholderText="Select Date"
            />
          </div>

          {/* Assigned By (HR List) */}
          <div className={styles.assignedByContainer}>
            <label className={styles.dropdownLabel}>Assigned By</label>
         <select
  value={filters.assignedBy}
  onChange={(e) => setFilters({ ...filters, assignedBy: e.target.value })}
>
  <option value="">Select HR</option>
  {hrList.map((hr) => (
    <option key={hr} value={hr}>{hr}</option>
  ))}
</select>


          </div>

          {/* Status */}
          <div className={styles.dropdownContainer}>
            <label className={styles.dropdownLabel}>Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="">All</option>
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="ON_HOLD">On Hold</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          <button className={styles.filterBtn} onClick={handleFilter}>Go</button>
        </div>
      </div>

      <div className={styles.legend}>
  <span><div className={styles.dotPending}></div> Pending</span>
  <span><div className={styles.dotProgress}></div> In Progress</span>
  <span><div className={styles.dotHold}></div> On Hold</span>
  <span><div className={styles.dotCompleted}></div> Completed</span>
</div>


      {/* Task Table */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Task Id</th>
            <th>Task Name</th>
            <th>Description</th>
            <th>Assigned By</th>
            <th>Assigned Date</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <tr key={task.id} className={styles[getStatusClass(task.status)]}>
                <td>{task.id}</td>
                <td>{task.taskName}</td>
                <td>{task.description}</td>
                <td>{task.assignedBy}</td>
                <td>{task.assignedDate}</td>
                <td>{task.dueDate}</td>
                <td>{task.status}</td>
                <td>
                  <span
                    className={styles.iconEdit}
                    onClick={() => navigate(`/employee-dashboard/update-task/${task.id}`)}
                    title="Update Task"
                  >
                    ✏️
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="8" style={{ textAlign: "center" }}>No tasks found</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeTaskDetails;
