import React, { Component } from 'react';
import classes from "./App.module.scss";
import FlickService from "./services/api/flickr.service"

import InfiniteScroll from "react-infinite-scroller";

import Spinner from "./components/UI/Spinner/Spinner";
import Input from "./components/UI/Input/Input";
import Button from "./components/UI/Button/Button";
import Card from "./components/UI/Card/Card";
import NoData from "./components/UI/NoData/NoData"

class App extends Component {

  state = {
    isLoading: false,
    gallery: [],  
    description: "",
    hasMore: true
  }

  componentDidMount() { 
    this.setState({ isLoading: true }, () => {
      this.getPhotos()
    });
  }

  getPhotos = () => {   
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

  loadMorePhotos = () => {
      this.getPhotosAPI()
      .then((res) => {
        this.setState({
          gallery: res.data.photos.photo
        }, async () => {          
          let gallery = await this.getGalleryWithOwnersInfo()
          let result = [ ...this.state.gallery, ...gallery]
          this.setState({ gallery: result, hasMore: true }); 
        });
      })
      .catch(error => null)
  }

  handleQueryChange = event => {
    this.setState({ description: event.target.value })    
  };

  handleQueryKeyPress = event => {
    if (event.key === 'Enter' && this.state.description) {
      this.getPhotos()
    }      
  };

  getGalleryWithOwnersInfo = () => {
    let gallery =  [ ...this.state.gallery ]
    let promises = gallery.map(async (photo) => ({
      ...photo,
      person: await this.getPersonInfoAPI(photo)
    })) ;
    return Promise.all(promises);
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
        <div className={ "flex-lg-3 flex-md-6 flex-xs-1 m-2" } key={$index}>
          <Card 
            key={$index}       
            title={photo.title}
            image={`http://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`}
            desc="desc"/>
        </div>
        
        ))
      ) : (
        <NoData />
      );
    } 

    return (
      <div>
        <h3>flickr</h3> 
        <div className="d-flex flex-row">
          <div className="d-flex flex-fill">
            <Input
                changed={ this.handleQueryChange }
                keypress={ this.handleQueryKeyPress } />  
            <div className="ml-2">
              <Button 
                  type="Success" 
                  isDisabled={!this.state.description} 
                  clicked={ this.getPhotos }>Search</Button>
            </div>          
          </div>
          <div className="d-flex flex-fill">
          
          </div>
        </div> 
        <div className="d-flex flex-wrap justify-content-center">   
          <InfiniteScroll 
              initialLoad={false}
              className={`${classes.App} mt-3`}
              hasMore={this.state.hasMore}
              pageStart={0}
              loadMore={this.loadMorePhotos}>
            {gallery} 
          </InfiniteScroll>
        </div>
      </div> 
    );
  }
}

export default App;
