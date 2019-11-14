import React, { Component } from "react";
import "./app.css";
import Player from "./player";
import Deck from "./deck";
import {
  colors,
  shapes,
  marks,
  suits,
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

        dealer.push({ mark, ...suit, owner });
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
      const cards = this.sortCardsByMark([...player.cards, ...this.state.deck]);

      let flush = this.checkFlush(cards);
      console.log(flush);

      if (flush) {
        let kick = flush[0].mark;
        let color = flush[0].color;
        let text = `<${player.name}> has flush of ${color} kicking to ${kick}`;

        console.log(text, flush);

        return;
      }

      let straight = this.checkStraight(cards);

      if (straight) {
        let text = `<${player.name}> is straight from ${straight.from} to ${straight.to}`;

        console.log(text, straight.cards);

        return;
      }

      let quads = this.getSimilarCardsByMark(cards, 4);

      if (quads.length >= 1) {
        let first = quads[0];
        let text = `<${player.name}> has a quad of ${first.mark}'s`;

        console.log(text, first.cards);

        return;
      }

      let fullhouseToaks = this.getSimilarCardsByMark(cards, 3);
      let fullhousepairs = this.getSimilarCardsByMark(cards, 2);

      if (
        (fullhouseToaks.length === 1 && fullhousepairs.length >= 1) ||
        fullhouseToaks.length >= 2
      ) {
        let first = fullhouseToaks[0];
        let second =
          fullhouseToaks.length >= 2 ? fullhouseToaks[1] : fullhousepairs[0];
        let text = `<${player.name}> has a full-house of ${first.mark}'s over ${second.mark}'s`;

        console.log(text, first.cards, second.cards);

        return;
      }

      let toaks = this.getSimilarCardsByMark(cards, 3);

      if (toaks.length >= 1) {
        let first = toaks[0];
        let text = `<${player.name}> has a three-of-a-kind of ${first.mark}'s`;

        console.log(text, first.cards);

        return;
      }

      let pairs = this.getSimilarCardsByMark(cards, 2);

      if (pairs.length >= 2) {
        let first = pairs[0];
        let second = pairs[1];
        let text = `<${player.name}> has two pairs of ${first.mark}'s and ${second.mark}'s`;

        console.log(text, first.cards, second.cards);

        return;
      }

      if (pairs.length === 1) {
        let first = pairs[0];
        let text = `<${player.name}> has a pair: ${first.mark}'s.`;

        console.log(text, first.cards);

        return;
      }

      let highCard = cards[0];

      let text = `<${player.name}> has high card ${highCard.mark}`;

      console.log(text, highCard);
    });
  };

  groupByMark = cards => {
    let groups = [];

    marks.forEach(mark => {
      let group = [];

      cards.forEach(card => {
        if (card.mark === mark) group.push(card);
      });

      if (group.length) groups.push(group);
    });

    return groups;
  };

  getSimilarCardsByMark = (cards, number) => {
    let groups = this.groupByMark(cards);
    let selected = [];

    groups.forEach(group => {
      if (group.length === number)
        selected.push({
          count: number,
          mark: group[0].mark,
          cards: group
        });
    });

    return selected;
  };

  checkFlush = cards => {
    let isFlush = false;

    colors.forEach(color => {
      let match = cards.filter(card => {
        return card.color === color;
      });

      if (match.length >= flushCondition) isFlush = match;
    });

    return isFlush;
  };

  checkStraight = cards => {
    let isStraight = false;

    let allMarks = cards.map(item => item.mark);

    let uniqueMarks = allMarks.filter(
      (item, index) => allMarks.indexOf(item) === index
    );

    uniqueMarks.sort((a, b) => marks.indexOf(a) - marks.indexOf(b));

    uniqueMarks.forEach((mark, index) => {
      let split = uniqueMarks.slice(index, index + straightCondition);

      if (split.length < straightCondition) return;

      const currentSum = split.reduce((total, item) => {
        return total + marks.indexOf(item) - marks.indexOf(split[0]);
      }, 0);

      const correctSum = (function(start, length) {
        let sum = 0;

        for (let i = start; i < start + length; i++) sum += i;

        return sum;
      })(0, straightCondition);

      if (currentSum === correctSum) {
        const from = split[0];
        const to = split[split.length - 1];
        const match = cards.filter(
          card =>
            marks.indexOf(card.mark) >= marks.indexOf(from) &&
            marks.indexOf(card.mark) <= marks.indexOf(to)
        );

        isStraight = { from, to, cards: match };
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
      return marks.indexOf(b.mark) - marks.indexOf(a.mark);
    });
  };
}

export default App;
