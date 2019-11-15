import React, { Component } from "react";
import "./deck.css";
import Card from "./card";

class Deck extends Component {
  state = {};
  render() {
    return (
      <div className="deck">
        <h5>Table:</h5>

        <div className="deck-cards">
          {this.props.deck.map((card, index) => {
            return <Card key={index} card={card} />;
          })}
        </div>
      </div>
    );
  }
}

export default Deck;
