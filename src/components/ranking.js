import React, { Component } from "react";

import "./ranking.css";

class Ranking extends Component {
  state = {};
  render() {
    let players = [...this.props.players];

    return (
      <table className="ranking-table">
        <thead>
          <tr>
            <th>Player</th>
            <th>Points</th>
          </tr>
        </thead>

        <tbody>
          {players
            .sort((a, b) => {
              return b.points - a.points;
            })
            .slice(0, 3)
            .map((player, index) => {
              return (
                <tr key={index}>
                  <td>{player.name}</td>
                  <td>{player.points}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    );
  }
}

export default Ranking;
