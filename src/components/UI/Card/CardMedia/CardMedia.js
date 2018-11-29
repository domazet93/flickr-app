import React from "react";

const cardMedia = props => {
  let media = null;
  if (props.image) {
    media = <img src={props.image} alt="" />;
  }
  return <div>{media}</div>;
};

export default cardMedia;
