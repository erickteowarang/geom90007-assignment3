import React from "react";
import "./Filter.css";

import { getEstablishments, getSuburbs } from "../../util";

const Filter = ({
  suburb,
  estab,
  setSuburb,
  setSeatingType,
  setEstabType,
  setShowAll,
}) => {
  // Handle Suburb Change
  const handleSuburbChange = (e) => {
    setSuburb(e.target.value);
  };

  // Handle Seating Change
  const handleSeatingChange = (e) => {
    setSeatingType(e.target.value === "outdoor");
  };

  // Handle estbalishment Change
  const handleEstabChange = (e) => {
    setEstabType(e.target.value);
  };

  // Handle show-all Change
  const handleShowAllChange = () => {
    setShowAll((prevCheck) => !prevCheck);
  };

  return (
    <div className="filter-container">
      <h3>Filter Cafes</h3>

      <div className="radio-button-container">
        <p>Do you need outdoor seating? </p>
        <form>
          <input
            type="radio"
            id="outdoor"
            name="seating-type"
            value="outdoor"
            defaultChecked
            onChange={handleSeatingChange}
          ></input>
          <label for="outdoor">Yes</label>
          <input
            type="radio"
            id="both"
            name="seating-type"
            value="any"
            onChange={handleSeatingChange}
          ></input>
          <label for="both">No</label>
        </form>
      </div>

      <div className="suburb-container">
        <p> Choose a suburb: </p>
        <select onChange={handleSuburbChange} className="dropdown">
          <option value="Select a suburb"> -- Select a suburb -- </option>
          {getSuburbs().map((cafeSuburb) => (
            <option value={cafeSuburb} selected={suburb === cafeSuburb}>
              {cafeSuburb}
            </option>
          ))}
        </select>
      </div>

      <div className="estab-container">
        <p> Choose an establishment type: </p>
        <select onChange={handleEstabChange} className="dropdown">
          <option value="Select an Establishment Type">
            -- Select Establishment Type --
          </option>
          {getEstablishments().map((cafeEstab) => (
            <option value={cafeEstab} selected={estab === cafeEstab}>
              {cafeEstab}
            </option>
          ))}
        </select>
      </div>
      {/* edit here dunno what the onchange is*/}
      <div className="showall-container">
        <p> Show all data: </p>
        <label class="switch">
          <input
            type="checkbox"
            value="checked"
            onChange={handleShowAllChange}
          ></input>
          <span class="slider"></span>
        </label>
      </div>
    </div>
  );
};

export default Filter;

