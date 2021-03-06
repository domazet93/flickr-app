import React from "react";
import classes from "./Input.module.scss";

const input = props => (
  <div className={classes.Input}>
    <label>
      {props.label}
      <input type={props.type} onChange={props.changed} onKeyPress={props.keypress}/>
    </label>
  </div>
);

export default input;
