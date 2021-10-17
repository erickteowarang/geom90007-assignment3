import React from "react";
import BeatLoader from "react-spinners/BeatLoader";
import "./Loader.css";

const Loader = ({ loading }) => (
  <div className="loaderContainer">
    <div className="loader">
      <BeatLoader loading={loading} color="#36D7B7" size={20} />
      <p>The app is currently loading</p>
    </div>
  </div>
);

export default Loader;
