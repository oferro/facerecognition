import React from "react";
import "./imageLinkForm.css";

const ImageLinkForm = ({ onInputChange, onButtonSubmit }) => {
  return (
    <div>
      <p className="f3">
        {"This magic will detect faces in your pictures. Giv it a try"}
      </p>
      <div className="form  w-80 pa4 br3 shadow-5 center">
        <input
          className="f4 pa2 w-70 center"
          type="text"
          onChange={onInputChange}
        />
        <button
          className="f4 w-30 grow link ph3 pv2 dib white bg-light-purple"
          onClick={onButtonSubmit}
        >
          Detect
        </button>
      </div>
    </div>
  );
};

export default ImageLinkForm;
