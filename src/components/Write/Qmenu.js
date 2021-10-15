import React, { useEffect, useRef, useState } from "react";
import tailImg from "../../../public/images/tail.png";

const Qmenu = (props) => {
  const { locationList, setUserLocation, setIsDropClick } = props;
  const wrapperRef = useRef(null);

  const handleClickOutSide = (e) => {
    if (wrapperRef && !wrapperRef.current.contains(e.target)) {
      setIsDropClick(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutSide);
    return () => {
      document.removeEventListener("mousedown", handleClickOutSide);
    };
  });
  // 위치 리스트를 클릭 했을 때
  const onListClickHandler = (data) => {
    setUserLocation(data.place_name);
    setIsDropClick(false);
  };
  return (
    <div className="map-dropdown" ref={wrapperRef}>
      <div className="map-dropdown-tail">
        <img src={tailImg} alt="" />
      </div>
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
