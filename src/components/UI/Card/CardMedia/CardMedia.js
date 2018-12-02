import React from "react";
import classes from "./CardMedia.module.scss"
const cardMedia = props => {
  let media = null;
  if (props.image) {
    media = <div className={`${classes.CardMedia} flex-fill`}>
              <a href={props.link} 
                rel="noopener noreferrer" 
                target="_blank">
                <img src={props.image} alt="" />
              </a>
            </div>
  }
  return media
};

export default cardMedia; 
