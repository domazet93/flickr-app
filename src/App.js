import React, { Component } from 'react';
import axios from "./axios/axios-flickr";

import Spinner from "./components/UI/Spinner/Spinner";
import Input from "./components/UI/Input/Input";
import Button from "./components/UI/Button/Button";
import Card from "./components/UI/Card/Card";

class App extends Component {

  state = {
    isLoading: false,
    gallery: []
  }

  componentDidMount() { 
    this.setState({ isLoading: true, photos: {} }, () => {
      axios
        .get("/", {
          params: {
            method: "flickr.photos.getRecent",
            format: "json",
            per_page: 20,
            nojsoncallback: 1,
            api_key: process.env.REACT_APP_API_KEY
          }
        })
        .then((res) => {
          this.setState({
            gallery: res.data.photos.photo
          }, async () => {          
            let gallery = await this.doSomething()
            this.setState({ gallery })
            console.log(gallery)
          })
        })
        .catch(error => null)
        .finally(() => {
          this.setState({ isLoading: false });
        });
    });
  }

  doSomething = () => {
    let gallery =  [ ...this.state.gallery ]
    let promises = gallery.map(async (photo) => ({
      ...photo,
      person: await this.getOwner(photo)
    })) ;
    return Promise.all(promises);
  }

  getOwner = (photo) => {
    return axios
    .get("/", {
      params: {
        method: "flickr.people.getInfo",
        format: "json",
        user_id: photo.owner,
        nojsoncallback: 1,
        api_key: process.env.REACT_APP_API_KEY
      }
    })
  }

  render() {
    let gallery = <Spinner />

    if(!this.state.isLoading) {
      gallery = this.state.gallery.length ? (
        this.state.gallery.map((photo, $index) => (
          <Card key={$index}
                title={photo.title}
                image={`http://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`}
                desc="desc"/>

        ))
      ) : (
        <p>No Data</p>
      );
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
        <div className="d-flex flex-wrap">
          { gallery }
        </div>
      </div> 
    );
  }
}

export default App;
