import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const COLORS = ["#673AB7", "#03A9F4", "#4CAF50"];

function EmployeeRolePieChart({ adminCount, hrCount, employeeCount }) {
  const data = [
    { name: "Admin", value: adminCount || 0 },
    { name: "HR", value: hrCount || 0 },
    { name: "Employee", value: employeeCount || 0 }
  ];

  return (
    <>
      <h3 style={{ textAlign: "center" }}>Employee Role Distribution</h3>

      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            label
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </>
  );
}

export default EmployeeRolePieChart;
