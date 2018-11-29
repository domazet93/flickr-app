import React from "react";
import classes from "./Card.module.scss";

import CardTitle from "./CardTitle/CardTitle";
import CardDesc from "./CardDesc/CardDesc";
import CardMedia from "./CardMedia/CardMedia";
import CardActions from "./CardActions/CardActions";

const card = props => {
  return ( 
    <div className={classes.Card}>
      <CardTitle title={props.title} /> 
      <CardMedia image={props.image} />
      <CardDesc desc={props.desc} />
      <CardActions></CardActions>
    </div>
  );
};

export default card;
