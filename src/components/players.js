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
      canRemovePlayer
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
                canRemovePlayer={canRemovePlayer}
              />
            );
          })}
        </div>

        <div className="players-add">
          <button
            id="players-add"
            disabled={!canAddPlayer}
            className="waves-effect waves-light btn-large btn-floating red"
            onClick={onAddPlayer}
          >
            <i className="material-icons left"></i>
            Add Player
          </button>
        </div>
      </div>
    );
  }
}

export default Players;
