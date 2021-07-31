import React, { Component } from "react";
import Particles from "react-particles-js";
import "./App.css";
import Clarifai from "clarifai";
import Navigation from "./components/navigation/Navigation";
import Register from "./components/register/Register";
import Signin from "./components/signin/Signin";
import FaceRecognition from "./components/faceRecognition/FaceRecognition";
import Logo from "./components/logo/Logo";
import ImageLinkForm from "./components/imageLinkForm/ImageLinkForm";
import Rank from "./components/rank/Rank";

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

const app = new Clarifai.App({
  apiKey: "7ca11fc9615e43b79148ba6a8375064d",
});

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: "",
      imageUrl: "",
      box: {},
      route: "signin",
      isSignedin: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: '',
        joined: ''
      }
    };
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

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

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then((response) =>
        this.displayFaceBox(this.calculateFaceLocation(response))
      )
      .catch((err) => console.log(err));
  };

  onRouteChange = (route) => {
    if(route === 'home') {
      this.setState({isSignedin: true})
    } else  {
      this.setState({isSignedin: false})
    }
    this.setState({ route: route });
  };

  render() {
    const { isSignedin, box, imageUrl, route} = this.state;
    return (
      <div className="App">
        <Particles className="particles" params={particlesOption} />
        <Navigation isSignedin={isSignedin} onRouteChange={this.onRouteChange} />
        {route === "home" ? (
          <div>
            <Logo />
            <Rank 
              name = {this.state.user.name}
              entries = {this.state.user.entries}
            />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition
              box={box}
              imageUrl={imageUrl}
            />
          </div>
        ) : (route === 'signin' 
            ? 
              <Signin 
                loadUser={this.loadUser} 
                onRouteChange={this.onRouteChange} 
              />
            :
              <Register 
                loadUser={this.loadUser} 
                onRouteChange={this.onRouteChange} 
              />
        )}
      </div>
    );
  }
}

export default App;
