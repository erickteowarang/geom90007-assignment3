import React, { useRef, useState } from "react";
import ReactMapGL, { Marker } from "react-map-gl";
import useSupercluster from "use-supercluster";
import "mapbox-gl/dist/mapbox-gl.css";
import * as cafeData from "../../data/cafe-restuarants-2019.json";

const Map = () => {
  const [viewport, setViewport] = useState({
    latitude: -37.81,
    longitude: 144.96,
    zoom: 14,
  });

  const accessToken =
    "pk.eyJ1Ijoic2FuZG9ubCIsImEiOiJja3QzbnRsazcwOWoyMndudW94N2M5Y3gyIn0.W4x7VhJckEqamtkQE-e9yA";

  // Map Reference
  const mapRef = useRef();

  // Cluster points
  const points = cafeData.features.map((cafe) => ({
    type: "Cafe",
    properties: {
      cluster: false,
      ID: cafe.ID,
      name: cafe["Trading name"],
      seatingType: cafe["Seating type"],
      address: cafe["Street address"],
    },
    geometry: {
      type: "Point",
      coordinates: [cafe.longitude, cafe.latitude],
    },
  }));

  // Get map bounds
  const bounds = mapRef.current
    ? mapRef.current.getMap().getBounds().toArray().flat()
    : null;

  // Get Clusters
  const { clusters } = useSupercluster({
    points,
    zoom: viewport.zoom,
    bounds,
    options: { radius: 75, maxZoom: 20 },
  });

  return (
    <div>
      <ReactMapGL
        {...viewport}
        onViewportChange={setViewport}
        width="100vw"
        height="100vh"
        mapboxApiAccessToken={accessToken}
        mapStyle="mapbox://styles/sandonl/cku84fkct0b3w18pdckgthaua/draft"
        ref={mapRef}
      >
        {clusters.map((cluster) => {
          const [longitude, latitude] = cluster.geometry.coordinates;
          const { cluster: isCluster, point_count: pointCount } =
            cluster.properties;

          if (isCluster) {
            return (
              <Marker
                key={cluster.id}
                latitude={latitude}
                longitude={longitude}
              >
                <div
                  className="cluster-marker"
                  style={{
                    width: `${10 + (pointCount / points.length) * 20}`,
                    height: `${10 + (pointCount / points.length) * 20}`,
                  }}
                >
                  {pointCount}
                </div>
              </Marker>
            );
          }

          return (
            <Marker
              key={cluster.properties.ID}
              latitude={latitude}
              longitude={longitude}
            >
              <div className="marker">
                <button className="marker-button">O</button>
              </div>
            </Marker>
          );
        })}
      </ReactMapGL>
    </div>
  );
};

export default Map;
