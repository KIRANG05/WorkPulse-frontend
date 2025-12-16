import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#FF5722", "#FFC107"];

function LeaveStatusPieChart({ pendingLeaves, approvedLeaves }) {
  const data = [
    { name: "Pending Leaves", value: pendingLeaves || 0 },
    { name: "Approved Leaves", value: approvedLeaves || 0 },
  ];

  return (
    <>
      <h3 style={{ textAlign: "center" }}>Leave Status</h3>

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

export default LeaveStatusPieChart;
