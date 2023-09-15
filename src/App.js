import React, { Component } from 'react';
import ParticlesBg from 'particles-bg';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import './App.css';

const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user:{
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }
  
  loadUser = (data)=>{
    this.setState({user:{
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }})
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
    this.setState({imageUrl: event.target.value});
  }

  faceBox = (data)=>{
    const faceBoxData = data.outputs[0].data.regions[0].region_info.bounding_box;
    const img = document.getElementById('inputimage');
    const width = Number(img.width);
    const height = Number(img.height);
    return {
      top_row: height* faceBoxData.top_row,
      left_col: width* faceBoxData.left_col,
      bottom_row: height - (height* faceBoxData.bottom_row),
      right_row: width - (width* faceBoxData.right_col)
    }
  } 

  onButtonSubmit = () => {
    // HEADS UP! Sometimes the Clarifai Models can be down or not working as they are constantly getting updated.
    // A good way to check if the model you are using is up, is to check them on the clarifai website. For example,
    // for the Face Detect Mode: https://www.clarifai.com/models/face-detection
    // If that isn't working, then that means you will have to wait until their servers are back up. 

        fetch("https://smart-brain-server-l2dy.onrender.com/imageUrl",{
          method:"PUT",
          allowedHeaders: ['Content-Type','Authorization'],
          xContentTypeOptions: 'nosniff',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            input:this.state.input
          })
        })
        .then(response => response.json())
        .then(result =>{
          console.log('Before image endpoint fetch',result);
          if(result){
            fetch("https://smart-brain-server-l2dy.onrender.com/image",{
              method:"PUT",
              allowedHeaders: ['Content-Type','Authorization'],
              xContentTypeOptions: 'nosniff',
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                id:this.state.user.id
              })
            })
            .then(response=> response.json())
            .then(response => this.setState(Object.assign(this.state.user, {entries: response})))
            .catch(err=> result.status(400).json('Error updating image and fetching entries'))
          }
          this.displayFaceBox(this.faceBox(result));
        })
        .catch(error => console.log('error', error));
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState)
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;
    
    return (
      <div className="App">
        <ParticlesBg 
          color="#ffffff" 
          num={100} 
          type="cobweb" 
          bg={true} 
        />
        <Navigation 
          isSignedIn={isSignedIn} 
          onRouteChange={this.onRouteChange} 
        />
        { route === 'home'
          ? <div>
              <Logo />
              <Rank 
                name={this.state.user.name} 
                userRank={this.state.user.entries}
                id={this.state.user.id}
              />
              <ImageLinkForm
                onInputChange={this.onInputChange}
                onButtonSubmit={this.onButtonSubmit}
              />
              <FaceRecognition box={box} imageUrl={imageUrl} />
            </div>
          : (
             route === 'signin'
             ? <Signin 
                  loadUser={this.loadUser} 
                  onRouteChange={this.onRouteChange} 
                />
             : <Register 
                  loadUser={this.loadUser} 
                  onRouteChange={this.onRouteChange}
                />
            )
        }
      </div>
    );
  }
}

export default App;
