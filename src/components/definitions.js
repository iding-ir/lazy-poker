export const colors = ["black", "red"];

export const shapes = ["diamond", "club", "heart", "spade"];

export const marks = [
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

export const suits = [
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

export const winningHands = [
  "high-card",
  "pair",
  "two-pairs",
  "three-of-a-kind",
  "straight",
  "flush",
  "full-house",
  "four-of-a-kind",
  "straight-flush",
  "royal-flush"
];

export const flushCondition = 5;
export const straightCondition = 5;

export const stages = [
  {
    slug: "new-round",
    title: "New Round",
    button: "Deal Preflop",
    icon: "filter_2"
  },
  {
    slug: "preflop",
    title: "Preflop",
    button: "Deal Flop",
    icon: "filter_3"
  },
  {
    slug: "flop",
    title: "Flop",
    button: "Deal Turn",
    icon: "filter_1"
  },
  {
    slug: "turn",
    title: "Turn",
    button: "Deal River",
    icon: "filter_1"
  },
  {
    slug: "river",
    title: "River",
    button: "See Result",
    icon: "flare"
  },
  {
    slug: "result",
    title: "Result",
    button: "New Round",
    icon: "refresh"
  }
];
