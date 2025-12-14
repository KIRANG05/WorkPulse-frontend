import React, { useState } from "react";
import api from "../../../Services/api";
import styles from "./EmployeeApplyLeave.module.css";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function EmployeeApplyLeave() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [leaveType, setLeaveType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({
  leaveType: "",
  fromDate: "",
  toDate: "",
  reason: "",
});

const validateForm = () => {
  let tempErrors = {};
  let isValid = true;

  if (!leaveType) {
    tempErrors.leaveType = "Leave type is required";
    isValid = false;
  }

  if (!fromDate) {
    tempErrors.fromDate = "From date is required";
    isValid = false;
  }

  if (!toDate) {
    tempErrors.toDate = "To date is required";
    isValid = false;
  }

  if (!reason) {
    tempErrors.reason = "Reason is required";
    isValid = false;
  }

  if (fromDate && toDate && new Date(toDate) < new Date(fromDate)) {
    tempErrors.toDate = "To Date cannot be earlier than From Date";
    isValid = false;
  }

  setErrors(tempErrors);
  return isValid;
};

const handleCancel = () => {
    setLeaveType("");
    setFromDate("");
    setToDate("");
    setReason("");
    
  };

const handleApply = async () => {
    if (!validateForm()) return;
  const leaveData = {
    leaveType,
    fromDate,
    toDate,
    reason,
  };

  try {
    const res = await api.post(`/leaves/apply/${userId}`, leaveData);

    if (res.data.isSuccess) {
      Swal.fire({
        icon: "success",
        title: "Success",
        text: res.data.message,
        timer: 2000,
      });

      // clear form after success
      setLeaveType("");
      setFromDate("");
      setToDate("");
      setReason("");
    } else {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: res.data.message,
      });
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Server Error",
      text: "Something went wrong. Please try again.",
    });
  }
};


  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Applying for Leave</h2>

      <div className={styles.row}>
        <div className={styles.inputGroup}>
          <label>Leave Type *</label>
          <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
            <option value="">Select type</option>
            <option value="EARNED">Earned Leave (EL)</option>
            <option value="CASUAL">Casual Leave (CL)</option>
            <option value="SICK">Sick Leave (SL)</option>
          </select>
           {errors.leaveType && <span className={styles.error}>{errors.leaveType}</span>}
        </div>
       
      </div>

      <div className={styles.row}>
        <div className={styles.inputGroup}>
          <label>From Date *</label>
          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          {errors.fromDate && <span className={styles.error}>{errors.fromDate}</span>}
        </div>
        <div className={styles.inputGroup}>
          <label>To Date *</label>
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          {errors.toDate && <span className={styles.error}>{errors.toDate}</span>}
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.inputGroupFull}>
          <label>Reason *</label>
          <textarea
            rows="4"
            placeholder="Enter a reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          ></textarea>
          {errors.reason && <span className={styles.error}>{errors.reason}</span>}
        </div>
         
      </div>

      

      <div className={styles.buttonRow}>
        <button className={styles.cancelBtn} onClick={handleCancel}>
          Cancel
        </button>
        <button className={styles.applyBtn} onClick={handleApply}>
          Apply
        </button>
      </div>
    </div>
  );
}

export default EmployeeApplyLeave;
