import React, { Component } from "react";
import $ from "jquery/dist/jquery";
import "materialize-css/dist/css/materialize.min.css";
import M from "materialize-css";
import "./app.css";
import Players from "./players";
import Deck from "./deck";
import Logs from "./logs";
import Navbar from "./navbar";
import {
  colors,
  shapes,
  marks,
  suits,
  straightCondition,
  flushCondition,
  winningHands,
  stages
} from "./definitions";

class App extends Component {
  state = {
    stage: 0,
    dealer: [],
    deck: [],
    players: [
      // {
      //   name: "Player 1",
      //   id: "1",
      //   winner: false,
      //   cards: [],
      //   bests: [],
      //   result: {},
      //   points: 0
      // },
      // {
      //   name: "Player 2",
      //   id: "2",
      //   cards: [],
      //   round: {
      //     winner: false,
      //     bests: [],
      //     hand: undefined
      //   },
      //   points: 0
      // },
      {
        name: "Player 3",
        id: "3",
        cards: [],
        round: {
          winner: false,
          bests: [],
          hand: undefined
        },
        points: 0
      }
    ],
    logs: []
  };

  componentDidMount() {
    let dealer = this.populateDealer();

    this.setState({ dealer });
  }

  render() {
    return (
      <div className="app-container">
        <header className="app-header">
          <Navbar />
        </header>

        <div className="app-controls blue-grey lighten-5">
          <button
            className="waves-effect waves-light btn-large"
            onClick={this.handleDeal}
          >
            <i className="material-icons left">
              {stages[this.state.stage].icon}
            </i>
            {stages[this.state.stage].button}
          </button>

          <Logs logs={this.state.logs} />
        </div>

        <div className="app-deck blue-grey lighten-5">
          <Deck deck={this.state.deck} />
        </div>

        <div className="app-players blue-grey lighten-5">
          <Players players={this.state.players} />
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
    let logs = [...this.state.logs];
    let players = [...this.state.players];

    players.forEach((player, index) => {
      const cards = this.sortCardsByMark([...player.cards, ...this.state.deck]);

      let straight = this.checkStraight(cards);

      if (straight) {
        let straightFlush = this.checkFlush(straight);

        if (straightFlush) {
          let from = straight[straight.length - 1].mark;
          let to = straight[0].mark;
          let hand =
            to === marks[marks.length - 1] ? "royal-flush" : "straight-flush";
          let text = `${player.name} has a ${hand} from ${from} to ${to}`;

          player.round.bests = straight;
          player.round.hand = hand;

          console.log(text, straight);

          logs = this.addLog(logs, { text, icon: "insert_comment" });

          return;
        }
      }

      let flush = this.checkFlush(cards);

      if (flush) {
        let kick = flush[0].mark;
        let color = flush[0].color;
        let text = `${player.name} has flush of ${color} kicking to ${kick}`;

        player.round.bests = flush;
        player.round.hand = "flush";

        console.log(text, flush);

        logs = this.addLog(logs, { text, icon: "insert_comment" });

        return;
      }

      if (straight) {
        let from = straight[straight.length - 1].mark;
        let to = straight[0].mark;
        let text = `${player.name} has a straight from ${from} to ${to}`;

        player.round.bests = straight;
        player.round.hand = "straight";

        console.log(text, straight);

        logs = this.addLog(logs, { text, icon: "insert_comment" });

        return;
      }

      let quads = this.getSimilarCardsByMark(cards, 4);

      if (quads.length >= 1) {
        let first = quads[0];
        let text = `${player.name} has a quad of ${first.mark}'s`;

        player.round.bests = [...first.cards];
        player.round.hand = "four-of-a-kind";

        console.log(text, first.cards);

        logs = this.addLog(logs, { text, icon: "insert_comment" });

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
        let text = `${player.name} has a full-house of ${first.mark}'s over ${second.mark}'s`;

        // let secondLeg = fullhousepairs[0] || fullhouseToaks[1];

        // player.round.bests = [...fullhouseToaks[0], ...secondLeg];
        player.round.hand = "full-house";

        console.log(text, first.cards, second.cards);

        logs = this.addLog(logs, { text, icon: "insert_comment" });

        return;
      }

      let toaks = this.getSimilarCardsByMark(cards, 3);

      if (toaks.length >= 1) {
        let first = toaks[0];
        let text = `${player.name} has a three-of-a-kind of ${first.mark}'s`;

        player.round.bests = [...first.cards];
        player.round.hand = "three-of-a-kind";

        console.log(text, first.cards);

        logs = this.addLog(logs, { text, icon: "insert_comment" });

        return;
      }

      let pairs = this.getSimilarCardsByMark(cards, 2);

      if (pairs.length >= 2) {
        let first = pairs[pairs.length - 1];
        let second = pairs[pairs.length - 2];
        let text = `${player.name} has two pairs of ${first.mark}'s and ${second.mark}'s`;

        player.round.bests = [...first.cards, ...second.cards];
        player.round.hand = "two-pairs";

        console.log(text, first.cards, second.cards);

        logs = this.addLog(logs, { text, icon: "insert_comment" });

        return;
      }

      if (pairs.length === 1) {
        let first = pairs[0];
        let text = `${player.name} has a pair: ${first.mark}'s.`;

        player.round.bests = [...first.cards];
        player.round.hand = "pair";

        console.log(text, first.cards);

        logs = this.addLog(logs, { text, icon: "insert_comment" });

        return;
      }

      let highCard = cards[0];
      let text = `${player.name} has high card ${highCard.mark}`;

      player.round.bests = [highCard];
      player.round.hand = "high-card";

      console.log(text, highCard);

      logs = this.addLog(logs, { text, icon: "insert_comment" });
    });

    this.setState({ logs });

    this.decideWinner(players);
  };

  decideWinner = players => {
    console.log("players", players);

    let ordered = [...players];
    let winners = undefined;

    ordered.sort((a, b) => {
      return (
        winningHands.indexOf(b.round.hand) - winningHands.indexOf(a.round.hand)
      );
    });

    console.log("ordered", ordered);

    let winningHand = ordered[0].round.hand;

    console.log(winningHand);

    let possibleWinners = players.filter(
      player => player.round.hand === winningHand
    );

    console.log("possibleWinners", possibleWinners);

    if (possibleWinners.length > 10) {
      if (
        winningHand === "high-card" ||
        winningHand === "flush" ||
        winningHand === "straight" ||
        winningHand === "straight-flush" ||
        winningHand === "royal-flush"
      ) {
        let cards = this.mergePlayersBests(possibleWinners);

        let mark = this.sortCardsByMark(cards)[0].mark;

        winners = this.playersHaveKicker(possibleWinners, mark);

        if (winners.length === 0) winners = possibleWinners;
      }

      if (
        winningHand === "pair" ||
        winningHand === "three-of-a-kind" ||
        winningHand === "four-of-a-kind"
      ) {
        let cards = this.mergePlayersBests(possibleWinners);

        let mark = this.sortCardsByMark(cards)[0].mark;

        winners = this.playersHaveKicker(possibleWinners, mark);

        if (winners.length === 0) winners = possibleWinners;
      }
    } else {
      winners = possibleWinners;
    }

    players.forEach(player => {
      winners.forEach(winner => {
        if (player.id === winner.id) {
          player.points += 1;

          player.round.winner = true;

          this.highlight(player);
        }
      });
    });

    this.setState({ players });
  };

  playersHaveKicker = (players, mark) => {
    let clone = [...players];

    let result = clone.filter(player => {
      return player.round.kicker.mark === mark;
    });

    return result;
  };

  mergePlayersBests = players => {
    let result = players.reduce((total, player) => {
      total.push(...player.round.bests);

      return total;
    }, []);

    return result;
  };

  mergePlayersCards = players => {
    let result = players.reduce((total, player) => {
      total.push(...player.cards);

      return total;
    }, []);

    return result;
  };

  mergePlayersHigh = players => {
    let result = players.reduce((total, player) => {
      total.push(player.round.kicker);

      return total;
    }, []);

    return result;
  };

  highlight = player => {
    player.cards.forEach((card, index) => {
      player.round.bests.forEach((c, i) => {
        if (JSON.stringify(card) === JSON.stringify(c))
          player.cards[index].highlight = true;
      });
    });

    let deck = [...this.state.deck];

    deck.forEach((card, index) => {
      player.round.bests.forEach((c, i) => {
        if (JSON.stringify(card) === JSON.stringify(c))
          deck[index].highlight = true;
      });
    });

    let players = [...this.state.players];

    players.forEach((p, i) => {
      if (p.id === player.id) players[i] = player;
    });

    this.setState({ players });
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

      if (match.length >= flushCondition) isFlush = match.slice(0, 5);
    });

    return isFlush;
  };

  getUniqueCardsByMark = cards => {
    let output = {};

    cards.forEach(item => {
      output[item.mark] = item;
    });

    output = Object.values(output);

    output = this.sortCardsByMark(output);

    return output;
  };

  checkStraight = cards => {
    let uniqueCards = this.getUniqueCardsByMark(cards);
    let counter = 1;
    let result = [];

    uniqueCards.forEach((card, index) => {
      if (uniqueCards[index + 1] === undefined) return;
      if (counter > straightCondition) return;
      if (
        uniqueCards[index + 1].mark ===
        marks[marks.indexOf(uniqueCards[index].mark) - 1]
      ) {
        counter += 1;

        result.push(card);
      } else {
        counter = 1;

        result = [];
      }
    });

    return result.length === straightCondition ? result : false;
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

  addLog = (logs, log) => {
    M.toast({ html: log.text, displayLength: 3000 });

    logs.unshift({
      text: log.text,
      icon: "insert_comment"
    });

    return logs;
  };
}

export default App;
