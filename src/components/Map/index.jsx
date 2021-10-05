import React, { useState } from "react";
import ReactMapGL, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import * as cafeData from "../../data/cafe-restaurant-bistro-seats-2019.json";

const Map = () => {
  const [viewport, setViewport] = useState({
    latitude: -37.81,
    longitude: 144.96,
    zoom: 14,
  });

  const accessToken =
    "pk.eyJ1Ijoic2FuZG9ubCIsImEiOiJja3QzbnRsazcwOWoyMndudW94N2M5Y3gyIn0.W4x7VhJckEqamtkQE-e9yA";

  return (
    <div>
      <ReactMapGL
        {...viewport}
        onViewportChange={setViewport}
        width="100vw"
        height="100vh"
        mapboxApiAccessToken={accessToken}
        mapStyle="mapbox://styles/sandonl/cku84fkct0b3w18pdckgthaua/draft"
      >
        {cafeData.features.map((cafe) => (
          <Marker
            key={cafeData.features["Base property ID"]}
            latitude={cafeData.features.latitude}
            longitude={cafeData.features.longitude}
          >
            <div>TEST</div>
          </Marker>
        ))}
      </ReactMapGL>
    </div>
  );
};

export default Map;
