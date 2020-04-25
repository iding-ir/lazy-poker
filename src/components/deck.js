import React, { Component } from "react";

import "./deck.css";
import Card from "./card";

class Deck extends Component {
  state = {};
  render() {
    let { deck } = this.props;

    return (
      <div className="deck">
        <div className="deck-cards">
          {deck.map((card, index) => {
            return <Card key={index} card={card} />;
          })}
        </div>
      </div>
    );
  }
}

export default Deck;
