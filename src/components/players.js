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
              <div className="players-title">
                <button
                  className="players-remove waves-effect waves-light btn red"
                  onClick={() => {
                    this.props.onRemove(player.id);
                  }}
                >
                  <i className="material-icons left"></i>
                </button>

                <input
                  className="players-name"
                  value={player.name}
                  onChange={event =>
                    this.props.onChangeName(player, event.target.value)
                  }
                />

                <span
                  className="players-points badge left new"
                  data-badge-caption="Points"
                >
                  {player.points}
                </span>
              </div>

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
