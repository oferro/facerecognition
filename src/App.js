import React, { Component } from "react";

//backgraund shapes
import Particles from "react-particles-js";

import "./App.css";
import Navigation from "./components/navigation/Navigation";
import Register from "./components/register/Register";
import Signin from "./components/signin/Signin";
import FaceRecognition from "./components/faceRecognition/FaceRecognition";
import Logo from "./components/logo/Logo";
import ImageLinkForm from "./components/imageLinkForm/ImageLinkForm";
import Rank from "./components/rank/Rank";

// particles propeties
const particlesOption = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800,
      },
    },
  },
};


const initialState = {
  input: "",
  imageUrl: "",
  box: {},
  route: "signin",
  isSignedin: false,
  user: {
    id: "",
    name: "",
    email: "",
    entries: "",
    joined: "",
  },
};

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  /**
   * function to update the state.user data
   * @param {user} data user data to state update
   */
  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined,
      },
    });
  };

  /**
   * update state.box data from clarifai api
   * @param {json} data clarifai json data
   * @returns void
   */
  calculateFaceLocation = (data) => {
    const clarifaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("inputimage");
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height,
    };
  };
  displayFaceBox = (box) => {
    this.setState({ box: box });
  };

  /* On image input change */
  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  /* onPictureSubmit : add the fetch put to update the entries and retrive the new value */
  onPictureSubmit = () => {
    this.setState({ imageUrl: this.state.input });
      fetch("http://localhost:3000/imageurl", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: this.state.input
        }),
      })
      .then (response => response.json())
      .then((response) => {
        if (response) {
          fetch("http://localhost:3000/image", {
            method: "put",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: this.state.user.id,
            }),
          })
            .then((response) => response.json())
            .then((count) =>
              this.setState(Object.assign(this.state.user, { entries: count }))
            )
            .catch(console.log)
        }
        this.displayFaceBox(this.calculateFaceLocation(response));
      })
      .catch((err) => console.log(err));
  };

  onRouteChange = (route) => {
    if (route === "signout") {
      this.setState(initialState)
    } else if (route === "home") {
      this.setState({ isSignedin: true });
    } 
    this.setState({ route: route });
  };

  render() {
    const { isSignedin, box, imageUrl, route } = this.state;
    return (
      <div className="App">
        <Particles className="particles" params={particlesOption} />
        <Navigation
          isSignedin={isSignedin}
          onRouteChange={this.onRouteChange}
        />
        {route === "home" ? (
          <div>
            <Logo />
            <Rank
              name={this.state.user.name}
              entries={this.state.user.entries}
            />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onPictureSubmit}
            />
            <FaceRecognition box={box} imageUrl={imageUrl} />
          </div>
        ) : route === "register" ? (
          <Register
            loadUser={this.loadUser}
            onRouteChange={this.onRouteChange}
          />
          ) : (
          <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        )}
      </div>
    );
  }
}

export default App;
