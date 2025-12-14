import React, { useEffect, useState } from "react";
import api from "../../../Services/api";
import Swal from "sweetalert2";
import styles from "./HrAddTask.module.css";
import { useParams, useNavigate } from "react-router-dom";

function HrUpdateTask() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);

  const [taskData, setTaskData] = useState({
    taskName: "",
    description: "",
    assignedBy: localStorage.getItem("username") || "",
    assignedTo: "",
    status: "PENDING",
    assignedDate: "",
    dueDate: "",
    priority: "LOW",
  });

  // Fetch Task by ID when page opens
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await api.get(`/tasks/${id}`);
        if (res.data.isSuccess) {
          setTaskData(res.data.data.task);
        } else {
          Swal.fire("Error", res.data.message, "error");
        }
      } catch (err) {
        Swal.fire("Error", "Failed to fetch task details", "error");
      }
    };
    fetchTask();
  }, [id]);

  // Fetch employee list
 useEffect(() => {
  const fetchEmployees = async () => {
    try {
      const res = await api.get("/employee/employeeDetails");
      if (res.data.isSuccess) {
        setEmployees(res.data.employees);
      }
    } catch (err) {
      Swal.fire("Error", "Failed to fetch employees", "error");
    }
  };

  fetchEmployees();
}, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!taskData.taskName || !taskData.assignedTo) {
      Swal.fire("Error", "Task Name & Assigned To are mandatory!", "error");
      return;
    }

    try {
      const res = await api.put(`/tasks/update/${id}`, taskData);
      if (res.data.isSuccess) {
        Swal.fire("Success", res.data.message, "success");
         navigate("/hr-dashboard/tasks/details")
         // go back to task list
      } else {
        Swal.fire("Error", res.data.message, "error");
       
      }
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Something went wrong!", "error");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Update Task</h2>

      <form className={styles.form} onSubmit={handleSubmit}>
        {/* Row 1 */}
        <div className={styles.row}>
          <div className={styles.formGroup}>
            <label>Task Name *</label>
            <input
              type="text"
              name="taskName"
              value={taskData.taskName}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Assigned By</label>
            <input type="text" value={taskData.assignedBy} disabled />
          </div>
        </div>

        {/* Row 2 */}
        <div className={styles.row}>
          <div className={styles.formGroup}>
            <label>Assigned To *</label>
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
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="ON_HOLD">On Hold</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>

        {/* Row 3 */}
        <div className={styles.row}>
          <div className={styles.formGroup}>
            <label>Assigned Date</label>
            <input type="date" name="assignedDate" value={taskData.assignedDate} onChange={handleChange} />
          </div>
          <div className={styles.formGroup}>
            <label>Due Date</label>
            <input type="date" name="dueDate" value={taskData.dueDate} onChange={handleChange} />
          </div>
        </div>

        {/* Priority */}
        <div className={styles.formGroup}>
          <label>Priority</label>
          <select name="priority" value={taskData.priority} onChange={handleChange}>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>

        {/* Description */}
        <div className={styles.formGroup}>
          <label>Description</label>
          <textarea name="description" value={taskData.description} onChange={handleChange}></textarea>
        </div>

        {/* Buttons */}
        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.submitBtn}>Update Task</button>
          <button type="button" className={styles.cancelBtn} onClick={() => navigate("/hr-dashboard/tasks/details")}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default HrUpdateTask;
