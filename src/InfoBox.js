import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import "./infoBox.css";

function InfoBox({ title, cases, red, isActive, isGreen, total, ...props }) {
  return (
    <Card
      onClick={props.onClick}
      className={`infobox ${isActive && "is--active"} ${
        isGreen && isActive && "is--green"
      }`}
    >
      <CardContent>
        <Typography color="textSecondary">{title}</Typography>
        <h2 className={`infobox__cases ${isGreen && "green--text"}`}>
          {cases}
        </h2>
        <Typography className="infobox__total" color="textSecondary">
          {total} Total
        </Typography>
      </CardContent>
    </Card>
  );
}

export default InfoBox;
