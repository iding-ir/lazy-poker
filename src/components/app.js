import React, { Component } from "react";
import "materialize-css/dist/css/materialize.min.css";
import M from "materialize-css";
import "./app.css";
import Players from "./players";
import Ranking from "./ranking";
import Deck from "./deck";
import Controls from "./controls";
import Navbar from "./navbar";
import {
  colors,
  marks,
  suits,
  straightCondition,
  flushCondition,
  winningHands,
  stages,
  initialNumberOfPlayers,
  minNumberOfPlayers,
  maxNumberOfPlayers
} from "./definitions";

class App extends Component {
  state = {};

  game = {
    stage: 0,
    dealer: [],
    deck: [null, null, null, null, null],
    logs: [],
    players: [],
    autoplayIsEnabled: false,
    dealIsDisabled: false,
    gameHasStarted: false
  };

  player = {
    name: "Player",
    id: "1",
    round: {
      cards: [null, null],
      winner: false,
      bests: [],
      hand: undefined
    },
    points: 0
  };

  componentWillMount() {
    let state = this.generateState();

    this.setState(state);
  }

  componentDidMount() {
    this.runAutoplay();
  }

  render() {
    let { logs, deck, players, gameHasStarted } = this.state;

    return (
      <div className="app-container blue-grey lighten-4">
        <header className="app-header">
          <Navbar />
        </header>

        <div className="app-controls blue-grey lighten-5">
          <Controls
            state={this.state}
            onDeal={this.handleDeal}
            onAutoplay={this.toggleAutoplay}
            onRestart={this.handleRestart}
            logs={logs}
          />
        </div>

        <div className="app-ranking blue-grey lighten-5">
          <Ranking players={players} />
        </div>

        <div className="app-deck blue-grey lighten-5">
          <Deck deck={deck} />
        </div>

        <div className="app-players blue-grey lighten-5">
          <Players
            players={players}
            canAddPlayer={
              players.length < maxNumberOfPlayers && !gameHasStarted
            }
            onAddPlayer={this.handleAddPlayer}
            canRemovePlayer={players.length > minNumberOfPlayers}
            onRemovePlayer={this.handleRemovePlayer}
            onChangeName={this.handleChangeName}
          />
        </div>
      </div>
    );
  }

  generateState = () => {
    let state = JSON.parse(JSON.stringify(this.game));

    state.players = this.populatePlayers(initialNumberOfPlayers);
    state.dealer = this.populateDealer();

    return state;
  };

  populatePlayers = number => {
    let players = [];

    for (let i = 1; i <= number; i++) {
      let id = i;
      let name = "Player " + i;
      let player = this.generatePlayer(id, name);

      players.push(player);
    }

    return players;
  };

  generatePlayer = (id, name) => {
    let player = JSON.parse(JSON.stringify(this.player));

    player.name = name;
    player.id = id;

    return player;
  };

  populateDealer = () => {
    let dealer = [];

    marks.forEach(mark => {
      suits.forEach(suit => {
        let owner = "dealer";

        dealer.push({ mark, ...suit, owner, highlight: false });
      });
    });

    return dealer;
  };

  handleDeal = () => {
    const gameHasStarted = true;
    const stage =
      this.state.stage + 1 === stages.length ? 0 : this.state.stage + 1;

    this.setState({ stage, gameHasStarted });

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

  runAutoplay = () => {
    setInterval(() => {
      if (!this.state.autoplayIsEnabled) return;
      if (this.state.dealIsDisabled) return;

      this.handleDeal();
    }, 2000);
  };

  toggleAutoplay = () => {
    let autoplayIsEnabled = !this.state.autoplayIsEnabled;
    // let dealIsDisabled = autoplayIsEnabled && true;

    this.setState({ autoplayIsEnabled });
  };

  handleRestart = () => {
    let state = this.generateState();

    this.setState(state);
  };

  handleAddPlayer = () => {
    let players = [...this.state.players];
    let number = players.length + 1;

    if (number > maxNumberOfPlayers) return;

    let id =
      this.state.players
        .map(player => parseInt(player.id))
        .sort((a, b) => b - a)[0] + 1;

    let name = "Player " + id;
    let player = this.generatePlayer(id, name);

    players.push(player);

    this.setState({ players });
  };

  handleRemovePlayer = id => {
    let currentPlayers = [...this.state.players];

    if (currentPlayers.length === 1) return;

    let players = currentPlayers.filter(player => {
      return player.id === id ? false : true;
    });

    this.setState({ players });
  };

  handleChangeName = (player, name) => {
    let players = [...this.state.players];

    players.forEach(p => {
      if (p.id === player.id && name.length <= 15) p.name = name;
    });

    this.setState({ players });
  };

  refreshRound = () => {
    const players = this.state.players.map(player => {
      player.round = {
        cards: [null, null],
        winner: false,
        bests: [],
        hand: undefined
      };

      return player;
    });

    let dealer = this.populateDealer();

    this.setState({
      dealIsDisabled: false,
      stage: 0,
      dealer,
      deck: [null, null, null, null, null],
      players
    });
  };

  dealPreFlop = () => {
    const cardsPerUser = 2;

    const players = this.state.players.map(player => {
      for (let i = 0; i < cardsPerUser; i++) {
        const card = this.getRandomCard();

        card.owner = player.id;

        let start = player.round.cards.indexOf(null);

        player.round.cards.splice(start, 1, card);
      }

      return player;
    });

    this.setState({ players });
  };

  dealToDeck = number => {
    const deck = [...this.state.deck];

    for (let i = 0; i < number; i++) {
      const card = this.getRandomCard();

      card.owner = "deck";

      let start = deck.indexOf(null);

      deck.splice(start, 1, card);
    }

    this.setState({ deck });
  };

  getRandomCard = () => {
    let dealer = this.state.dealer;
    let randomLocation = Math.floor(Math.random() * dealer.length);
    let randomCard = dealer.splice(randomLocation, 1)[0];

    return randomCard;
  };

  calculateRound = () => {
    let players = [...this.state.players];
    let reportDuration = 3000;

    this.setState({ dealIsDisabled: true });

    setTimeout(() => {
      if (!this.state.gameHasStarted) return;

      this.setState({ dealIsDisabled: false });
    }, players.length * reportDuration);

    players.forEach((player, index) => {
      let text;

      const cards = this.sortCardsByMarkDescending([
        ...player.round.cards,
        ...this.state.deck
      ]);

      let straight = this.checkStraight(cards);
      let straightFlush = straight ? this.checkFlush(straight) : false;
      let flush = this.checkFlush(cards);
      let quads = this.getSimilarCardsByMark(cards, 4);
      let toaks = this.getSimilarCardsByMark(cards, 3);
      let pairs = this.getSimilarCardsByMark(cards, 2);
      let highCard = cards[0];

      if (straightFlush) {
        // royal-flush & straight-flush

        let from = straight[straight.length - 1].mark;
        let to = straight[0].mark;
        let hand =
          to === marks[marks.length - 1] ? "royal-flush" : "straight-flush";

        player.round.bests = straight;
        player.round.hand = hand;

        let badge = this.logBadge(player.round.hand);

        text =
          `${player.name} has a ${hand} from ${from} to ${to} ${badge} ` +
          badge;
      } else if (quads.length >= 1) {
        // four-of-a-kind

        let cards1 = quads[0];

        player.round.bests = this.addHighCards(cards, cards1);
        player.round.hand = "four-of-a-kind";

        let badge = this.logBadge(player.round.hand);

        text = `${player.name} has four ${cards1[0].mark}'s ` + badge;
      } else if (
        (toaks.length === 1 && pairs.length >= 1) ||
        toaks.length >= 2
      ) {
        // full-house

        let cards1 = toaks[0];
        let cards2 = toaks.length >= 2 ? toaks[1] : pairs[0];

        player.round.bests = [...cards1, ...cards2.slice(0, 2)];
        player.round.hand = "full-house";

        let badge = this.logBadge(player.round.hand);

        text =
          `${player.name} has a full-house of ${cards1[0].mark}'s over ${cards2[0].mark}'s ` +
          badge;
      } else if (flush) {
        // flush

        let kick = flush[0].mark;
        let color = flush[0].color;

        player.round.bests = flush;
        player.round.hand = "flush";

        let badge = this.logBadge(player.round.hand);

        text =
          `${player.name} has flush of ${color} kicking to ${kick} ` + badge;
      } else if (straight) {
        // straight

        let from = straight[straight.length - 1].mark;
        let to = straight[0].mark;

        player.round.bests = straight;
        player.round.hand = "straight";

        let badge = this.logBadge(player.round.hand);

        text = `${player.name} has a straight from ${from} to ${to} ` + badge;
      } else if (toaks.length >= 1) {
        // three-of-a-kind

        let cards1 = toaks[0];

        player.round.bests = this.addHighCards(cards, cards1);
        player.round.hand = "three-of-a-kind";

        let badge = this.logBadge(player.round.hand);

        text =
          `${player.name} has a three-of-a-kind of ${cards1[0].mark}'s ` +
          badge;
      } else if (pairs.length >= 2) {
        // two-pairs

        let cards1 = pairs[0];
        let cards2 = pairs[1];

        player.round.bests = this.addHighCards(cards, [...cards1, ...cards2]);
        player.round.hand = "two-pairs";

        let badge = this.logBadge(player.round.hand);

        text =
          `${player.name} has two pairs of ${cards1[0].mark}'s and ${cards2[0].mark}'s ` +
          badge;
      } else if (pairs.length === 1) {
        // pair

        let cards1 = pairs[0];

        player.round.bests = this.addHighCards(cards, cards1);
        player.round.hand = "pair";

        let badge = this.logBadge(player.round.hand);

        text = `${player.name} has a pair of ${cards1[0].mark}'s. ` + badge;
      } else {
        // high-card

        player.round.bests = this.addHighCards(cards, [highCard]);
        player.round.hand = "high-card";

        let badge = this.logBadge(player.round.hand);

        text = `${player.name} has high card ${highCard.mark} ` + badge;
      }

      setTimeout(() => {
        if (!this.state.gameHasStarted) return;

        this.addLog(text, reportDuration + 1000);

        this.givePoints(player);
      }, index * reportDuration);
    });
  };

  logBadge = hand => {
    let points = winningHands
      .map(winningHand => winningHand.hand)
      .indexOf(hand);

    return `<button class="btn-flat toast-action">${points} Points</button>`;
  };

  sortCardsByMarkDescending = cards => {
    return [...cards].sort((a, b) => {
      return marks.indexOf(b.mark) - marks.indexOf(a.mark);
    });
  };

  sortCardsByMarkAscending = cards => {
    return [...cards].sort((a, b) => {
      return marks.indexOf(a.mark) - marks.indexOf(b.mark);
    });
  };

  checkStraight = cards => {
    let uniqueCards = this.removeDuplicateCardsByMark(cards);
    let counter = 1;
    let result = [];

    uniqueCards = this.sortCardsByMarkDescending(uniqueCards);

    uniqueCards.forEach((card, index) => {
      if (uniqueCards[index + 1] === undefined) return;
      if (counter > straightCondition) return;

      let nextInStack = uniqueCards[index + 1].mark;
      let nextShouldBe = marks[marks.indexOf(uniqueCards[index].mark) - 1];

      if (nextInStack === nextShouldBe) {
        counter += 1;

        result.push(card);
      } else {
        counter = 1;

        result = [];
      }
    });

    return result.length === straightCondition ? result : false;
  };

  checkFlush = cards => {
    let isFlush = false;

    colors.forEach(color => {
      let match = cards.filter(card => {
        return card.color === color;
      });

      if (match.length >= flushCondition)
        isFlush = match.slice(0, flushCondition);
    });

    return isFlush;
  };

  getSimilarCardsByMark = (cards, number) => {
    let groups = this.groupByMark(cards);
    let selected = groups.filter(group => group.length === number);

    return selected;
  };

  groupByMark = cards => {
    let groups = [];

    marks.forEach(mark => {
      let group = cards.filter(card => card.mark === mark);

      if (group.length) groups.unshift(group);
    });

    return groups;
  };

  removeDuplicateCardsByMark = cards => {
    let output = {};

    cards.forEach(item => {
      output[item.mark] = item;
    });

    return Object.values(output);
  };

  addHighCards = (from, to) => {
    let combined = [...to, ...from];

    let stringifiedCard = combined.map(item => JSON.stringify(item));

    let uniqueCards = stringifiedCard.filter(
      (card, index) => stringifiedCard.indexOf(card) === index
    );

    let cards = uniqueCards.map(item => JSON.parse(item)).slice(0, 5);

    return cards;
  };

  addLog = (text, duration) => {
    M.toast({ html: text, displayLength: duration });

    let logs = [...this.state.logs];

    logs.unshift({
      text: text,
      icon: "insert_comment"
    });

    this.setState({ logs });

    return logs;
  };

  givePoints = player => {
    let players = [...this.state.players];
    let deck = [...this.state.deck];

    players.forEach(p => {
      if (p.id === player.id) {
        p.points += winningHands
          .map(winningHand => winningHand.hand)
          .indexOf(player.round.hand);
      }

      p.round.cards.forEach(c => {
        c.highlight = false;

        if (p.id === player.id) {
          player.round.bests.forEach(card => {
            if (JSON.stringify(c) === JSON.stringify(card)) {
              c.highlight = true;
            }
          });
        }
      });
    });

    deck.forEach(c => {
      c.highlight = false;

      player.round.bests.forEach(card => {
        if (JSON.stringify(c) === JSON.stringify(card)) {
          c.highlight = true;
        }
      });
    });

    this.setState({ deck, players });
  };
}

export default App;
