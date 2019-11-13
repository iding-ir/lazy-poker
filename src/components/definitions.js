export const colors = ["black", "red"];

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

export const flushCondition = 5;
export const straightCondition = 5;

export const stages = [
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
