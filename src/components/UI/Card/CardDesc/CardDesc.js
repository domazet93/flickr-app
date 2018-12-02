import React from "react";

const cardDesc = props => {
  return (
    <div>
      <p>{props.desc}</p>
      {props.children}
    </div>
  )
};

export default cardDesc;
