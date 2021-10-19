import React, { useEffect, useState } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import Map from "./components/Map";
import Filter from "./components/Filter";
import "mapbox-gl/dist/mapbox-gl.css";
import "./App.css";
import { initialisePlacesData, getEstablishments, getLandmarkThemes, initialiseLandmarkData } from "./util";

const App = () => {
  const [suburb, setSuburb] = useState("Melbourne (CBD)");
  const [seatingType, setSeatingType] = useState(true);
  const [estabType, setEstabType] = useState(getEstablishments());
  const [filteredData, setFilteredData] = useState(initialisePlacesData());
  const [landmarkData, setLandmarkData] = useState(initialiseLandmarkData());
  const [landmarkType, setLandmarkType] = useState(getLandmarkThemes());

  // Filter logic
  useEffect(() => {
      const filteredEstabData = initialisePlacesData().filter(location => 
        estabType.includes(location.properties.establishmentType) &&
        (suburb === "All" || location.properties.suburb === suburb) &&
        (!seatingType || location.properties.hasOutdoorSeating === true)
      );

      setFilteredData(filteredEstabData);
  }, [seatingType, estabType, suburb]);

  // Filter logic
  useEffect(() => {
      const filteredLandmarkData = initialiseLandmarkData().filter(landmark => 
        landmarkType.includes(landmark.Theme)
      );

      setLandmarkData(filteredLandmarkData);
  }, [landmarkType]);

  return (
    <ChakraProvider>
      <Filter
        suburb={suburb}
        estab={estabType}
        landmarkType={landmarkType}
        seatingType={seatingType}
        setSuburb={setSuburb}
        setSeatingType={setSeatingType}
        setEstabType={setEstabType}
        setLandmarkType={setLandmarkType}
      />
      <Map filteredData={filteredData} landmarkData={landmarkData} />
    </ChakraProvider>
  );
};

export default App;
