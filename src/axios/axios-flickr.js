import axios from "axios";

const instance = axios.create({
  baseURL: "https://api.flickr.com/services/rest/"
}); 

export default instance;
