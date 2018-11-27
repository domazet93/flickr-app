import React from "react";
import classes from "./Button.module.scss";
import PropTypes from "prop-types";

const button = props => (
  <button
    type="button"
    disabled={props.isDisabled}
    className={[classes.Button, classes[props.type]].join(" ")}
    onClick={props.clicked}
  >
    {props.children}
  </button>
);

button.propTypes = {
  type: PropTypes.string.isRequired,
  children: PropTypes.string.isRequired,
  isDisabled: PropTypes.bool,
  clicked: PropTypes.func
}

export default button;
