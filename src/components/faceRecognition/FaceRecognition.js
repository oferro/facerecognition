import React from "react";
import "./FaceRecognition.css";

const FaceRecognition = ({ imageUrl, box }) => {
  return (
    <div className='flex justify-center'>
      <div className="absolute ma">
        <div className="flex justify-center mt2">
          <img
            id="inputimage"
            alt=""
            src={imageUrl}
            width="400px"
            hight="auto"
          ></img>
          <div
            className="bounding-box"
            style={{
              top: box.topRow,
              right: box.rightCol,
              bottom: box.bottomRow,
              left: box.leftCol,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default FaceRecognition;
