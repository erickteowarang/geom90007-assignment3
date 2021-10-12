import React, { useState } from "react";
import Map from "./components/Map";
import Store from "./store";
import Filter from "./components/Filter";
import "mapbox-gl/dist/mapbox-gl.css";
import "./App.css";
import cafeData from "./data/cafe-restuarants-2019.json";

function App() {
  const [suburb, setSuburb] = useState("Melbourne (CBD)");
  const [seatingType, setSeatingType] = useState("Seats - Indoor");
  const [estabType, setEstabType] = useState("Cafes and Restaurants");

  // Filter Logic
  let filteredData = cafeData;
  seatingType === "both"
    ? (filteredData = cafeData.features.filter(
        (cafe) =>
          cafe["Industry (ANZSIC4) description"] === estabType &&
          cafe["CLUE small area"] === suburb
      ))
    : (filteredData = cafeData.features.filter(
        (cafe) =>
          cafe["Seating type"] === seatingType &&
          cafe["Industry (ANZSIC4) description"] === estabType &&
          cafe["CLUE small area"] === suburb
      ));

  console.log(estabType);
  console.log(seatingType);
  console.log(suburb);
  // console.log(filteredData);

  return (
    <div>
      <Filter
        setSuburb={setSuburb}
        setSeatingType={setSeatingType}
        setEstabType={setEstabType}
      />
      <Store>
        <Map filteredData={filteredData} />
      </Store>
    </div>
  );
}

export default App;
