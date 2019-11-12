import React, { Component } from "react";
import "./deck.css";
import Card from "./card";

class Deck extends Component {
  state = {};
  render() {
    return (
      <div className="app-deck">
        <h2 className="app-deck-title">{this.props.title}</h2>

        <div className="app-cards">
          {/* {this.props.deck.cards.map((card, index) => {
            return <Card key={index} card={card} />;
          })} */}
        </div>
      </div>
    );
  }
}

export default Deck;
