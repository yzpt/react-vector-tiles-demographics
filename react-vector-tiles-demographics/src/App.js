import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import AgeSexPyramid from "./AgeSexPyramid";
import { createRoot } from "react-dom/client";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = "pk.eyJ1IjoieXpwdCIsImEiOiJjbHcyYTIzdWgwZzltMmtsOHg0NnUxaWpjIn0.0PM0eN5gsw8ipJ-ToUTDkg";

const App = () => {
  const mapContainer = useRef(null);
  const panelContainer = useRef(null);
  const pyramidContainer = useRef(null);
  const pyramidRootRef = useRef(null); // Reference for React root

  useEffect(() => {
    // Initialize map
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

      // Create the root only once
      if (pyramidContainer.current && !pyramidRootRef.current) {
        pyramidRootRef.current = createRoot(pyramidContainer.current);
      }

      map.on("mousemove", "vector-layer", (e) => {
        const properties = e.features[0]?.properties;
        if (properties) {
          // Update the panel
          panelContainer.current.innerHTML = `
            <h3>Feature Information</h3>
            <pre>${JSON.stringify(properties, null, 2)}</pre>
          `;

          // Fetch data and render pyramid
          fetch(`http://localhost:5000/data?CODGEO=${properties.code}`)
            .then((response) => response.json())
            .then((data) => {
              if (pyramidRootRef.current) {
                pyramidRootRef.current.render(<AgeSexPyramid data={data} />);
              }
            })
            .catch((error) => {
              if (pyramidContainer.current) {
                pyramidContainer.current.innerHTML = `<p>Error fetching data: ${error.message}</p>`;
              }
            });
        }
        map.getCanvas().style.cursor = "pointer";
      });

      map.on("mouseleave", "vector-layer", () => {
        // Reset cursor and clear content
        map.getCanvas().style.cursor = "";
        panelContainer.current.innerHTML = "<p>Hover over a feature to see details here.</p>";
        if (pyramidRootRef.current) {
          pyramidRootRef.current.render(null); // Clear React tree
        }
      });
    });

    return () => {
      map.remove();
      if (pyramidRootRef.current) {
        pyramidRootRef.current.unmount(); // Cleanup React root
      }
    };
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "row", width: "100vw", height: "100vh" }}>
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
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
        <div id="pyramid_container" ref={pyramidContainer} style={{ flex: 1 }}></div>
      </div>
      <div ref={mapContainer} style={{ flex: 2 }}></div>
    </div>
  );
};

export default App;
