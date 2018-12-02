import React from "react";

const cardMedia = props => {
  let media = null;
  if (props.image) {
    media = <a 
              href={props.link} 
              rel="noopener noreferrer" 
              target="_blank">
                <img src={props.image} alt="" />
            </a>
  }
  return <div>{media}</div>;
};

export default cardMedia;
