import React, { Component } from "react";

import "./players.css";
import Player from "./player";

class Players extends Component {
  state = {};
  render() {
    let {
      players,
      canAddPlayer,
      onAddPlayer,
      onRemovePlayer,
      onChangeName,
      onCheckName,
      canRemovePlayer,
    } = this.props;

    return (
      <div className="players">
        <div className="players-container">
          {players.map((player, key) => {
            return (
              <Player
                key={key}
                player={player}
                onRemovePlayer={onRemovePlayer}
                onChangeName={onChangeName}
                onCheckName={onCheckName}
                canRemovePlayer={canRemovePlayer}
              />
            );
          })}
        </div>

        <div className="players-add">
          <button
            id="players-add"
            disabled={!canAddPlayer}
            className="waves-effect waves-light btn-large btn-floating pink"
            onClick={onAddPlayer}
          >
            <i className="material-icons left">add</i>
          </button>
        </div>
      </div>
    );
  }
}

export default Players;
