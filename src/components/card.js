import React, { Component } from "react";
import "./card.css";

class Card extends Component {
  state = {};
  render() {
    const className = "cards-icon-" + this.props.card.shape;

    return (
      <div className="cards-card">
        <div>{this.props.card.mark}</div>
        <div className={className}></div>
        <div>{this.props.card.mark}</div>
      </div>
    );
  }
}

export default Card;
