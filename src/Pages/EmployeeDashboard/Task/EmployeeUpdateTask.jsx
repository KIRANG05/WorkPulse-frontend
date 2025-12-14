import React, { useEffect, useState } from "react";
import api from "../../../Services/api";
import Swal from "sweetalert2";
import styles from "./EmployeeUpdateTask.module.css";
import { useParams, useNavigate } from "react-router-dom";

function EmployeeUpdateTask() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [taskData, setTaskData] = useState({
    taskName: "",
    description: "",
    assignedBy: "",
    assignedTo: "",
    status: "",
    assignedDate: "",
    dueDate: "",
    priority: "",
  });

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await api.get(`/tasks/${id}`);
        if (res.data.isSuccess) {
          setTaskData(res.data.data.task);
        } else {
          Swal.fire("Error", res.data.message, "error");
        }
      } catch {
        Swal.fire("Error", "Failed to load task details", "error");
      }
    };
    fetchTask();
  }, [id]);

  const handleChange = (e) => {
    setTaskData((prev) => ({ ...prev, status: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/tasks/update/${id}`, taskData);
        
      

      if (res.data.isSuccess) {
        Swal.fire("Success", res.data.message, "success");
        navigate("/employee-dashboard/tasks/details");
      } else {
        Swal.fire("Error", res.data.message, "error");
      }
    } catch(err) {
      Swal.fire("Error", err.response?.data?.message || "Something went wrong!", "error");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Update Task</h2>

      <form className={styles.form} onSubmit={handleSubmit}>
        
        <div className={styles.formGroup}>
          <label>Task Name</label>
          <input type="text" value={taskData.taskName} disabled />
        </div>

        <div className={styles.formGroup}>
          <label>Assigned By</label>
          <input type="text" value={taskData.assignedBy} disabled />
        </div>

        <div className={styles.row}>
          <div className={styles.formGroup}>
            <label>Assigned Date</label>
            <input type="date" value={taskData.assignedDate?.substring(0, 10)} disabled />
          </div>

          <div className={styles.formGroup}>
            <label>Due Date</label>
            <input type="date" value={taskData.dueDate?.substring(0, 10)} disabled />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Priority</label>
          <input type="text" value={taskData.priority} disabled />
        </div>

        <div className={styles.formGroup}>
          <label>Description</label>
          <textarea value={taskData.description} disabled />
        </div>

        <div className={styles.formGroup}>
          <label>Status *</label>
          <select name="status" value={taskData.status} onChange={handleChange}>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="ON_HOLD">On Hold</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.submitBtn}>Update</button>
          <button type="button" className={styles.cancelBtn} onClick={() => navigate("/employee-dashboard/tasks/details")}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EmployeeUpdateTask;
