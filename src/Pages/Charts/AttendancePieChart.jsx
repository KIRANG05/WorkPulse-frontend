import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#4CAF50", "#FF9800", "#F44336"];

function AttendancePieChart({ present, onLeave, absent }) {
  const data = [
    { name: "Present", value: present || 0 },
    { name: "On Leave", value: onLeave || 0 },
    { name: "Absent", value: absent || 0 },
  ];

  return (
    <>
      <h3 style={{ textAlign: "center" }}>Today's Attendance</h3>

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

export default AttendancePieChart;
