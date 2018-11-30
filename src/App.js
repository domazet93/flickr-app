import React, { Component } from 'react';

import Spinner from "./components/UI/Spinner/Spinner";
import Input from "./components/UI/Input/Input";
import Button from "./components/UI/Button/Button";
import Card from "./components/UI/Card/Card";

import FlickService from "./services/api/flickr.service"

class App extends Component {

  state = {
    isLoading: false,
    gallery: [],  
    description: ""
  }

  componentDidMount() { 
    this.setState({ isLoading: true, photos: {} }, () => {
        this.getRecentPhotoAPI()
        .then((res) => {
          this.setState({
            gallery: res.data.photos.photo
          }, async () => {          
            let gallery = await this.getGalleryWithOwnersInfo()
            this.setState({ gallery }); 
          }); 
        })
        .catch(error => null)
        .finally(() => {
          this.setState({ isLoading: false });
        });
    });
  }

  handleQueryChange = event => {
    this.setState({ description: event.target.value })    
  };

  handleQueryKeyPress = event => {
    if (event.key === 'Enter') {
      this.handleQueryEvent()
    }      
  };

  handleQueryEvent = () => {
    this.getPhotosAPI()
    .then((res) => {
      this.setState({
        gallery: res.data.photos.photo
      }, async () => {          
        let gallery = await this.getGalleryWithOwnersInfo()
        this.setState({ gallery }); 
      });
    })
    .catch(error => null)
    .finally(() => {
      this.setState({ isLoading: false });
    });
  }

  getGalleryWithOwnersInfo = () => {
    let gallery =  [ ...this.state.gallery ]
    let promises = gallery.map(async (photo) => ({
      ...photo,
      person: await this.getPersonInfoAPI(photo)
    })) ;
    return Promise.all(promises);
  }

  getRecentPhotoAPI = () => {
    return FlickService
    .getRecentPhotos("/", {
      params: {
        per_page: 20
      }
    })
  }

  getPhotosAPI = () => {
    return FlickService
    .getPhotos("/", {
      params: {
        per_page: 20,
        tags: this.state.description
      }
    })
  }

  getPersonInfoAPI = (photo) => {
    return FlickService
      .getPeopleInfo("/", {
        params: {
          user_id: photo.owner
        }
      });      
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
            <Input changed={ this.handleQueryChange }
                    keypress={ this.handleQueryKeyPress } />  
            <div className="ml-2">
              <Button type="Success" clicked={ this.handleQueryEvent }>Search</Button>
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
