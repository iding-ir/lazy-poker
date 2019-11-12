import React, { Component } from "react";
import "./app.css";
import Player from "./player";
import Deck from "./deck";

const colors = ["black", "red"];

const suits = [
  {
    shape: "diamond",
    color: "red"
  },
  {
    shape: "club",
    color: "black"
  },
  {
    shape: "heart",
    color: "red"
  },
  {
    shape: "spade",
    color: "black"
  }
];

const marks = [
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

const stages = [
  {
    slug: "new-round",
    title: "New Round",
    button: "Deal Preflop"
  },
  {
    slug: "preflop",
    title: "Preflop",
    button: "Deal Flop"
  },
  {
    slug: "flop",
    title: "Flop",
    button: "Deal Turn"
  },
  {
    slug: "turn",
    title: "Turn",
    button: "Deal River"
  },
  {
    slug: "river",
    title: "River",
    button: "See Result"
  },
  {
    slug: "result",
    title: "Result",
    button: "New Round"
  }
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
          <button onClick={this.handleDeal}>
            {stages[this.state.stage].button}
          </button>
        </div>

        <div>
          <Deck
            stage={this.state.stage}
            title={stages[this.state.stage].title}
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

  handleDeal = () => {
    const stage =
      this.state.stage + 1 === stages.length ? 0 : this.state.stage + 1;

    this.setState({ stage });

    switch (stages[stage].slug) {
      case "new-round":
        this.refreshRound();
        break;
      case "preflop":
        this.dealPreFlop();
        break;
      case "flop":
        this.dealToDeck(3);
        break;
      case "turn":
        this.dealToDeck(1);
        break;
      case "river":
        this.dealToDeck(1);
        break;
      case "result":
        this.calculateRound();
        break;
      default:
      // default
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
      players
    });
  };

  dealPreFlop = () => {
    const cardsPerUser = 2;

    const players = this.state.players.map((player, index) => {
      for (let i = 0; i < cardsPerUser; i++) {
        const card = this.getRandomCard();

        player.cards.push(card);
      }

      return player;
    });

    this.setState({ players });
  };

  calculateRound = () => {};

  dealToDeck = n => {
    const deck = [...this.state.deck];

    for (let i = 0; i < n; i++) {
      const card = this.getRandomCard();

      deck.push(card);
    }

    this.setState({ deck });
  };

  getRandomCard = () => {
    let mark = marks[Math.floor(Math.random() * marks.length)];
    let suit = suits[Math.floor(Math.random() * suits.length)];

    return { mark, suit };
  };
}

export default App;
