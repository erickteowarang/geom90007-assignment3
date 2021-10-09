import React from 'react';
import Map from './components/Map'
import Store from './store'
import './App.css';

function App() {
  return (
    <Store>
      <Map />
    </Store>
  );
}

export default App;