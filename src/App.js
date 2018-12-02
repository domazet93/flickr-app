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
    tags: "",
    hasMorePictures: true,
    page: 1
  }

  componentDidMount() { 
    this.getPhotos();
  }

  getPhotos = () => {   
    this.setState({ isLoading: true, page: 1 }, () => { 
      this.getPhotosAPI()
        .then(async (res) => {
          let galleryWithOwners = await this.getGalleryWithOwnersInfo(res.data.photos.photo);
          let gallery  = await this.getPhotoInfo(galleryWithOwners)
          this.setState({ gallery, page: res.data.photos.page + 1 }); 
        })
        .catch(error => null)
        .finally(() => {
          this.setState({ isLoading: false });
        });      
    });
  }

  loadMorePhotos = () => {
      var page = this.state.page;
      this.setState(({ page: page + 1, hasMorePictures: false }), () => {
        this.getPhotosAPI()
        .then(async (res) => {
          let galleryWithOwners = await this.getGalleryWithOwnersInfo(res.data.photos.photo);
          let newPhotos  = await this.getPhotoInfo(galleryWithOwners)
          let gallery = [ ...this.state.gallery, ...newPhotos ];
          
          this.setState({ 
            hasMorePictures: true, 
            gallery
          }); 
        })
        .catch(error => null)
      })
  }

  handleQueryChange = event => {
    this.setState({ tags: event.target.value })    
  };

  handleQueryKeyPress = event => {
    if (event.key === 'Enter' && this.state.tags) {
      this.getPhotos()
    }      
  };

  getGalleryWithOwnersInfo = (gallery) => {
    let promises = gallery.map(async (photo) => {
      let response = await this.getPersonInfoAPI(photo)
      return {
        ...photo,
        person: response.data.person
    }});
    return Promise.all(promises);
  }

  getPhotoInfo = (gallery) => {
    let promises = gallery.map(async (photo) => {
      let response = await this.getPhotoInfoAPI(photo)
      return {
        ...photo,
        info: response.data.photo
    }});
    return Promise.all(promises);
  }

  getPhotosAPI = () => {
    return FlickService
    .getPhotos("/", {
      params: {
        page: this.state.page,
        per_page: 20,
        tags: this.state.tags
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

  getPhotoInfoAPI = (photo) => {
    return FlickService
      .getPhotoInfo("/", {
        params: {
          photo_id: photo.id
        }
      });      
  }

  render() {
    let gallery = <Spinner />

    if(!this.state.isLoading) {
      gallery = this.state.gallery.length ? (
        <div className={classes.Card}>
          {this.state.gallery.map((photo, $index) => {
            return (
              <div className={ "flex-lg-3 flex-md-6 flex-xs-1 m-2"  } key={$index}>
                <Card  
                  key={$index}       
                  title={photo.title}
                  link={photo.info.urls.url[0]._content}
                  image={`http://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`}> 
                  { photo.person.username._content } <br />
                  {photo.info.dates.taken } <br />
                  { photo.info.tags.tag.map((tag) => { return (
                    <span class="mr-1" key={tag.id}>{tag._content}</span>
                    ) }) 
                  } 
                </Card>
              </div>) 
            })}
        </div>
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
                  isDisabled={!this.state.tags} 
                  clicked={ this.getPhotos }>Search</Button>
            </div>          
          </div>
          <div className="d-flex flex-fill">
          
          </div>
        </div> 
        <div className="d-flex flex-wrap">   
          <InfiniteScroll 
              initialLoad={false}
              className={`${classes.App} mt-3`}
              hasMore={this.state.hasMorePictures}
              pageStart={0}
              loadMore={this.loadMorePhotos}>
            { gallery } 
          </InfiniteScroll>
        </div>
      </div> 
    );
  }
}

export default App;
