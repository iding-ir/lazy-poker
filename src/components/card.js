import React, { Component } from "react";
import "./card.css";

class Card extends Component {
  state = {};
  render() {
    if (this.props.card) {
      const cardIcon = "cards-icon-" + this.props.card.shape;
      const cardClass = "cards-card" + this.getSide();

      return (
        <React.Fragment>
          <div className={cardClass} data-highlight={this.props.card.highlight}>
            <div>{this.props.card.mark}</div>
            <div className={cardIcon}></div>
            <div>{this.props.card.mark}</div>
            <div className="cards-back"></div>
          </div>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <div className="cards-card">
            <div></div>
            <div></div>
            <div></div>
            <div className="cards-back"></div>
          </div>
        </React.Fragment>
      );
    }
  }

  getSide = () => {
    return this.props.card === null ? "" : " cards-hidden";
  };
}

export default Card;
