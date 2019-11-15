import React, { Component } from "react";
import "./players.css";
import Card from "./card";

class Player extends Component {
  state = {};
  render() {
    return (
      <div className="players">
        {this.props.players.map((player, key) => {
          return (
            <div key={key} className="players-player">
              <h6>{player.name}:</h6>

              <div className="players-cards">
                {player.cards.map((card, index) => {
                  return <Card key={index} card={card} />;
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default Player;
