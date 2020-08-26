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

  get id() {
    return this.id;
  }

  get name() {
    return this.name;
  }

  get hand() {
    return this.hand;
  }

  get points() {
    return this.points;
  }
  
  /**
  * Adds a card to the player's hand.
  * @param {Card} card The card to add.
  */
  addCardToHand(card) {
    this.hand.push(card);
  }
  
  /**
  * Removes a card from the player's hand and returns it.
  * @param {number} suit The suit of the card to remove.
  * @param {number} num The number of the card to remove.
  */
  removeCardFromHand(suit, num) {
    let removeIndex = -1;
    for (let i = 0; i < this.hand.length; i++) {
      if (this.hand[i].suit() === suit && this.hand[i].number() === num) {
        removeIndex = i;
        break;
      }
    }

    let removedCard = this.hand.splice(removeIndex, 1)[0];
    return removedCard;
  }
  
  /**
  * Adds the total points in the player's hand.
  */
  addPointsInHand() {
    let points = 0;
    this.hand.forEach((card) => {
      points += card.value();
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

module.exports = { Player };
