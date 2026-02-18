import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import MapView from "./pages/MapView";
import Layout from "./layout/Layout";
import WardDashboard from "./pages/wardDashboard";



function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="ward" element={<WardDashboard />} />
        <Route path="map" element={<MapView />} />
      </Route>
    </Routes>
  );
}

export default App;
