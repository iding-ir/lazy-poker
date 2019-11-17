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
              <h6>
                <span className="players-name">{player.name}</span>

                <span className="badge left new" data-badge-caption="Points">
                  {player.points}
                </span>
              </h6>

              <div className="players-cards">
                {player.round.cards.map((card, index) => {
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
