import React from "react";

const FaceRecognition = ({ imageUrl }) => {
  return (
    <div className="ma">
      <div className="flex justify-center mt2">
          <img alt="" src={imageUrl} width="400px" hight="auto"></img>
      </div>
    </div>
  );
};

export default FaceRecognition;
