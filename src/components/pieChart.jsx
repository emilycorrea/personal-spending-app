import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const COLORS = {
  food: "#e07b54",
  travel: "#4a6fa5",
  shopping: "#6a9e7f",
  personal: "#9b72b0",
  entertainment: "#e0a854",
  "bills & utilities": "#5b8db8",
  other: "#a0a8b8",
};

export function SpendingChart({ expenses }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/expenses/summary`)
      .then((res) => res.json())
      .then((rows) => {
        const formatted = rows.map((row) => ({
          name: row.category.charAt(0).toUpperCase() + row.category.slice(1),
          key: row.category,
          value: row.total,
        }));
        setData(formatted);
      })
      .catch((err) => console.error("Error fetching summary:", err));
  }, [expenses]); // re-fetches whenever expenses change in the parent

  if (data.length === 0) return null;

  return (
    <div className="chart-card">
      <h2>Spending by Category</h2>
      <div className="chart-layout">
        <PieChart width={220} height={220}>
          <Pie data={data} cx={110} cy={110} outerRadius={90} dataKey="value">
            {data.map((entry) => (
              <Cell key={entry.key} fill={COLORS[entry.key] || "#a0a8b8"} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
        </PieChart>

        <div className="chart-legend">
          {data.map((entry) => (
            <div key={entry.key} className="legend-item">
              <span
                className="legend-square"
                style={{ backgroundColor: COLORS[entry.key] || "#a0a8b8" }}
              />
              <span className="legend-name">{entry.name}</span>
              <span className="legend-amount">${entry.value.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}