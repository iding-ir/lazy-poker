import React, { Component } from "react";
import "./app.css";
import Player from "./player";

class App extends Component {
  state = {
    players: [
      {
        name: "Player 1",
        cards: [],
        points: 0
      },
      {
        name: "Player 2",
        cards: [],
        points: 0
      }
    ]
  };

  render() {
    return (
      <div className="app">
        <div className="app-dashboard">
          <button onClick={this.handleDeal}>Deal</button>
        </div>

        <div className="app-players">
          {this.state.players.map((player, index) => {
            return <Player key={index} player={player} />;
          })}
        </div>
      </div>
    );
  }

  handleDeal = () => {
    const spots = ["heart", "spade", "diamond", "clubs"];
    const marks = [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "J",
      "Q",
      "K",
      "A"
    ];

    const cardsPerUser = 2;

    const state = this.state.players.map((player, index) => {
      player.cards = [];

      for (let i = 0; i < cardsPerUser; i++) {
        let mark = marks[Math.floor(Math.random() * marks.length)];
        let spot = spots[Math.floor(Math.random() * spots.length)];

        player.cards.push({ mark, spot });
      }

      return player;
    });

    this.setState(state);
  };
}

export default App;
