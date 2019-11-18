import React, { Component } from "react";
import "./ranking.css";

class Ranking extends Component {
  state = {};
  render() {
    return (
      <table className="ranking-table">
        <thead>
          <tr>
            <td>Player</td>
            <td>Points</td>
          </tr>
        </thead>

        <tbody>
          {this.props.players
            .sort((a, b) => {
              return b.points - a.points;
            })
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
