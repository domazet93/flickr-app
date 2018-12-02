import React from "react";
import Aux from "../../../../hoc/Aux/Aux"
const cardDesc = props => {
  return (
    <Aux>
      <p>{props.desc}</p>
      {props.children}
    </Aux>
  )
};

export default cardDesc;
