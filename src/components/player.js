import React, { Component } from "react";
import "./player.css";
import Card from "./card";

class Player extends Component {
  state = {};
  render() {
    return (
      <div className="app-player">
        <h2 className="app-player-title">{this.props.player.name}</h2>

        <div className="app-cards">
          {this.props.player.cards.map((card, index) => {
            return <Card key={index} card={card} />;
          })}
        </div>
      </div>
    );
  }
}

export default Player;
