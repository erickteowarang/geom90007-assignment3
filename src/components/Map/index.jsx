/* eslint-disable no-undef */
import React, { useRef, useState, useEffect, useContext } from "react";
import ReactMapGL, { Marker, FlyToInterpolator, Popup } from "react-map-gl";
import BeatLoader from 'react-spinners/BeatLoader';
import useSupercluster from "use-supercluster";
import { uniqBy } from "lodash";

import * as cafeData from "../../data/cafe-restuarants-2019.json";
import { Context } from '../../store';
import Filter from "../Filter";
import {seatingFilter} from "../Filter";

import Loader from '../Loader';
import "./Map.css";

const Map = () => {
  const [state, dispatch] = useContext(Context);
  const [selectedCafe, setSelectedCafe] = useState(null);
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
      longitude: cluster.geometry.coordinates[0]
    });

    const request = {
      query: cluster.properties.name,
      fields: ['place_id']
    };
  
    const service = new google.maps.places.PlacesService(document.createElement('div'));
  
    service.findPlaceFromQuery(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        const placeDetailsRequest = {
          placeId: results[0].place_id,
          fields: ['name', 'rating', 'formatted_phone_number', 'opening_hours']
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
              longitude: cluster.geometry.coordinates[0]
            }
            
            setSelectedCafe(cafeDetails);
            setIsPopupLoading(false);
          }
        })
      }
    })
  }

  useEffect(() => {
    const listener = (e) => {
      if (e.key === "Escape") {
        setSelectedCafe(null);
      }
    };
    window.addEventListener("keydown", listener);
    const uniquePoints = uniqBy(seatingFilter, 'Trading name');
    dispatch({ type: 'SET_POINTS', payload: 
      uniquePoints.map((cafe) => ({
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


    setIsLoading(false);

    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, [dispatch]);

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
                <p>Currently Open: {selectedCafe.opening_hours && selectedCafe.opening_hours.open_now ? 'Yes' : 'No'}</p>
              </div>
            )}
          </Popup>
        )}
      </ReactMapGL>
  );
};

export default Map;
