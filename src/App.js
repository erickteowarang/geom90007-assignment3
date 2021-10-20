import React, { useEffect, useState } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import Map from "./components/Map";
import Filter from "./components/Filter";
import "mapbox-gl/dist/mapbox-gl.css";
import "./App.css";
import { 
  initialiseBathroomData,
  initialiseLandmarkData,
  initialisePlacesData,
  getEstablishments,
  getLandmarkThemes
} from "./util";

const App = () => {
  const [suburb, setSuburb] = useState("Melbourne (CBD)");
  const [seatingType, setSeatingType] = useState(true);
  const [estabType, setEstabType] = useState(getEstablishments());
  const [bathroomData, setBathroomData] = useState(initialiseBathroomData());
  const [filteredData, setFilteredData] = useState(initialisePlacesData());
  const [landmarkData, setLandmarkData] = useState(initialiseLandmarkData());
  const [landmarkType, setLandmarkType] = useState(getLandmarkThemes());

  // Businesses filter logic
  useEffect(() => {
      const filteredEstabData = initialisePlacesData().filter(location => 
        estabType.includes(location.properties.establishmentType) &&
        (suburb === "All" || location.properties.suburb === suburb) &&
        (!seatingType || location.properties.hasOutdoorSeating === true)
      );

      setFilteredData(filteredEstabData);
  }, [seatingType, estabType, suburb]);

  // Landmark filter logic
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
      <Map
        bathroomData={bathroomData}
        filteredData={filteredData}
        landmarkData={landmarkData}
      />
    </ChakraProvider>
  );
};

export default App;
