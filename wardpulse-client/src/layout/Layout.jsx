import { Link, Outlet } from "react-router-dom";

function Layout() {
    return (
        <div style={{ display: "flex", height: "100vh", fontFamily: "Arial" }}>

            {/* Sidebar */}
            <div style={{
                width: "220px",
                background: "#001529",
                color: "#fff",
                padding: "20px"
            }}>
                <h2 style={{ marginBottom: "40px" }}>WardPulse</h2>

                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    <Link to="/" style={linkStyle}>Dashboard</Link>
                    <Link to="/map" style={linkStyle}>Geo Intelligence</Link>
                </div>
            </div>

            {/* Content */}
            <div style={{
                flex: 1,
                background: "#0f0f0f",
                color: "#fff",

                padding: "30px",
                overflowY: "auto"
            }}>
                <Outlet />
            </div>

        </div>
    );
}

const linkStyle = {
    color: "#fff",
    textDecoration: "none",
    padding: "10px",
    borderRadius: "6px",
    background: "#1890ff"
};

export default Layout;
