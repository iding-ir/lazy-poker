import React, { Component } from "react";
import "./app.css";
import Player from "./player";
import Deck from "./deck";

const stages = ["New Round", "Preflop", "Flop", "Turn", "River", "Result"];
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

class App extends Component {
  state = {
    stage: 0,
    deck: [],
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
          <button onClick={this.handleDeal}>{this.getDealButtonText()}</button>
        </div>

        <div>
          <Deck
            stage={this.state.stage}
            title={stages[this.state.stage]}
            deck={this.state.deck}
          />
        </div>

        <div className="app-players">
          {this.state.players.map((player, index) => {
            return <Player key={index} player={player} />;
          })}
        </div>
      </div>
    );
  }

  getDealButtonText = () => {
    const labels = [
      "Deal Preflop",
      "Deal Flop",
      "Deal Turn",
      "Deal River",
      "Calculate",
      "Refresh"
    ];

    return labels[this.state.stage];
  };

  handleDeal = () => {
    const stage =
      this.state.stage + 1 === stages.length ? 0 : this.state.stage + 1;

    this.setState({
      stage: stage
    });

    switch (stage) {
      case 0:
        this.refreshRound();
        break;
      case 1:
        this.dealPreFlop();
        break;
      case 2:
        this.dealFlop();
        break;
      case 3:
        this.dealTurn();
        break;
      case 4:
        this.dealRiver();
        break;
      default:
        this.calculateRound();
    }
  };

  refreshRound = () => {
    const players = this.state.players.map(player => {
      player.cards = [];

      return player;
    });

    this.setState({
      stage: 0,
      deck: [],
      players: players
    });
  };

  dealPreFlop = () => {
    const cardsPerUser = 2;

    const players = this.state.players.map((player, index) => {
      player.cards = [];

      for (let i = 0; i < cardsPerUser; i++) {
        let mark = marks[Math.floor(Math.random() * marks.length)];
        let spot = spots[Math.floor(Math.random() * spots.length)];

        player.cards.push({ mark, spot });
      }

      return player;
    });

    this.setState({
      players: players
    });
  };

  dealFlop = () => {};
  dealTurn = () => {};
  dealRiver = () => {};
  calculateRound = () => {};
}

export default App;
