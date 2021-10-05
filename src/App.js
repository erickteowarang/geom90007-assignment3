import React from 'react';
import Map from './components/Map'
import './App.css';
import * as cafeData from "./data/cafe-restaurant-bistro-seats-2019.json";

function App() {
  return (
    <div className="App">
      <Map />
    </div>
  );
}

export default App;
