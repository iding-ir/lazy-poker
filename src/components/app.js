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
  state = {
    stage: 0,
    dealer: [],
    deck: [],
    players: [
      {
        name: "Player 1",
        id: "1",
        cards: [],
        points: 0
      },
      {
        name: "Player 2",
        id: "2",
        cards: [],
        points: 0
      }
    ]
  };

  componentDidMount() {
    let dealer = this.populateDealer();

    this.setState({ dealer });
  }

  render() {
    return (
      <div className="app">
        <div className="app-dashboard">
          <button onClick={this.handleDeal}>
            {stages[this.state.stage].button}
          </button>
        </div>

        <div className="app-tips">See results in browser console</div>

        <div className="app-table">
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

  populateDealer = () => {
    let dealer = [];

    marks.forEach(mark => {
      suits.forEach(suit => {
        let owner = "dealer";

        dealer.push({ mark, suit, owner });
      });
    });

    return dealer;
  };

  refreshRound = () => {
    const players = this.state.players.map(player => {
      player.cards = [];

      return player;
    });

    let dealer = this.populateDealer();

    this.setState({
      stage: 0,
      dealer,
      deck: [],
      players
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

  dealPreFlop = () => {
    const cardsPerUser = 2;

    const players = this.state.players.map((player, index) => {
      for (let i = 0; i < cardsPerUser; i++) {
        const card = this.getRandomCard();

        card.owner = player.id;

        player.cards.push(card);
      }

      return player;
    });

    this.setState({ players });
  };

  calculateRound = () => {
    this.state.players.forEach((player, index) => {
      const cards = [...player.cards, ...this.state.deck];

      for (let i = cards.length; i >= flushCondition; i--) {
        let flush = this.getSimilarCardsByColor(cards, i);

        if (flush.length) {
          flush.forEach(item => {
            console.log(
              `<${player.name}> has a flush of ${item.color}.`,
              item.cards
            );
          });

          return;
        }
      }

      let straight = this.checkStraight(player);

      if (straight) {
        console.log(
          `<${player.name}> is straight from ${straight.from} to ${straight.to}`
        );

        return;
      }

      let quads = this.getSimilarCardsByMark(cards, 4);

      if (quads.length) {
        quads.forEach(item => {
          console.log(
            `<${player.name}> has ${item.count} of a kind: ${item.mark}'s.`,
            item.cards
          );
        });

        return;
      }

      let fullhouseToaks = this.getSimilarCardsByMark(cards, 3);
      let fullhousepairs = this.getSimilarCardsByMark(cards, 2);

      if (fullhouseToaks.length >= 1 && fullhousepairs.length >= 1) {
        let text = `<${player.name}> has a full-house of `;

        fullhouseToaks.sort((a, b) => {
          return marks.indexOf(b.mark) - marks.indexOf(a.mark);
        });

        fullhousepairs.sort((a, b) => {
          return marks.indexOf(b.mark) - marks.indexOf(a.mark);
        });

        text =
          text + `${fullhouseToaks[0].mark}'s over ${fullhousepairs[0].mark}'s`;

        console.log(text);

        return;
      }

      let toaks = this.getSimilarCardsByMark(cards, 3);

      if (toaks.length >= 1) {
        let text = `<${player.name}> has three-of-a-kind of `;

        toaks.sort((a, b) => {
          return marks.indexOf(b.mark) - marks.indexOf(a.mark);
        });

        text = text + `${toaks[0].mark}'s`;

        console.log(text);

        return;
      }

      let pairs = this.getSimilarCardsByMark(cards, 2);

      if (pairs.length >= 2) {
        let text = `<${player.name}> has two pairs of `;
        let array = [];

        pairs.sort((a, b) => {
          return marks.indexOf(b.mark) - marks.indexOf(a.mark);
        });

        pairs.slice(0, 2).forEach(item => {
          array.push(`${item.mark}'s`);
        });

        text = text + array.join(" and ");

        console.log(text);

        return;
      }

      if (pairs.length === 1) {
        let pair = pairs[0];

        let text = `<${player.name}> has a pair: ${pair.mark}'s.`;

        console.log(text, pair.cards);

        return;
      }

      let highCard = this.checkHighestCard(cards, player);

      if (highCard) {
        let text = `<${player.name}> has high card ${highCard.mark}`;

        console.log(text);

        return;
      }
    });
  };

  checkHighestCard = cards => {
    cards.sort((a, b) => marks.indexOf(b.mark) - marks.indexOf(a.mark));

    let highestCard = cards[0];

    return highestCard;
  };

  groupByMark = cards => {
    let groups = {};

    cards.forEach(card => {
      groups[card.mark] = groups[card.mark] || [];

      groups[card.mark].push(card);
    });

    return groups;
  };

  groupByShape = cards => {
    let groups = {};

    cards.forEach(card => {
      groups[card.suit.shape] = groups[card.suit.shape] || [];

      groups[card.suit.shape].push(card);
    });

    return groups;
  };

  groupByColor = cards => {
    let groups = {};

    cards.forEach(card => {
      groups[card.suit.color] = groups[card.suit.color] || [];

      groups[card.suit.color].push(card);
    });

    return groups;
  };

  getSimilarCardsByMark = (cards, number) => {
    let groups = this.groupByMark(cards);
    let selected = [];

    for (let key in groups) {
      let group = groups[key];

      if (group.length === number)
        selected.push({
          count: number,
          mark: key,
          cards: group
        });
    }

    return selected;
  };

  getSimilarCardsByColor = (cards, number) => {
    let groups = this.groupByColor(cards);
    let selected = [];

    for (let key in groups) {
      let group = groups[key];

      if (group.length === number)
        selected.push({
          count: number,
          color: key,
          cards: group
        });
    }

    return selected;
  };

  getSimilarCardsByShape = (cards, number) => {
    let groups = this.groupByShape(cards);
    let selected = [];

    for (let key in groups) {
      let group = groups[key];

      if (group.length === number)
        selected.push({
          count: number,
          shape: key,
          cards: group
        });
    }

    return selected;
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

      card.owner = "deck";

      deck.push(card);
    }

    this.setState({ deck });
  };

  getRandomCard = () => {
    let location = Math.floor(Math.random() * this.state.dealer.length);

    let pickedCard = this.state.dealer.splice(location, 1)[0];

    return pickedCard;
  };

  sortCardsByMark = cards => {
    return [...cards].sort((a, b) => {
      return marks.indexOf(a.mark) - marks.indexOf(b.mark);
    });
  };
}

export default App;
