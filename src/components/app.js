import React, { Component } from "react";
import "./app.css";
import Player from "./player";
import Deck from "./deck";
import {
  colors,
  suits,
  marks,
  straightCondition,
  flushCondition,
  stages
} from "./definitions";

class App extends Component {
  constructor(props) {
    super();

    this.populateUndealtCards();
  }

  undealtCards = [];

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

  populateUndealtCards = () => {
    marks.forEach(mark => {
      suits.forEach(suit => {
        this.undealtCards.push({ mark, suit });
      });
    });
  };

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

    marks.forEach(mark => {
      suits.forEach(suit => {
        this.undealtCards.push({ mark, suit });
      });
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
      let pair = this.getCardOf(player, 2);
      let three = this.getCardOf(player, 3);
      let quad = this.getCardOf(player, 4);

      if (flush) console.log(`${player.name} flushed with ${flush.color}`);

      if (straight)
        console.log(
          `${player.name} is straight from ${straight.from} to ${straight.to}`
        );

      if (highCard)
        console.log(`${player.name} has high card ${highCard.mark}`);

      if (pair.length) {
        let text = pair.map(mark => mark + "'s");

        text = text.join(" and ");

        console.log(`${player.name} has pair(s) of ${text}`);
      }

      if (three.length) {
        let text = three.map(mark => mark + "'s");

        text = text.join(" and ");

        console.log(`${player.name} has three-of-a-kind(s) of ${text}`);
      }

      if (quad.length) {
        let text = quad.map(mark => mark + "'s");

        text = text.join(" and ");

        console.log(`${player.name} has quad(s) of ${text}`);
      }
    });
  };

  checkHighCard = player => {
    const allCards = [...player.cards, ...this.state.deck];

    allCards.sort((a, b) => marks.indexOf(a.mark) - marks.indexOf(b.mark));

    return allCards[allCards.length - 1];
  };

  groupByMark = cards => {
    let groups = {};

    cards.forEach(card => {
      groups[card.mark] = groups[card.mark] || [];

      groups[card.mark].push(card);
    });

    return groups;
  };

  getCardOf = (player, length) => {
    const cards = [...player.cards, ...this.state.deck];
    let groups = this.groupByMark(cards);
    let selected = [];

    for (let key in groups) {
      let value = groups[key];

      if (value.length === length) selected.push(key);
    }

    return selected;
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
    let location = Math.floor(Math.random() * this.undealtCards.length);

    let pickedCard = this.undealtCards.splice(location, 1)[0];

    return pickedCard;
  };
}

export default App;
