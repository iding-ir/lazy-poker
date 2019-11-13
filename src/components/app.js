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

const flushCondition = 5;
const straightCondition = 5;

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

  calculateRound = () => {
    this.state.players.filter((player, index) => {
      let flush = this.checkFlush(player);
      let straight = this.checkStraight(player);
      let highCard = this.checkHighCard(player);
      let onePair = this.checkOnePair(player);

      if (flush) console.log(`${player.name} flushed with ${flush.color}`);

      if (straight)
        console.log(
          `${player.name} is straight from ${straight.from} to ${straight.to}`
        );

      if (highCard)
        console.log(`${player.name} has high card ${highCard.mark}`);

      if (onePair) console.log(`${player.name} has a pair of ${highCard.mark}`);
    });
  };

  checkHighCard = player => {
    const allCards = [...player.cards, ...this.state.deck];

    allCards.sort((a, b) => marks.indexOf(a.mark) - marks.indexOf(b.mark));

    return allCards[allCards.length - 1];
  };

  checkOnePair = player => {
    const allCards = [...player.cards, ...this.state.deck];
    let hasOnePair = false;

    allCards.forEach(firstCard => {
      allCards.forEach(secondCard => {
        if (
          firstCard.mark === secondCard.mark &&
          firstCard.suit.shape !== secondCard.suit.shape
        )
          hasOnePair = { ...firstCard };
      });
    });

    return hasOnePair;
  };

  checkFlush = player => {
    const allCards = [...player.cards, ...this.state.deck];
    const colorExtract = allCards.map(card => card.suit.color);
    let flushed = false;

    colors.forEach((color, index) => {
      const count = colorExtract.reduce((total, cardColor) => {
        return cardColor === color ? total + 1 : total;
      }, 0);

      if (count >= flushCondition) flushed = { color, count };
    });

    return flushed;
  };

  checkStraight = player => {
    let allCards = [...player.cards, ...this.state.deck];
    let isStraight = false;

    let allMarks = allCards.map(item => item.mark);

    let uniqueMarks = allMarks.filter(
      (item, index) => allMarks.indexOf(item) === index
    );

    uniqueMarks.sort((a, b) => marks.indexOf(a) - marks.indexOf(b));

    uniqueMarks.forEach((card, index) => {
      let split = uniqueMarks.slice(index, index + straightCondition);

      if (split.length < straightCondition) return;

      let currentSum = split.reduce((total, item) => {
        return total + marks.indexOf(item) - marks.indexOf(split[0]);
      }, 0);

      const correctSum = (function(a, n) {
        let sum = 0;

        for (let i = a; i < a + n; i++) sum += i;

        return sum;
      })(0, straightCondition);

      if (currentSum === correctSum) {
        const from = split[0];
        const to = split[split.length - 1];

        isStraight = { from, to };
      }
    });

    return isStraight;
  };

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
