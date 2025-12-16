// import React, { useEffect, useState } from "react";
// import api from "../../Services/api";
// import styles from "./HrReportees.module.css";
// import Swal from "sweetalert2";

// function HrReportees() {
//   const [employees, setEmployees] = useState([]);
//   const [attendance, setAttendance] = useState({}); // store attendance of each emp

//   const imageBaseUrl = "http://localhost:8081/images/";

//   useEffect(() => {
//     fetchEmployees();
//   }, []);

//   const fetchEmployees = async () => {
//     try {
//       const response = await api.get("/employee/employeeDetails");
//       const list = response.data.employees || [];
//       setEmployees(list);

//       // fetch today's attendance for each employee
//       list.forEach((emp) => fetchTodayAttendance(emp.id));
//     } catch (err) {
//       console.error("Error fetching employees", err);
//     }
//   };

//   const fetchTodayAttendance = async (empId) => {
//     try {
//       const res = await api.get(`/attendence/today/${empId}`);
//       setAttendance((prev) => ({
//         ...prev,
//         [empId]: res.data.data, // null = absent
//       }));
//     } catch (err) {
//       setAttendance((prev) => ({
//         ...prev,
//         [empId]: null, // error also treat as absent
//       }));
//     }
//   };

//   return (
//     <div className={styles.employeeList}>
//       <div className={styles.header}>
//         <h2>Reportees (Attendance Today)</h2>
//       </div>

//       <table className={styles.table}>
//         <thead>
//           <tr>
//             <th>Emp Id</th>
//             <th>Profile Image</th>
//             <th>Name</th>
//             <th>Company</th>
//             <th>Salary</th>
//             <th>Today Attendance</th>
//           </tr>
//         </thead>
//         <tbody>
//           {employees.length > 0 ? (
//             employees.map((emp) => (
//               <tr key={emp.id}>
//                 <td>{emp.id}</td>
//                 <td>
//                   <img
//                     src={
//                       emp.profileImage
//                         ? `${imageBaseUrl}${emp.profileImage}`
//                         : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
//                     }
//                     alt={emp.name}
//                     className={styles.profileImage}
//                   />
//                 </td>

//                 <td>{emp.name}</td>
//                 <td>{emp.company}</td>
//                 <td>{emp.salary}</td>

//                 {/* Attendance Column */}
//                 <td>
//                   {attendance[emp.id] ? (
//                     <button
//                       style={{
//                         backgroundColor: "green",
//                         color: "white",
//                         padding: "6px 10px",
//                         border: "none",
//                         borderRadius: "5px",
//                         fontWeight: "bold",
//                         cursor: "default",
//                       }}
//                     >
//                       Present
//                     </button>
//                   ) : (
//                     <button
//                       style={{
//                         backgroundColor: "red",
//                         color: "white",
//                         padding: "6px 12px",
//                         border: "none",
//                         borderRadius: "5px",
//                         fontWeight: "bold",
//                         cursor: "default",
//                       }}
//                     >
//                       Absent
//                     </button>
//                   )}
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="6" style={{ textAlign: "center" }}>
//                 No employees found
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default HrReportees;



import React, { useEffect, useState } from "react";
import api from "../../Services/api";
import styles from "./HrReportees.module.css";

function HrReportees() {
  const [employees, setEmployees] = useState([]);
  const [attendanceMap, setAttendanceMap] = useState({}); // empId -> attendance

  const imageBaseUrl = "http://localhost:8081/images/";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // 1️⃣ Fetch all employee details
      const empRes = await api.get("/employee/reportees");
      const empList = empRes.data.employees || [];
      setEmployees(empList);

      // 2️⃣ Fetch all attendance at once
      const attRes = await api.get("/attendence/today/all");
      if (attRes.data.isSuccess) {
        const attMap = {};
        attRes.data.data.forEach((att) => {
          attMap[att.userId] = att; // Map by empId
        });
        setAttendanceMap(attMap);
      }
    } catch (err) {
      console.error("Error fetching reportees and attendance", err);
    }
  };

  return (
    <div className={styles.employeeList}>
      <div className={styles.header}>
        <h2>Reportees</h2>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Emp Id</th>
            <th>Profile Image</th>
            <th>Name</th>
            <th>Company</th>
            <th>Salary</th>
            <th>Today Attendance</th>
          </tr>
        </thead>
        <tbody>
          {employees.length > 0 ? (
            employees.map((emp) => {
              const att = attendanceMap[emp.userId]; // get attendance for this emp
              return (
                <tr key={emp.id}>
                  <td>{emp.id}</td>
                  <td>
                    <img
                      src={
                        emp.profileImage
                          ? `${imageBaseUrl}${emp.profileImage}`
                          : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                      }
                      alt={emp.name}
                      className={styles.profileImage}
                    />
                  </td>
                  <td>{emp.name}</td>
                  <td>{emp.company}</td>
                  <td>{emp.salary}</td>
                  <td>
                    <button
                      style={{
                        backgroundColor: att?.status === "P" ? "green" : "red",
                        color: "white",
                        padding: "6px 10px",
                        border: "none",
                        borderRadius: "5px",
                        fontWeight: "bold",
                        cursor: "default",
                      }}
                    >
                      {att?.status === "P" ? "Present" : "Absent"}
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No employees found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default HrReportees;

