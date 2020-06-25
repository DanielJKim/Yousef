var socket = io();

var USER_ID = -1;

function createPrivateGame() {
  let nameInput = document.getElementById('name-input').value;
  if (nameInput === null || nameInput === undefined || nameInput === '') return;
  socket.emit('create private lobby', nameInput);
}

socket.on('created private lobby', function(newLobby) {
  hide('main-page');
  USER_ID = newLobby.hostid;
  displayLobby(newLobby);
  console.log('Created private lobby: ', newLobby);
});

socket.on('user joined lobby', function(joinedUser) {
  let joinedUserDiv = document.createElement('DIV');
  joinedUserDiv.innerHTML = joinedUser.name;
  document.getElementById('lobby-page-player-list').appendChild(joinedUserDiv);
});

function joinPrivateGame() {
  let nameInput = document.getElementById('name-input').value;
  if (nameInput === null || nameInput === undefined || nameInput === '') return;
  let joinGameInviteCode = document.getElementById('join-private-game-input').value;
  socket.emit('join private lobby', nameInput, joinGameInviteCode);
}

socket.on('joined user lobby', function(lobby, user) {
  hide('main-page');
  console.log(user);
  USER_ID = user.id;
  displayLobby(lobby);
});

socket.on('user left lobby', function(lobby) {
  displayLobby(lobby);
});

function startGame() {
  let gameSettings = {
    DeckType: document.getElementById('deck-type-list').value,
    TurnTime: document.getElementById('turn-timer-list').value,
    // UsefTurn: document.getElementById('min-usef-turn').value
  };

  socket.emit('start game', USER_ID, gameSettings);
}

socket.on('game started', function(game) {
  hide('lobby-page');
  displayGame(game);
});

// HELPER FUNCTIONS

/**
 * Shows the html element with the specified id.
 * @param {string} id The id of the html element to show.
 */
function show(id) {
  document.getElementById(id).style.display = 'grid';
}

/**
 * Hides the html element with the specified id.
 * @param {string} id The id of the html element to hide.
 */
function hide(id) {
  document.getElementById(id).style.display = 'none';
}

const Suit = {
  CLUBS: 1,
  DIAMONDS: 2,
  HEARTS: 3,
  SPADES: 4,
  NONE: 5
};

const SuitIcon = {
  CLUBS: '&#9827;',
  DIAMONDS: '&#9830;',
  HEARTS: '&#9829;',
  SPADES: '&#9824;',
  NONE: '&#9996;'
};

/**
 * Converts a suit to an icon string.
 * @param {Suit} suit The suit to convert to an icon.
 */
function suitToIcon(suit) {
  switch (suit) {
    case Suit.CLUBS:
      return SuitIcon.CLUBS;

    case Suit.DIAMONDS:
      return SuitIcon.DIAMONDS;

    case Suit.HEARTS:
      return SuitIcon.HEARTS;

    case Suit.SPADES:
      return SuitIcon.SPADES;

    case Suit.NONE:
      return SuitIcon.NONE;

    default:
      return 'SUIT NOT IMPLEMENTED';
  }
}

/**
 * Converts a suit to a string.
 * @param {Suit} suit The suit to convert to a string.
 */
function suitToString(suit) {
  switch (suit) {
    case Suit.CLUBS:
      return 'CLUBS';

    case Suit.DIAMONDS:
      return 'DIAMONDS';

    case Suit.HEARTS:
      return 'HEARTS';

    case Suit.SPADES:
      return 'SPADES';

    case Suit.NONE:
      return 'JOKER';

    default:
      return 'SUIT NOT IMPLEMENTED';
  }
}

/**
 * Converts a card to a string.
 * @param {Card} card The card to convert to a string.
 */
function cardToString(card) {
  return suitToString(card.suit) + ' ' + card.number.toString();
}

/**
 * Returns the color of the card.
 * @param {Card} card The card to return the color of.
 */
function getCardColor(card) {
  return card.suit === Suit.CLUBS || card.suit === Suit.SPADES ? 'black' : 'red';
}

/**
 * Returns the symbol of the card.
 * @param {Card} card The card to get the symbol of.
 */
function cardNumberToSymbol(card) {
  if (card.number === 1) return 'A';
  else if (card.number <= 10) return card.number;
  else if (card.number === 11) return 'J';
  else if (card.number === 12) return 'Q';
  else if (card.number === 13) return 'K';
  else return 'Unkown';
}

/**
 * Displays the specified lobby on the screen.
 * @param {Lobby} lobby The lobby to display.
 */
function displayLobby(lobby) {
  show('lobby-page');
  document.getElementById('invite-code').innerHTML = lobby.code;

  document.getElementById('lobby-page-player-list').remove();
  let playerListDiv = document.createElement('DIV');
  playerListDiv.id = 'lobby-page-player-list';
  document.getElementById('lobby-page-player-list-container').appendChild(playerListDiv);
  lobby.users.forEach((u) => {
    let newDiv = document.createElement('DIV');
    newDiv.innerHTML = u.name + ' ';
    if (lobby.hostid === u.id) {
      let hostBadge = document.createElement('SPAN');
      hostBadge.className = 'badge badge-warning';
      hostBadge.innerHTML = 'Host';
      newDiv.appendChild(hostBadge);
    }
    document.getElementById('lobby-page-player-list').appendChild(newDiv);
  });

  // Disable game setting fields for non-host users
  if (USER_ID == lobby.hostid) {
    document.getElementById('deck-type-list').disabled = false;
    document.getElementById('turn-timer-list').disabled = false;
    document.getElementById('min-usef-turn').disabled = false;
    document.getElementById('start-game-button').disabled = false;
  } else {
    document.getElementById('deck-type-list').disabled = true;
    document.getElementById('turn-timer-list').disabled = true;
    document.getElementById('min-usef-turn').disabled = true;
    document.getElementById('start-game-button').disabled = true;
  }
}

/**
 * Displays the players in the game page.
 */
function showGamePlayers(game) {
  document.getElementById('game-page-players-list').remove();
  let playersListDiv = document.createElement('DIV');
  playersListDiv.id = 'game-page-players-list';
  game.players.forEach((p) => {
    if (p.id !== USER_ID) {
      let playerDiv = document.createElement('DIV');
      let playerNameDiv = document.createElement('DIV');
      playerNameDiv.innerHTML = p.name;
      let playerInfoDiv = document.createElement('DIV');
      playerInfoDiv.innerHTML = '# cards: ' + p.hand.length.toString() + ', points: ' + p.points.toString();
      playerDiv.appendChild(playerNameDiv);
      playerDiv.appendChild(playerInfoDiv);
      playersListDiv.appendChild(playerDiv);
    }
  });
  document.getElementById('game-page-players').appendChild(playersListDiv);
}

/**
 * Creates an html element of a card.
 * @param {Card} card The card to create.
 */
function createCardElement(card) {
  let cardElement = document.createElement('DIV');
  cardElement.className = 'game-page-card';
  cardElement.onclick = () => {
    if (cardElement.className === 'game-page-card') {
      cardElement.className = 'game-page-card game-page-card-selected';
    } else {
      cardElement.className = 'game-page-card';
    }
  }

  let cardInfo = document.createElement('DIV');
  cardInfo.className = 'card-info';
  cardInfo.innerHTML = cardToString(card);
  cardInfo.style.display = 'none';
  cardElement.appendChild(cardInfo);

  let cardSuit = document.createElement('DIV');
  cardSuit.innerHTML = suitToIcon(card.suit);
  cardSuit.style.color = getCardColor(card);
  cardSuit.style.fontSize = 'xxx-large';
  cardSuit.style.padding = '10px';
  cardElement.appendChild(cardSuit);

  let cardNumber = document.createElement('DIV');
  cardNumber.innerHTML = cardNumberToSymbol(card);
  cardNumber.style.fontSize = 'xx-large';
  cardNumber.style.color = getCardColor(card);
  cardElement.appendChild(cardNumber);

  return cardElement;
}

/**
 * Creates an html element of a card back.
 */
function createCardBackElement() {
  let cardElement = document.createElement('DIV');
  cardElement.className = 'game-page-card';
  cardElement.onclick = () => {
    if (cardElement.className === 'game-page-card') {
      cardElement.className = 'game-page-card game-page-card-selected';
    } else {
      cardElement.className = 'game-page-card';
    }
  }

  let cardInfo = document.createElement('DIV');
  cardInfo.className = 'card-info';
  cardInfo.innerHTML = 'DECK';
  cardInfo.style.display = 'none';
  cardElement.appendChild(cardInfo);

  let cardBack = document.createElement('DIV');
  cardBack.innerHTML = '&#9884;';
  cardBack.style.fontSize = 'xxx-large';
  cardBack.style.padding = '10px';
  cardElement.appendChild(cardBack);

  return cardElement;
}

/**
 * Renders the deck.
 * @param {Game} game The game to display.
 */
function renderDeck(game) {
  let numCardsInDeck = game.deck.length;
  let deckElement = document.getElementById('game-page-cards-left');
  deckElement.style.margin = 'auto';
  deckElement.style.padding = '10px';
  deckElement.style.height = '70%';
  deckElement.style.display = 'flex';
  deckElement.style.borderRadius = '10px';
  deckElement.style.backgroundColor = 'darkgreen';

  let deckCard = createCardBackElement();
  deckElement.appendChild(deckCard);

  let deckNumCards = document.createElement('DIV');
  deckNumCards.innerHTML = numCardsInDeck;
  deckNumCards.style.position = 'absolute';
  document.getElementById('game-page-deck').appendChild(deckNumCards);
}

/**
 * Renders the discard pile.
 * @param {Game} game The game to display.
 */
function renderDiscardPile(game) {
  let discardPileTopCard = game.discardPile[game.discardPile.length - 1];
  let discardPileElement = document.getElementById('game-page-discard-top');
  discardPileElement.style.margin = 'auto';
  discardPileElement.style.padding = '10px';
  discardPileElement.style.height = '70%';
  discardPileElement.style.display = 'flex';
  discardPileElement.style.borderRadius = '10px';
  discardPileElement.style.backgroundColor = 'darkgreen';
  let cardElement = createCardElement(discardPileTopCard);
  discardPileElement.appendChild(cardElement);
}

/**
 * Renders the player's hand.
 * @param {Game} game The game to display.
 */
function renderHand(game) {
  document.getElementById('game-page-player-hand').remove();
  // game-page-player-hand
  let playerHandDiv = document.createElement('DIV');
  playerHandDiv.id = 'game-page-player-hand';
  let player = game.players.find((p) => p.id === USER_ID);
  player.hand.forEach((c) => {
    let cardDiv = createCardElement(c);
    playerHandDiv.appendChild(cardDiv);
  });
  playerHandDiv.style.margin = 'auto';
  playerHandDiv.style.padding = '10px';
  playerHandDiv.style.height = '70%';
  playerHandDiv.style.display = 'flex';
  playerHandDiv.style.borderRadius = '10px';
  playerHandDiv.style.backgroundColor = 'darkgreen';

  document.getElementById('game-page-hand').appendChild(playerHandDiv);
}

/**
 * Renders the game functions.
 * @param {Game} game The game to display.
 */
function renderUsef(game) {
  let player = null;
  game.players.find((p) => {
    if (p.id === game.playerTurn) {
      player = p;
    }
  });

  let playerTurn = player === null ? 'ERROR: Player not found.' : player.name + '\'s Turn';
  document.getElementById('game-page-player-turn').innerHTML = playerTurn;
}

/**
 * Displays the specified game on the screen.
 * @param {Game} game The game to display.
 */
function displayGame(game) {
  show('game-page');
  // Render the other players in the game
  showGamePlayers(game);
  // Render the deck
  renderDeck(game);
  // Render discard pile
  renderDiscardPile(game);
  // Render the player hand
  renderHand(game);
  // Render the game functions
  renderUsef(game);
}

/**
 * Locks in a move.
 */
function lockMove() {
  let selectedElements = document.getElementById('game-page-player-hand').getElementsByClassName('game-page-card-selected');
  let cards = [];
  for (let i = 0; i < selectedElements.length; i++) {
    let cardInfo = selectedElements[i].getElementsByClassName('card-info')[0].innerHTML;
    cards.push(cardInfo);
  }
  // @TODO check for discard pile selected and deck selected (only one)
  let discardPileElement = document.getElementById('game-page-discard-top');
  let discardTop = discardPileElement.getElementsByClassName('game-page-card-selected');
  let discardSelected = discardTop.length > 0;
  let deckSelected = cards.includes('DECK');
  if (!discardSelected && !deckSelected) console.log('Select either the deck or discard to get from');
  else if (discardSelected && deckSelected) console.log('Must select either the deck or discard, but not both');
  else {
    socket.emit('pick and play cards', cards, deckSelected ? 'DECK' : 'DISCARD');
  }
  console.log(cards);
  console.log(discardSelected);
}
