import React, { Component } from "react";
import Card from "./card";

class Player extends Component {
  state = {};
  render() {
    let { player, canRemovePlayer, onRemovePlayer, onChangeName } = this.props;

    return (
      <React.Fragment>
        <div className="players-player">
          <div className="players-title">
            <button
              disabled={!canRemovePlayer}
              className="players-remove waves-effect waves-light btn red"
              onClick={() => {
                onRemovePlayer(player.id);
              }}
            >
              <i className="material-icons left"></i>
            </button>

            <input
              className="players-name"
              value={player.name}
              onChange={event => onChangeName(player, event.target.value)}
            />

            <span
              className="players-points badge light-blue new"
              data-badge-caption=""
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
      </React.Fragment>
    );
  }
}

export default Player;
