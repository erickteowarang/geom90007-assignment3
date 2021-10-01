import logo from './logo.svg';
import './App.css';
import React, { useRef, useEffect, useState } from 'react';
import ReactMapGL from 'react-map-gl';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken = 'pk.eyJ1Ijoic2FuZG9ubCIsImEiOiJja3QzbnRsazcwOWoyMndudW94N2M5Y3gyIn0.W4x7VhJckEqamtkQE-e9yA';



function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(144.96);
  const [lat, setLat] = useState(-37.81);
  const [zoom, setZoom] = useState(14);

  useEffect(() => {
    if (map.current) return; // initialize map only once
      map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/sandonl/cku84fkct0b3w18pdckgthaua/draft',
      center: [lng, lat],
      zoom: zoom
      });
    });

  return (
    <div className="App">
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}

export default App;
