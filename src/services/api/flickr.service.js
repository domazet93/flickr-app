
import flickrInstance from "../../axios/axios-flickr"
 
function getRecentPhotos(url, params) {
  return flickrInstance({
    method: "GET",
    params: {
      ...params.params,
      method: "flickr.photos.getRecent",
      format: "json",
      nojsoncallback: 1,
      api_key: process.env.REACT_APP_API_KEY
    }
  });
}

function getPeopleInfo(url, params) {
  return flickrInstance({
    method: "GET", 
    params: {
      ...params.params,
      method: "flickr.people.getInfo",
      format: "json",
      nojsoncallback: 1,
      api_key: process.env.REACT_APP_API_KEY
    }
  });
}


function getPhotos(url, params) {
  return flickrInstance({
    method: "GET", 
    params: {
      ...params.params,
      method: "flickr.photos.search",
      format: "json",
      nojsoncallback: 1,
      api_key: process.env.REACT_APP_API_KEY
    }
  });
}

const FlickService = {
  getRecentPhotos, 
  getPeopleInfo,
  getPhotos
}

export default FlickService;