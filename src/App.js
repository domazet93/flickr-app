import React, { Component } from 'react';
import axios from "./axios/axios-flickr";

import Spinner from "./components/UI/Spinner/Spinner";

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
        <p>Flickr App</p> 
        { photos }
      </div>
    );
  }
}

export default App;
