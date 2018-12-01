import React from "react";
import classes from "./NoData.module.scss";

const noData = props => (
  <div className={classes.NoData}>
    <h3>{props.message || 'No Data' }</h3>
  </div>
);

export default noData;