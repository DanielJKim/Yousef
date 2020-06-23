class Game {
  /**
   * @type Player[]
   * @description List of players in the game.
   */
  players = [];

  /**
   * @type Card[]
   * @description Deck used in the game.
   */
  deck = [];

  /**
   * @type Card[]
   * @description Discard pile.
   */
  discardPile = [];

  /**
   * @type number
   * @description Id of the player whose turn it is.
   */
  playerTurn;

  /**
   * @type number
   * @description The round of the game.
   */
  round = 0;

  /**
   * @type number
   * @description The maximum number of seconds a turn can take.
   */
  turnTime;

  /**
   * @type number
   * @description The number of cards each player starts with.
   */
  numInitCards;

  constructor() {
  }

  /**
   * Sets the player turn to the next player.
   */
  nextPlayerTurn() {
    if (this.playerTurn === this.players.length - 1) {
      this.playerTurn = 0;
    } else {
      this.playerTurn += 1;
    }
  }

  /**
   * Removes the last card in the deck and returns it.
   */
  popDeck() {
    return this.deck.pop();
  }

  /**
   * Removes the last card in the discard pile and returns it.
   */
  popDiscardPile() {
    return this.discardPile.pop();
  }

  /**
   * Adds a card to the discard pile.
   * @param {Card} card The card to add to the discard pile.
   */
  discardCard(card) {
    this.discardPile.push(card);
  }

  /**
   * Removes a player from the game.
   * @param {Player} player The player to remove.
   */
  removePlayer(player) {
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].id === player.id) {
        this.players.splice(i, 1);
      }
    }
  }

  /**
   * Adds a player to the game.
   * @param {Player} player The player to add.
   */
  addPlayer(player) {
    this.players.push(player);
  }

  /**
   * Creates a deck of the type specified for the game.
   * @param {DeckType} deckType The type of deck to create.
   */
  createDeck(deckType) {
    switch (deckType) {
      case DeckType.STANDARD:
        return createStandardDeck();

      case DeckType.JOKERS:
        return createStandardDeckWithJokers();

      default:
        return createStandardDeck();
    }
  }

  /**
   * Shuffles a deck.
   * @param {Card[]} deck The deck to shuffle.
   */
  shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }

  /**
   * Sets a deck for the game.
   * @param {DecType} deckType The type of deck to set.
   */
  setDeck(deckType) {
    this.deck = this.shuffleDeck(this.createDeck(deckType));
  }
}

class Player {
  /**
   * @type number
   * @description Id of the player.
   */
  id;

  /**
   * @type string
   * @description Name of the player.
   */
  name;

  /**
   * @type Card[]
   * @description List of cards in the player's hand.
   */
  hand = [];

  /**
   * @type number
   * @description Number of points the player has.
   */
  points = 0;

  constructor(id, name) {
    this.id = id;
    this.name = name;
  }

  /**
   * Adds a card to the player's hand.
   * @param {Card} card The card to add.
   */
  addToHand(card) {
    this.hand.push(card);
  }

  /**
   * Removes a card from the player's hand.
   * @param {Card} card The card to remove.
   */
  removeFromHand(card) {
    for (let i = 0; i < this.hand.length; i++) {
      if (this.hand[i].suit === card.suit && this.hand[i].number === card.number) {
        this.hand.splice(i, 1);
      }
    }
  }

  /**
   * Adds the total points in the player's hand.
   */
  addPointsInHand() {
    let points = 0;
    this.hand.forEach((card) => {
      points += card.value;
    });

    return points;
  }

  /**
   * Adds points to the player's current points.
   * @param {number} points The points to add.
   */
  addPoints(points) {
    this.points += points;
  }
}

class Card {
  /**
   * @type number
   * @description The "number" of the card.
   * (i.e. ACE, ONE, TWO, ... , TEN, JACK, QUEEN, KING)
   */
  number;

  /**
   * @type Suit
   * @description The suit of the card.
   */
  suit;

  /**
   * @type number
   * @description The point value of the card.
   */
  value;

  constructor(number, suit, value) {
    this.number = number;
    this.suit = suit;
    this.value = value;
  }

  get suit() {
    return this.suit;
  }

  get number() {
    return this.number;
  }

  get value() {
    return this.value;
  }
}

const Suit = {
  CLUBS: 1,
  DIAMONDS: 2,
  HEARTS: 3,
  SPADES: 4,
  NONE: 5
};

const DeckType = {
  STANDARD: 1,
  JOKERS: 2,
};

/**
 * Creates a standard 52 card deck with no jokers.
 */
const createStandardDeck = () => {
  let standardDeck = [];
  for (let i = 1; i <= 13; i++) {
    let card = new Card(i, Suit.CLUBS, i > 10 ? 10 : i);
    standardDeck.push(card);
  }
  for (let i = 1; i <= 13; i++) {
    let card = new Card(i, Suit.DIAMONDS, i > 10 ? 10 : i);
    standardDeck.push(card);
  }
  for (let i = 1; i <= 13; i++) {
    let card = new Card(i, Suit.HEARTS, i > 10 ? 10 : i);
    standardDeck.push(card);
  }
  for (let i = 1; i <= 13; i++) {
    let card = new Card(i, Suit.SPADES, i > 10 ? 10 : i);
    standardDeck.push(card);
  }
  return standardDeck;
}

const createStandardDeckWithJokers = () => {
  let deck = createStandardDeck();
  let joker = new Card(0, Suit.NONE, 0);
  deck.push(joker);
  deck.push(joker);
  return deck;
}

module.exports = { Game, Player, Card, DeckType };
