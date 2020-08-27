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
  * @description Index of the player whose turn it is.
  */
  playerTurn;

  /**
  * @type number
  * @description The round of the game.
  */
  round = 0;

  constructor() {
  }

  get players() {
    return this.players;
  }

  get deck() {
    return this.deck;
  }

  get discardPile() {
    return this.discardPile;
  }

  get playerTurn() {
    return this.playerTurn;
  }

  get round() {
    return this.round;
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
    let removeIndex = -1;
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].id() === player.id()) {
        removeIndex = i;
        break;
      }
    }

    return this.players.splice(removeIndex, 1);
  }

  /**
  * Adds a player to the game.
  * @param {Player} player The player to add.
  */
  addPlayer(player) {
    this.players.push(player);
  }

  /**
  * Creates a deck for the game.
  */
  createDeck() {
    return createStandardDeckWithJokers();
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
  */
  setDeck() {
    this.deck = this.shuffleDeck(this.createDeck());
  }
}

/**
* Creates a standard 52 card deck with no jokers.
*/
const createStandardDeck = () => {
  let standardDeck = [];
  for (let j = 1; j <= 4; j++) {
    for (let i = 1; i <= 13; i++) {
      let card = new Card(i, j, i > 10 ? 10 : i);
      standardDeck.push(card);
    }
  }

  return standardDeck;
}

const createStandardDeckWithJokers = () => {
  let deck = createStandardDeck();
  let joker = new Card(0, 5, 0);
  deck.push(joker);
  deck.push(joker);
  deck = deck.concat(deck.slice());
  return deck;
}

module.exports = { Game };
