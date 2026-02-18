import { useEffect, useState } from "react";
import axios from "axios";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Circle
} from "react-leaflet";
import L from "leaflet";

const getColor = (priority) => {
    if (priority === "High") return "red";
    if (priority === "Medium") return "orange";
    return "green";
};

function MapView() {
    const [complaints, setComplaints] = useState([]);
    const [hotspots, setHotspots] = useState([]);

    useEffect(() => {
        fetchComplaints();
        fetchHotspots();
    }, []);

    const fetchComplaints = () => {
        axios.get("http://localhost:5000/api/complaints")
            .then(res => setComplaints(res.data))
            .catch(err => console.error(err));
    };

    const fetchHotspots = () => {
        axios.get("http://localhost:5000/api/complaints/hotspots")
            .then(res => setHotspots(res.data))
            .catch(err => console.error(err));
    };

    return (
        <div style={{ height: "100vh" }}>
            <MapContainer center={[19.0760, 72.8777]} zoom={13} style={{ height: "100%" }}>
                <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Complaint Markers */}
                {complaints.map(c => {
                    const [lng, lat] = c.location.coordinates;

                    const icon = L.divIcon({
                        className: "custom-marker",
                        html: `<div style="
              background:${getColor(c.predictedPriority)};
              width:15px;
              height:15px;
              border-radius:50%;
            "></div>`
                    });

                    return (
                        <Marker key={c._id} position={[lat, lng]} icon={icon}>
                            <Popup>
                                <b>{c.category}</b><br />
                                Priority: {c.predictedPriority}<br />
                                Status: {c.status}
                            </Popup>
                        </Marker>
                    );
                })}

                {/* Hotspot Circles */}
                {hotspots.map((h, index) => (
                    <Circle
                        key={index}
                        center={[h.lat, h.lng]}
                        radius={200}
                        pathOptions={{
                            color: "red",
                            fillColor: "red",
                            fillOpacity: 0.3
                        }}
                    >
                        <Popup>
                            🔥 Hotspot Area<br />
                            Complaints: {h.count}
                        </Popup>
                    </Circle>
                ))}

            </MapContainer>
        </div>
    );
}

export default MapView;
