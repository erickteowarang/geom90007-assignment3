import React, { useRef, useState, useEffect } from "react";
import { Text } from "@chakra-ui/react";
import ReactMapGL, { Marker, FlyToInterpolator } from "react-map-gl";
import { upperFirst } from "lodash";
import useSupercluster from "use-supercluster";

import Loader from '../Loader';
import Popup from '../Popup';
import { getAddressFromGeocode } from "../../util";
import "./Map.css";

const Map = ({ bathroomData, filteredData, landmarkData }) => {
  const [selectedBathroom, setSelectedBathroom] = useState(null);
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
    setSelectedBathroom(null);
    setSelectedLandmark(null);
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

  const getLandmarkDetails = async landmark => {
    setIsPopupLoading(true);
    setSelectedBathroom(null);
    setSelectedCafe(null);
    setSelectedLandmark({
      latitude: landmark.latitude,
      longitude: landmark.longitude,
    });
    
    if (!landmark.address) {
      const landmarkAddress = await getAddressFromGeocode({
        lat: landmark.latitude,
        lng: landmark.longitude,
      });

      landmark.address = landmarkAddress;
    }
    
    setSelectedLandmark(landmark);
    setIsPopupLoading(false);
  }

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
        <Marker key={landmark["Feature Name"]} latitude={landmark.latitude} longitude={landmark.longitude}>
          <button 
            className="marker-button landmark-button"
            onClick={e => {
              e.preventDefault();
              getLandmarkDetails(landmark);
            }}
          >
          </button>
        </Marker>
      ))}
      {selectedLandmark && (
        <Popup 
          latitude={selectedLandmark.latitude} 
          longitude = {selectedLandmark.longitude}
          onClose={() => {
            setSelectedLandmark(null);
          }}
          isLoading={isPopupLoading}
          heading={selectedLandmark["Feature Name"]}
          content={(
            <>
              <Text fontSize="md"><strong>Address:</strong> {selectedLandmark.address}</Text>
              <Text fontSize="md"><strong>Landmark Type:</strong> {selectedLandmark.Theme} - {selectedLandmark["Sub Theme"]}</Text>
            </>
          )}
        />
      )}

      {bathroomData.map(bathroom => (
        <Marker key={bathroom.name} latitude={bathroom.latitude} longitude={bathroom.longitude}>
          <button 
            className="marker-button bathroom-button"
            onClick={e => {
              e.preventDefault();
              setSelectedCafe(null);
              setSelectedLandmark(null);
              setSelectedBathroom(bathroom);
            }}
          >
          </button>
        </Marker>
      ))}
      {selectedBathroom && (
        <Popup 
          latitude={selectedBathroom.latitude} 
          longitude = {selectedBathroom.longitude}
          onClose={() => {
            setSelectedBathroom(null);
          }}
          isLoading={isPopupLoading}
          heading={selectedBathroom.name}
          content={(
            <>
              <Text fontSize="md"><strong>Wheelchair Accessible:</strong> {upperFirst(selectedBathroom.wheelchair)}</Text>
              <Text fontSize="md"><strong>Has Baby Facilities:</strong> {upperFirst(selectedBathroom.baby_facil)}</Text>
            </>
          )}
        />
      )}
      
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
          isLoading={isPopupLoading}
          heading={selectedCafe.name}
          content={(
            <>
              <Text fontSize="md"><strong>Address:</strong> {selectedCafe.address}</Text>
              <Text fontSize="md"><strong>Rating:</strong> {selectedCafe.rating}/5</Text>
              <Text fontSize="md">
                <strong>Currently Open:</strong>{" "}
                {selectedCafe.opening_hours &&
                selectedCafe.opening_hours.open_now
                  ? "Yes"
                  : "No"}
              </Text>
              <Text fontSize="md"><strong>Has outdoor seating:</strong> {selectedCafe.hasOutdoorSeating}</Text>
            </>
          )}
        />
      )}
    </ReactMapGL>
  );
};

export default Map;
