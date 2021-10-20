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
  const [suburb, setSuburb] = useState("All");
  const [activeView, setActiveView] = useState(null);
  const [seatingType, setSeatingType] = useState(true);
  const [estabType, setEstabType] = useState(getEstablishments());
  const [filteredData, setFilteredData] = useState(initialisePlacesData());
  const [landmarkData, setLandmarkData] = useState(initialiseLandmarkData());
  const [landmarkType, setLandmarkType] = useState(getLandmarkThemes());
  const [bathroomData, setBathroomData] = useState(initialiseBathroomData());
  const [bathroomType, setBathroomType] = useState([]);

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

  // Bathroom filter logic
  useEffect(() => {
    let filteredBathroomData = initialiseBathroomData();
    bathroomType.forEach(type => {
      filteredBathroomData = filteredBathroomData.filter(
        bathroom => bathroom[type] === "yes"
      )
    });

    setBathroomData(filteredBathroomData);
  }, [bathroomType]);

  // Reset options when users change the view
  useEffect(() => {
    setLandmarkType(getLandmarkThemes());
    setBathroomType([]);
    setEstabType(getEstablishments());
    setSuburb("All");
  }, [activeView]);

  return (
    <ChakraProvider>
      <Filter
        activeView={activeView}
        suburb={suburb}
        estab={estabType}
        landmarkType={landmarkType}
        seatingType={seatingType}
        bathroomType={bathroomType}
        setSuburb={setSuburb}
        setSeatingType={setSeatingType}
        setEstabType={setEstabType}
        setLandmarkType={setLandmarkType}
        setBathroomType={setBathroomType}
        setActiveView={setActiveView}
      />
      <Map
        bathroomData={bathroomData}
        filteredData={filteredData}
        landmarkData={landmarkData}
        activeView={activeView}
      />
    </ChakraProvider>
  );
};

export default App;
