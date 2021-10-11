import React from 'react';
import Map from './components/Map'
import Store from './store'
import Filter from './components/Filter'
import "mapbox-gl/dist/mapbox-gl.css";
import './App.css';

function App() {
  return (
    // <Store>
    //   <Map />
    // </Store>
    <Filter/>
  );
}

export default App;