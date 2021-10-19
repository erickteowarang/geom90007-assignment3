/* eslint-disable no-undef */
import React, { useRef, useState, useEffect } from "react";
import ReactMapGL, { Marker, FlyToInterpolator, Popup } from "react-map-gl";
import BeatLoader from "react-spinners/BeatLoader";
import useSupercluster from "use-supercluster";

import Loader from '../Loader';
import "./Map.css";

const Map = ({ filteredData, landmarkData }) => {
  const [selectedCafe, setSelectedCafe] = useState(null);
  const [selectedLandmark, setSelectedLandmark] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPopupLoading, setIsPopupLoading] = useState(false);
  const [viewport, setViewport] = useState({
    latitude: -37.81,
    longitude: 144.96,
    zoom: 14,
  });

  const accessToken =
    "pk.eyJ1Ijoic2FuZG9ubCIsImEiOiJja3QzbnRsazcwOWoyMndudW94N2M5Y3gyIn0.W4x7VhJckEqamtkQE-e9yA";

  const getCafeDetails = (cluster) => {
    setIsPopupLoading(true);
    setSelectedCafe({
      latitude: cluster.geometry.coordinates[1],
      longitude: cluster.geometry.coordinates[0],
    });

    const request = {
      query: cluster.properties.name,
      fields: ["place_id"],
    };

    const service = new google.maps.places.PlacesService(
      document.createElement("div")
    );

    service.findPlaceFromQuery(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        const placeDetailsRequest = {
          placeId: results[0].place_id,
          fields: ["name", "rating", "formatted_phone_number", "opening_hours"],
        };

        service.getDetails(placeDetailsRequest, (place, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            const cafeDetails = {
              name: place.name,
              rating: place.rating,
              opening_hours: place.opening_hours,
              formatted_phone_number: place.formatted_phone_number,
              address: cluster.properties.address,
              latitude: cluster.geometry.coordinates[1],
              longitude: cluster.geometry.coordinates[0],
              hasOutdoorSeating: cluster.properties.hasOutdoorSeating ? 'Yes' : 'No',
            }
            
            setSelectedCafe(cafeDetails);
            setIsPopupLoading(false);
          }
        });
      }
    });
  };

  useEffect(() => {
    const listener = (e) => {
      if (e.key === "Escape") {
        setSelectedCafe(null);
      }
    };
    window.addEventListener("keydown", listener);

    setIsLoading(false);

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

  // Get clusters
  const { clusters, supercluster } = useSupercluster({
    points: filteredData,
    zoom: viewport.zoom,
    bounds,
    options: { radius: 100, maxZoom: 20 },
  });

  return isLoading ? (
    <Loader loading={isLoading} />
  ) : (
    <ReactMapGL
      {...viewport}
      onViewportChange={setViewport}
      width="100vw"
      height="100vh"
      mapboxApiAccessToken={accessToken}
      mapStyle="mapbox://styles/sandonl/cku84fkct0b3w18pdckgthaua/draft"
      ref={mapRef}
    >
      {landmarkData.map(landmark => (
        <Marker key={landmark["Feature Name"]} latitude={landmark.Latitude} longitude={landmark.Longitude}>
          <button 
            className="marker-button landmark-button"
            onClick={(e) => {
              e.preventDefault();
              setSelectedLandmark(landmark);
            }}
          >
          </button>
        </Marker>
      ))}
      {selectedLandmark ? (
        <Popup 
          latitude={selectedLandmark.Latitude} 
          longitude = {selectedLandmark.Longitude}
          onClose={() => {
            setSelectedLandmark(null);
          }}>
          <div>
            <h2>{selectedLandmark["Feature Name"]}</h2>
          </div>
        </Popup>
      ) : null}
      
      {clusters.map((cluster) => {
        const [longitude, latitude] = cluster.geometry.coordinates;
        const { cluster: isCluster, point_count: pointCount } =
          cluster.properties;

          console.log(pointCount);
          console.log(filteredData.length);

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
                  width: `${25 + (pointCount / filteredData.length) * 180}px`,
                  height: `${25 + (pointCount / filteredData.length) * 180}px`
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
                getCafeDetails(cluster);
              }}
            ></button>
          </Marker>
        );
      })}

      {selectedCafe && (
        <Popup
          latitude={selectedCafe.latitude}
          longitude={selectedCafe.longitude}
          onClose={() => {
            setSelectedCafe(null);
          }}
        >
          {isPopupLoading ? (
            <div className="popupLoader">
              <BeatLoader color="#36D7B7" size={12} />
            </div>
          ) : (
            <div>
              <h2>{selectedCafe.name}</h2>
              <p>{selectedCafe.address}</p>
              <p>Rating: {selectedCafe.rating}</p>
              <p>
                Currently Open:{" "}
                {selectedCafe.opening_hours &&
                selectedCafe.opening_hours.open_now
                  ? "Yes"
                  : "No"}
              </p>
              <p>Has outdoor seating: {selectedCafe.hasOutdoorSeating}</p>
            </div>
          )}
        </Popup>
      )}
    </ReactMapGL>
  );
};

export default Map;
