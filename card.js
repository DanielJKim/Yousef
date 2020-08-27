class Card {
  /**
  * @type number
  * @description The "number" of the card.
  * (i.e. ACE, ONE, TWO, ... , TEN, JACK, QUEEN, KING)
  */
  number;
  
  /**
  * @type number
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

  getSuitStr() {
    const suitMap = {
      1 : 'CLUBS',
      2 : 'DIAMONDS',
      3 : 'HEARTS',
      4 : 'SPADES',
      5 : 'NONE'
    };

    return suitMap[this.suit];
  }

  getSuitIcon() {
    const iconMap = {
      1: '&#9827;',
      2: '&#9830;',
      3: '&#9829;',
      4: '&#9824;',
      5: '&#9996;'
    };

    return iconMap[this.suit];
  }
}

module.exports = { Card };
