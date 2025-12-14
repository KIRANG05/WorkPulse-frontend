import React, { useEffect, useState } from "react";
import api from "../../../Services/api"; // Axios instance
import Swal from "sweetalert2";
import styles from "./HrAddTask.module.css"; // Custom CSS for styling

function HrAddTask() {
  const [employees, setEmployees] = useState([]);
  const [taskData, setTaskData] = useState({
    taskName: "",
    description: "",
    assignedBy: localStorage.getItem("username") || "", // HR name
    assignedTo: "",
    status: "PENDING",
    assignedDate: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
    dueDate: "",
    priority: "",
  });

  // Fetch employee list for dropdown
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await api.get("/employee/reportees");
        if (res.data.isSuccess) {
          setEmployees(res.data.employees);
        }
      } catch (err) {
        Swal.fire("Error", "Failed to fetch employees", "error");
      }
    };
    fetchEmployees();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation
    if (!taskData.taskName || !taskData.assignedTo) {
      Swal.fire("Error", "Task Name and Assigned To are required!", "error");
      return;
    }

    // Helper function to convert YYYY-MM-DD to dd-MM-yyyy
const formatDateDDMMYYYY = (dateStr) => {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

// In handleSubmit
const payload = {
  ...taskData,
  assignedDate: formatDateDDMMYYYY(taskData.assignedDate),
  dueDate: formatDateDDMMYYYY(taskData.dueDate),
  priority: taskData.priority || "LOW",
};

    try {
      const res = await api.post("/tasks/addTask", payload);
      if (res.data.isSuccess) {
        Swal.fire("Success", res.data.message || "Task added successfully!", "success");
        // Reset form
        setTaskData({
          taskName: "",
          description: "",
          assignedBy: localStorage.getItem("username") || "",
          assignedTo: "",
          status: "PENDING",
          assignedDate: new Date().toISOString().slice(0, 10),
          dueDate: "",
          priority: ""
        });
      } else {
        Swal.fire("Error", res.data.message || "Failed to add task", "error");
      }
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Something went wrong!", "error");
    }
  };

  return (
  <div className={styles.container}>
  <h2 className={styles.heading}>Add New Task</h2>
  <form className={styles.form} onSubmit={handleSubmit}>
    
    {/* Row 1: Task Name & Assigned By */}
    <div className={styles.row}>
      <div className={styles.formGroup}>
        <label>Task Name <span className={styles.required}>*</span></label>
        <input
          type="text"
          name="taskName"
          value={taskData.taskName}
          onChange={handleChange}
          placeholder="Enter task name"
          maxLength={100}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label>Assigned By</label>
        <input type="text" value={taskData.assignedBy} disabled />
      </div>
    </div>

    {/* Row 2: Assigned To & Status */}
    <div className={styles.row}>
      <div className={styles.formGroup}>
        <label>Assigned To <span className={styles.required}>*</span></label>
        <select
          name="assignedTo"
          value={taskData.assignedTo}
          onChange={handleChange}
          required
        >
          <option value="">Select Employee</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.username}>
              {emp.name} 
            </option>
          ))}
        </select>
      </div>
      <div className={styles.formGroup}>
        <label>Status</label>
        <select name="status" value={taskData.status} onChange={handleChange}>
          <option value="PENDING">PENDING</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="COMPLETED">COMPLETED</option>
        </select>
      </div>
    </div>

    {/* Row 3: Assigned Date & Due Date */}
    <div className={styles.row}>
      <div className={styles.formGroup}>
        <label>Assigned Date</label>
        <input
          type="date"
          name="assignedDate"
          value={taskData.assignedDate}
          onChange={handleChange}
        />
      </div>
      <div className={styles.formGroup}>
        <label>Due Date</label>
        <input
          type="date"
          name="dueDate"
          value={taskData.dueDate}
          onChange={handleChange}
          min={taskData.assignedDate}
        />
      </div>
    </div>
    <div className={styles.formGroup}>
  <label>Priority</label>
  <select
    name="priority"
    value={taskData.priority}
    onChange={handleChange}
  >
    <option value="LOW">Low</option>
    <option value="MEDIUM">Medium</option>
    <option value="HIGH">High</option>
    
  </select>
</div>


    {/* Row 4: Description full width */}
    <div className={styles.row}>
      <div className={styles.formGroup} style={{ width: "100%" }}>
        <label>Description</label>
        <textarea
          name="description"
          value={taskData.description}
          onChange={handleChange}
          placeholder="Enter task description"
          maxLength={500}
        ></textarea>
      </div>
    </div>

    <div className={styles.buttonGroup}>
      <button type="submit" className={styles.submitBtn}>Save Task</button>
      <button
        type="button"
        className={styles.cancelBtn}
        onClick={() =>
          setTaskData({
            taskName: "",
            description: "",
            assignedBy: localStorage.getItem("name") || "",
            assignedTo: "",
            status: "PENDING",
            assignedDate: new Date().toISOString().slice(0, 10),
            dueDate: "",
          })
        }
      >
        Cancel
      </button>
    </div>
  </form>
</div>

  );
}

export default HrAddTask;

