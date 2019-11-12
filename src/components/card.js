import React, { Component } from "react";
import "./card.css";

class Card extends Component {
  state = {};
  render() {
    const className = "app-icon-" + this.props.card.suit.shape;

    return (
      <div className="app-card">
        <div>{this.props.card.mark}</div>
        <div className={className}></div>
        <div>{this.props.card.mark}</div>
      </div>
    );
  }
}

export default Card;
