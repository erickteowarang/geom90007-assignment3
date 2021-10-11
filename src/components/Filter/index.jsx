import React, { useState } from "react";
import cafeData from "../../data/cafe-restuarants-2019.json";
import "./Filter.css";

const Filter = () => {
  const [suburb, setSuburb] = useState("Choose a suburb");
  const [seatingType, setSeatingType] = useState("indoor");

  // Obtains a unique list for the suburb dropdown box
  const uniqueSuburbs = [
    ...new Set(cafeData.features.map((cafe) => cafe["CLUE small area"])),
  ];

  // Handle Suburb Change
  let handleSuburbChange = (e) => {
    setSuburb(e.target.value);
  };

  // Handle Seating Change
  let handleSeatingChange = (e) => {
    setSeatingType(e.target.value);
  };

  return (
    <div className="filter-container">
      <h3>Filter Cafes</h3>

      <div className="radio-button-container">
        <p> Choose a seating type: </p>
        <form>
          <input
            type="radio"
            id="indoor"
            name="seating-type"
            value="indoor"
            onChange={handleSeatingChange}
          ></input>
          <label for="indoor">Indoor</label>
          <input
            type="radio"
            id="outdoor"
            name="seating-type"
            value="outdoor"
            onChange={handleSeatingChange}
          ></input>
          <label for="outdoor">Outdoor</label>
          <input
            type="radio"
            id="both"
            name="seating-type"
            value="both"
            onChange={handleSeatingChange}
          ></input>
          <label for="both">Both</label>
        </form>
      </div>

      <div className="suburb-dropdown-container">
        <p> Choose a suburb: </p>
        <select onChange={handleSuburbChange} id="suburb-dropdown">
          <option value="Select a suburb"> -- Select a suburb -- </option>
          {uniqueSuburbs.map((suburb) => (
            <option value={suburb}>{suburb}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Filter;

import React from "react";
import cafeData from "../../data/cafe-restuarants-2019.json";


var type = "Indoor"
var area = "Melbourne (CBD)"

export const seatingFilter = cafeData.features.filter(
        (cafe) => cafe["Seating type"] === `Seats - ${type}` && 
        cafe["CLUE small area"] === `${area}`
    )


const Filter = () => {
   
    
  return (
      <div>
          
      </div>
  )  
}



export default Filter;