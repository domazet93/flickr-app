import React, { Component } from 'react';
import axios from "./axios/axios-flickr";

import Spinner from "./components/UI/Spinner/Spinner";
import Input from "./components/UI/Input/Input";
import Button from "./components/UI/Button/Button";
class App extends Component {

  state = {
    isLoading: false,
    photos: {}
  }

  componentDidMount() { 
    this.setState({ isLoading: true, pictures: [] }, () => {
      axios
        .get("/", {
          params: {
            method: "flickr.photos.getRecent",
            format: "json",
            nojsoncallback: 1,
            api_key: process.env.REACT_APP_API_KEY
          }
        })
        .then(res => {
          this.setState({
            photos: res.data.photos
          })
        })
        .catch(error => null)
        .finally(() => {
          this.setState({ isLoading: false });
        });
    });
  }

  render() {
    let photos = null;
    if(this.state.isLoading) {
      photos = <Spinner />
    } else {
      photos = "Loaded"
    }

    return (
      <div>
        <h3>flickr</h3> 
        <div className="d-flex flex-row">
          <div className="d-flex flex-fill">
            <Input changed={ (event) => console.log(event.target.value)}/>  
            <div className="ml-2">
              <Button type="Success" clicked={ () => console.log("clicked")}>Search</Button>
            </div>          
          </div>
          <div className="d-flex flex-fill">
          
          </div>
        </div> 
        { photos }
      </div>
    );
  }
}

export default App;
