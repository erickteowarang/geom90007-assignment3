import React, { useEffect, useState, useMemo } from "react";
import { uniqBy } from "lodash";
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

  const initialiseData = () => {
    return uniqBy(cafeData.features, "Trading name")
      .map((cafe) => ({
        type: "Cafe",
        properties: {
          cluster: false,
          ID: cafe.ID,
          name: cafe["Trading name"],
          seatingType: cafe["Seating type"],
          address: cafe["Street address"],
          establishmentType: cafe["Industry (ANZSIC4) description"],
          suburb: cafe["CLUE small area"]
        },
        geometry: {
          type: "Point",
          coordinates: [cafe.longitude, cafe.latitude],
        },
    }))
  }; 
  const [filteredData, setFilteredData] = useState(initialiseData());

  // Filter logic
  useEffect(() => {
    const filteredData = initialiseData();
    if (seatingType === "both") {
      setFilteredData(filteredData.filter(
        (cafe) =>
          cafe.properties.establishmentType === estabType &&
          cafe.properties.suburb === suburb
      ))
    } else {
      setFilteredData(filteredData.filter(
        (cafe) =>
          cafe.properties.seatingType === seatingType &&
          cafe.properties.establishmentType === estabType &&
          cafe.properties.suburb === suburb
      ))
    }
  }, [seatingType, estabType, suburb])

  console.log(estabType);
  console.log(seatingType);
  console.log(suburb);
  console.log(filteredData);

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
