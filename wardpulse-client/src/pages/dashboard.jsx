import { useEffect, useState } from "react";
import "./Dashboard.css";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

function Dashboard() {
  const [stats, setStats] = useState({});
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const dashboardRes = await axios.get(
      "http://localhost:5000/api/complaints/dashboard"
    );
    const complaintsRes = await axios.get(
      "http://localhost:5000/api/complaints"
    );

    setStats(dashboardRes.data);
    setComplaints(complaintsRes.data);
  };

  const updateStatus = async (id, status) => {
    await axios.patch(`http://localhost:5000/api/complaints/${id}`, {
      status
    });
    fetchData();
  };

  const categoryData = {
    labels: Object.keys(stats.categoryCounts || {}),
    datasets: [
      {
        label: "Complaints",
        data: Object.values(stats.categoryCounts || {}),
        backgroundColor: "#1890ff"
      }
    ]
  };

  const priorityData = {
    labels: ["High", "Medium", "Low"],
    datasets: [
      {
        data: [
          stats.highPriority || 0,
          stats.mediumPriority || 0,
          stats.lowPriority || 0
        ],
        backgroundColor: ["#ff4d4f", "#faad14", "#52c41a"]
      }
    ]
  };

  return (
   <div className="dashboard-container">

  <div className="dashboard-title">
    WardPulse Urban Intelligence Center
  </div>

  <div className="kpi-grid">
    <KPI title="Total Complaints" value={stats.total} />
    <KPI title="Pending" value={stats.pending} />
    <KPI title="Resolved" value={stats.resolved} />
    <KPI title="High Priority" value={stats.highPriority} />
  </div>

  <div className="ai-insight">
    <strong>AI Insight:</strong>{" "}
    {stats.highPriority > 2
      ? "⚠️ High civic risk detected. Immediate operational response required."
      : "✔ Civic load stable. No escalation needed."}
  </div>

  <div className="chart-grid">
    <div className="chart-box">
      <h3>Category Distribution</h3>
      <Bar data={categoryData} />
    </div>

    <div className="chart-box">
      <h3>Priority Spread</h3>
      <Pie data={priorityData} />
    </div>
  </div>

  <div className="table-box">
    <h2>Live Complaint Feed</h2>
    <table>
      <thead>
        <tr>
          <th>Category</th>
          <th>Description</th>
          <th>Priority</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {complaints.map(c => (
          <tr key={c._id}>
            <td>{c.category}</td>
            <td>{c.description}</td>
            <td>{c.predictedPriority}</td>
            <td>{c.status}</td>
            <td>
              {c.status !== "Resolved" && (
                <button
                  className="resolve-btn"
                  onClick={() => updateStatus(c._id, "Resolved")}
                >
                  Resolve
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

</div>

  );
}

/* ---------------- COMPONENTS ---------------- */

function KPI({ title, value }) {
  return (
    <div className="kpi-card">
      <div className="kpi-title">{title}</div>
      <div className="kpi-value">{value || 0}</div>
    </div>
  );
}


const getColor = priority => {
  if (priority === "High") return "#ff4d4f";
  if (priority === "Medium") return "#faad14";
  return "#52c41a";
};

/* ---------------- STYLES ---------------- */

const kpiContainer = {
  display: "flex",
  gap: "20px",
  marginTop: "20px"
};

const kpiCard = {
  background: "#fff",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  minWidth: "200px"
};

const insightBox = {
  marginTop: "30px",
  padding: "15px",
  background: "#e6f7ff",
  borderLeft: "5px solid #1890ff",
  borderRadius: "6px"
};

const tableStyle = {
  width: "100%",
  marginTop: "20px",
  borderCollapse: "collapse",
  background: "#fff",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
};

const resolveBtn = {
  padding: "6px 12px",
  borderRadius: "6px",
  border: "none",
  background: "#52c41a",
  color: "#fff",
  cursor: "pointer"
};

const refreshBtn = {
  padding: "8px 16px",
  borderRadius: "6px",
  border: "none",
  background: "#1890ff",
  color: "#fff",
  cursor: "pointer"
};

export default Dashboard;
