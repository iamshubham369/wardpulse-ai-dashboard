import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell
} from "recharts";

const COLORS = ["#ff4d4f", "#faad14", "#52c41a"];

function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/api/complaints/dashboard")
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!stats) return <div style={{ padding: "40px" }}>Loading...</div>;

  const priorityData = [
    { name: "High", value: stats.highPriority },
    { name: "Medium", value: stats.mediumPriority },
    { name: "Low", value: stats.lowPriority }
  ];

  const categoryData = Object.entries(stats.categoryCounts).map(([key, value]) => ({
    name: key,
    value: value
  }));

  const cardStyle = {
    background: "#ffffff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    textAlign: "center"
  };

  const thStyle = {
    padding: "14px",
    textAlign: "left"
  };

  const tdStyle = {
    padding: "14px",
    borderBottom: "1px solid #eee"
  };

  return (
    <div style={{
      padding: "40px",
      background: "#f5f7fa",
      minHeight: "100vh",
      fontFamily: "Arial, sans-serif"
    }}>

      <h1 style={{ marginBottom: "30px" }}>WardPulse Analytics Dashboard</h1>

      {/* KPI SECTION */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "20px",
        marginBottom: "50px"
      }}>

        <div style={cardStyle}>
          <h3>Total Complaints</h3>
          <h1>{stats.total}</h1>
        </div>

        <div style={cardStyle}>
          <h3>Pending</h3>
          <h1 style={{ color: "#faad14" }}>{stats.pending}</h1>
        </div>

        <div style={cardStyle}>
          <h3>Resolved</h3>
          <h1 style={{ color: "#52c41a" }}>{stats.resolved}</h1>
        </div>

        <div style={cardStyle}>
          <h3>Avg Resolution (hrs)</h3>
          <h1>{stats.avgResolutionTime}</h1>
        </div>

      </div>

      {/* CHART SECTION */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "40px",
        marginBottom: "50px"
      }}>

        <div style={cardStyle}>
          <h3>Complaints by Category</h3>
          <BarChart width={400} height={300} data={categoryData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#1890ff" />
          </BarChart>
        </div>

        <div style={cardStyle}>
          <h3>Priority Distribution</h3>
          <PieChart width={400} height={300}>
            <Pie
              data={priorityData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="value"
              label
            >
              {priorityData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

      </div>

      {/* TABLE SECTION */}
      <div style={cardStyle}>
        <h2 style={{ marginBottom: "20px" }}>System Summary</h2>

        <table style={{
          width: "100%",
          borderCollapse: "collapse"
        }}>
          <thead style={{ background: "#1890ff", color: "#fff" }}>
            <tr>
              <th style={thStyle}>Metric</th>
              <th style={thStyle}>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={tdStyle}>High Priority Complaints</td>
              <td style={tdStyle}>{stats.highPriority}</td>
            </tr>
            <tr>
              <td style={tdStyle}>Medium Priority Complaints</td>
              <td style={tdStyle}>{stats.mediumPriority}</td>
            </tr>
            <tr>
              <td style={tdStyle}>Low Priority Complaints</td>
              <td style={tdStyle}>{stats.lowPriority}</td>
            </tr>
            <tr>
              <td style={tdStyle}>In Progress</td>
              <td style={tdStyle}>{stats.inProgress}</td>
            </tr>
          </tbody>
        </table>

      </div>

    </div>
  );
}

export default Dashboard;
