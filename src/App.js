import React, { useEffect, useState } from "react";
import Map from "./components/Map";
import Store from "./store";
import Filter from "./components/Filter";
import "mapbox-gl/dist/mapbox-gl.css";
import "./App.css";

import { initialisePlacesData } from "./util";

const App = () => {
  const [suburb, setSuburb] = useState("Melbourne (CBD)");
  const [seatingType, setSeatingType] = useState(true);
  const [estabType, setEstabType] = useState("Cafes and Restaurants");
  const [filteredData, setFilteredData] = useState(initialisePlacesData());

  // Filter logic
  useEffect(() => {
    console.log('Outdoor', seatingType);
    const initialData = initialisePlacesData();
    let newData = initialData.filter(
      (cafe) =>
        cafe.properties.establishmentType === estabType &&
        cafe.properties.suburb === suburb
    )

    if (seatingType) {
      console.log('before filter', newData);
      newData = newData.filter((cafe) => cafe.properties.hasOutdoorSeating === true)
      console.log('after filter', newData);
    }

    setFilteredData(newData);
  }, [seatingType, estabType, suburb])

  // console.log(estabType);
  // console.log(seatingType);
  // console.log(suburb);
  // console.log(filteredData);

  return (
    <div>
      <Filter
        suburb={suburb}
        estab={estabType}
        seatingType={seatingType}
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
