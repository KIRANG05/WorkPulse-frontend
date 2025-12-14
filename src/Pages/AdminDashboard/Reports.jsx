import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import api from "../../Services/api";

function Reports() {
  const [summary, setSummary] = useState({});
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [employeeSummary, setEmployeeSummary] = useState({});

  useEffect(() => {
    fetchTaskSummary();
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (selectedEmployee) fetchEmployeeSummary(selectedEmployee);
  }, [selectedEmployee]);

  const fetchTaskSummary = async () => {
    const res = await api.get("/reports/taskSummary");
    if (res.data.isSuccess) setSummary(res.data);
  };

const fetchEmployees = async () => {
  try {
    const res = await api.get("/tasks/fetchAllTasks");

    if (res.data.isSuccess && res.data.data?.tasks) {
      const tasks = res.data.data.tasks;

      const uniqueEmployees = [
        ...new Set(
          tasks
            .map((task) => task.assignedTo)
            .filter(Boolean) // remove null / undefined
        ),
      ];

      setEmployees(uniqueEmployees);
    }
  } catch (error) {
    console.error("Error fetching employees", error);
  }
};


  const fetchEmployeeSummary = async (employee) => {
 
    const res = await api.get(`/reports/taskSummaryByEmployee?employeeName=${employee}`);
    if (res.data.isSuccess) setEmployeeSummary(res.data);
  };

    const COLORS = ["#4E79A7", "#F28E2B", "#E15759", "#76B7B2"];

  const pieData = [
     { name: "TotalTasks", value: employeeSummary.totalTasks || 0 },
    { name: "Completed", value: employeeSummary.completedTasks || 0 },
    { name: "Pending", value: employeeSummary.pendingTasks || 0 },
    { name: "Overdue", value: employeeSummary.overDueTasks || 0 },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2>📊 Task Summary</h2>
      <div style={summaryGrid}>
        <Card title="Total Tasks" value={summary.totalTasks} />
        <Card title="Completed" value={summary.completedTasks} />
        <Card title="Pending" value={summary.pendingTasks} />
        <Card title="Overdue" value={summary.overDueTasks} />
      </div>

      <hr style={{ margin: "30px 0" }} />

      <h3>👤 Task Summary by Employee</h3>
      <select
        onChange={(e) => setSelectedEmployee(e.target.value)}
        style={{ padding: "8px", marginBottom: "20px" }}
      >
        <option value="">Select Employee</option>
        {employees.map((emp) => (
          <option key={emp} value={emp}>
            {emp}
          </option>
        ))}
      </select>

      {selectedEmployee && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <PieChart width={400} height={300}>
            <Pie
              data={pieData}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      )}
    </div>
  );
}

const summaryGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "20px",
  marginTop: "20px",
};

const Card = ({ title, value }) => (
  <div
    style={{
      background: "#fff",
      padding: "20px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      borderRadius: "12px",
      textAlign: "center",
    }}
  >
    <h3>{title}</h3>
    <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{value}</p>
  </div>
);

export default Reports;
