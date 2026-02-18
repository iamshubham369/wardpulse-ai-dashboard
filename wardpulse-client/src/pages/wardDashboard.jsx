import { wardData } from "../data/wardData";
import "./wardDashboard.css";

function WardDashboard() {
  const utilization =
    ((wardData.budgetUsed / wardData.budgetAllocated) * 100).toFixed(1);

  return (
    <div className="ward-container">

      <div className="ward-header">
        <div className="ward-title">{wardData.wardName}</div>
        <div className="ward-sub">
          Representative: {wardData.representative}
        </div>
      </div>

      <div className="summary-grid">
        <Summary title="Total Budget" value={`₹${wardData.budgetAllocated}`} />
        <Summary title="Budget Used" value={`₹${wardData.budgetUsed}`} />
        <Summary title="Utilization" value={`${utilization}%`} />
        <Summary title="Active Projects" value={wardData.projects.length} />
      </div>

      <h2>Projects</h2>

      <div className="project-grid">
        {wardData.projects.map(project => (
          <div className="project-card" key={project.id}>
            <h3>{project.name}</h3>
            <p style={{ color: "#a0a8b3" }}>{project.department}</p>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${project.progress}%`,
                  background:
                    project.status === "Delayed"
                      ? "var(--danger)"
                      : "var(--success)"
                }}
              />
            </div>

            <p>{project.progress}% Complete</p>

            <div
              className={`status-chip ${
                project.status === "Delayed"
                  ? "status-delayed"
                  : "status-ontrack"
              }`}
            >
              {project.status}
            </div>

            <p>
              Budget: ₹{project.budgetUsed} / ₹{project.budgetAllocated}
            </p>

            <p>Complaints Linked: {project.complaintsLinked}</p>
          </div>
        ))}
      </div>

      <div className="invoice-section">
        <h2>Invoice Transparency</h2>

        <table className="invoice-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Vendor</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Purpose</th>
              <th>Project</th>
            </tr>
          </thead>

          <tbody>
            {wardData.invoices.map(inv => (
              <tr key={inv.id}>
                <td>{inv.id}</td>
                <td>{inv.vendor}</td>
                <td>₹{inv.amount}</td>
                <td>{inv.date}</td>
                <td>{inv.purpose}</td>
                <td>{inv.project}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

function Summary({ title, value }) {
  return (
    <div className="summary-card">
      <div className="summary-title">{title}</div>
      <div className="summary-value">{value}</div>
    </div>
  );
}

export default WardDashboard;
