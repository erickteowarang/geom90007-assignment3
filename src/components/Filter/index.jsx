import React from "react";
import cafeData from "../../data/cafe-restuarants-2019.json";
import "./Filter.css";

const Filter = (props) => {
  // Obtains a unique list for the suburb dropdown box
  const uniqueSuburbs = [
    ...new Set(cafeData.features.map((cafe) => cafe["CLUE small area"])),
  ];

  // Obtains a unique list for establishments
  const uniqueEstab = [
    ...new Set(
      cafeData.features.map((cafe) => cafe["Industry (ANZSIC4) description"])
    ),
  ];

  // Handle Suburb Change
  let handleSuburbChange = (e) => {
    props.setSuburb(e.target.value);
  };

  // Handle Seating Change
  let handleSeatingChange = (e) => {
    props.setSeatingType(e.target.value);
  };

  // Handle estbalishment Change
  let handleEstabChange = (e) => {
    props.setEstabType(e.target.value);
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
            value="Seats - Indoor"
            onChange={handleSeatingChange}
          ></input>
          <label for="indoor">Indoor</label>
          <input
            type="radio"
            id="outdoor"
            name="seating-type"
            value="Seats - Outdoor"
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

      <div className="suburb-container">
        <p> Choose a suburb: </p>
        <select onChange={handleSuburbChange} className="dropdown">
          <option value="Select a suburb"> -- Select a suburb -- </option>
          {uniqueSuburbs.map((suburb) => (
            <option value={suburb}>{suburb}</option>
          ))}
        </select>
      </div>

      <div className="estab-container">
        <p> Choose an establishment type: </p>
        <select onChange={handleEstabChange} className="dropdown">
          <option value="Select an Establishment Type">
            -- Select Establishment Type --
          </option>
          {uniqueEstab.map((estab) => (
            <option value={estab}>{estab}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Filter;
