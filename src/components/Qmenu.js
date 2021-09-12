import React, { useState } from "react";
import tailImg from "../images/tail.png";

const Qmenu = (props) => {
  const { locationList, setUserLocation, setIsDropClick } = props;

  // 위치 리스트를 클릭 했을 때
  const onListClickHandler = (data) => {
    setUserLocation(data.place_name);
    setIsDropClick(false);
  };
  return (
    <div className="map-dropdown">
      <img src={tailImg} alt="" />
      <div className="map-dropdown-window">
        {locationList.map((data, idx) => {
          return (
            <div
              className="map-dropdown-place"
              key={idx}
              onClick={() => onListClickHandler(data)}
            >
              <h1>{data.place_name}</h1>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Qmenu;
