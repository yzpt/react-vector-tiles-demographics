import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = "pk.eyJ1IjoieXpwdCIsImEiOiJjbHcyYTIzdWgwZzltMmtsOHg0NnUxaWpjIn0.0PM0eN5gsw8ipJ-ToUTDkg";

const App = () => {
  const mapContainer = useRef(null);
  const panelContainer = useRef(null);
  const dbInfosContainer = useRef(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v10",
      center: [2.3522, 48.8566],
      zoom: 7,
    });

    map.on("load", () => {
      map.addSource("tiles", {
        type: "vector",
        tiles: ["http://localhost:8080/data/communes-100m/{z}/{x}/{y}.pbf"],
        maxzoom: 12,
        minzoom: 5,
      });

      map.addLayer({
        id: "vector-layer",
        type: "fill",
        source: "tiles",
        "source-layer": "communes100m",
        paint: {
          "fill-color": "blue",
          "fill-opacity": 0.2,
        },
      });

      map.on("mousemove", "vector-layer", (e) => {
        const properties = e.features[0]?.properties;
        if (properties) {
          // Update the panel with feature information
          panelContainer.current.innerHTML = `
            <h3>Feature Information</h3>
            <pre>${JSON.stringify(properties, null, 2)}</pre>
          `;

          // Fetch data from the server and update db_infos
          fetch(`http://localhost:5000/data?CODGEO=${properties.code}`)
            .then(response => response.json())
            .then(data => {
              dbInfosContainer.current.innerHTML = `
                <h3>Database Information</h3>
                <pre>${JSON.stringify(data, null, 2)}</pre>
              `;
            })
            .catch(error => {
              dbInfosContainer.current.innerHTML = `<p>Error fetching data: ${error.message}</p>`;
            });
        }
        map.getCanvas().style.cursor = "pointer";
      });

      map.on("mouseleave", "vector-layer", () => {
        // Reset cursor and clear panel
        map.getCanvas().style.cursor = "";
        panelContainer.current.innerHTML = "<p>Hover over a feature to see details here.</p>";
        dbInfosContainer.current.innerHTML = "";
      });
    });

    return () => map.remove();
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "row", width: "100vw", height: "100vh" }}>
      <div
        id="panel"
        ref={panelContainer}
        style={{
          flex: 1,
          padding: "10px",
          borderRight: "1px solid #ccc",
          overflowY: "auto",
        }}
      >
        <p>Hover over a feature to see details here.</p>
      </div>
      <div id="db_infos" ref={dbInfosContainer} style={{ flex: 1 }}></div>
      <div ref={mapContainer} style={{ flex: 2 }}></div>
    </div>
  );
};

export default App;