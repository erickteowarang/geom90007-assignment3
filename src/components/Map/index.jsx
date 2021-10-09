import React, { useRef, useState, useEffect, useContext } from "react";
import ReactMapGL, { Marker, FlyToInterpolator, Popup } from "react-map-gl";
import useSupercluster from "use-supercluster";
import "mapbox-gl/dist/mapbox-gl.css";
import * as cafeData from "../../data/cafe-restuarants-2019.json";
import { Context } from '../../store';
import "./Map.css";

const Map = () => {
  const accessToken =
    "pk.eyJ1Ijoic2FuZG9ubCIsImEiOiJja3QzbnRsazcwOWoyMndudW94N2M5Y3gyIn0.W4x7VhJckEqamtkQE-e9yA";

  const [viewport, setViewport] = useState({
    latitude: -37.81,
    longitude: 144.96,
    zoom: 14,
  });

  const [state, dispatch] = useContext(Context);
  const [selectedCafe, setSelectedCafe] = useState(null);

  useEffect(() => {
    const listener = (e) => {
      if (e.key === "Escape") {
        setSelectedCafe(null);
      }
    };
    window.addEventListener("keydown", listener);
    dispatch({ type: 'SET_POINTS', payload: 
      cafeData.features.map((cafe) => ({
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
      })) 
    })

    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, []);

  // Map Reference
  const mapRef = useRef();

  // Get map bounds
  const bounds = mapRef.current
    ? mapRef.current.getMap().getBounds().toArray().flat()
    : null;

  // Get Clusters
  const { clusters, supercluster } = useSupercluster({
    points: state.points,
    zoom: viewport.zoom,
    bounds,
    options: { radius: 100, maxZoom: 20 },
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
                    width: `${10 + (pointCount / state.points.length) * 80}px`,
                    height: `${10 + (pointCount / state.points.length) * 80}px`,
                  }}
                  onClick={() => {
                    const expansionZoom = Math.min(
                      supercluster.getClusterExpansionZoom(cluster.id),
                      20
                    );
                    setViewport({
                      ...viewport,
                      latitude,
                      longitude,
                      zoom: expansionZoom,
                      transitionInterpolator: new FlyToInterpolator({
                        speed: 2,
                      }),
                      transitionDuration: "auto",
                    });
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
              <button
                className="marker-button"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedCafe(cluster);
                  console.log(selectedCafe);
                }}
              ></button>
            </Marker>
          );
        })}
        {selectedCafe ? (
          <Popup
            latitude={selectedCafe.geometry.coordinates[1]}
            longitude={selectedCafe.geometry.coordinates[0]}
            onClose={() => {
              setSelectedCafe(null);
            }}
          >
            <div>
              <h2>{selectedCafe.properties.name}</h2>
              <p>{selectedCafe.properties.address}</p>
            </div>
          </Popup>
        ) : null}
      </ReactMapGL>
    </div>
  );
};

export default Map;
