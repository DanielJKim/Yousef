var { Game, Player, Card, DeckType } = require('./game');

var app = require('express')();
// var http = require('http').createServer(app);
// var io = require('socket.io')(http);

app.get('/index.css', function(req, res) {
  res.sendFile(__dirname + '/index.css');
});

app.get('/client.js', function(req, res) {
  res.sendFile(__dirname + '/client.js');
});

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const server = app
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

var io = require('socket.io')(server);

class User {
  /**
   * @type number
   * @description Id of the user.
   */
  id;

  /**
   * @type string
   * @description Name of the user.
   */
  name;

  /**
   * @type number
   * @description Id of the lobby that the user is in.
   * Value is -1 if the user is not in a lobby.
   */
  lobbyid;

  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.lobbyid = -1;
  }
}

class Lobby {
  /**
   * @type number
   * @description Id of the lobby.
   */
  id;

  /**
   * @type number
   * @description Id of the host of the lobby.
   */
  hostid;

  /**
   * @type boolean
   * @description True if the lobby is private.
   */
  locked;

  /**
   * @type string
   * @description The invite code of the lobby.
   */
  code;

  /**
   * @type User[]
   * @description List of the users in the lobby.
   */
  users = [];

  /**
   * @type Game
   * @description The lobby game.
   */
  game = new Game();

  /**
   * @type boolean
   * @description True if the game has started.
   */
  gameStarted = false;

  constructor(id, host, locked, code) {
    this.id = id;
    this.hostid = host.id;
    this.locked = locked;
    this.code = code;
    this.users.push(host);
  }
}

/**
 * @description All of the sockets connected to the server.
 */
var ALL_SOCKETS = [];

/**
 * @type Lobby[]
 * @description List of lobbies in the server.
 */
var LOBBIES = [];

/**
 * @description Length of an invite code for a lobby on this server.
 */
const INVITE_CODE_LENGTH = 10;

/**
 * Creates an invite code string.
 */
function createInviteCode() {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < INVITE_CODE_LENGTH; i++) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

/**
 * Adds a new user to the server and returns it.
 * @param {string} username Name of the user to add.
 */
function addUserToServer(username) {
  let newUserId = 0;
  ALL_SOCKETS.forEach((s) => {
    if (s.User !== undefined && s.User.id > newUserId) newUserId = s.User.id;
  });
  let newUser = new User(newUserId + 1, username);
  // console.log("Added user: ", newUser, " to the server");
  return newUser;
}

/**
 * Creates a new unique invitation code and returns it.
 */
function createUniqueInvitationCode() {
  // Create a unique invitation code
  let newCode = createInviteCode();
  let validNewCode = false;
  while(!validNewCode) {
    validNewCode = true;
    LOBBIES.forEach((lobby) => {
      if (lobby.code === newCode) {
        validNewCode = false;
        newCode = createInviteCode();
        return;
      }
    });
  }
  return newCode;
}

/**
 * Adds a new lobby to the server and returns it.
 * @param {number} host The user that is creating this lobby.
 */
function addLobbyToServer(host) {
  let newLobbyId = 0;
  LOBBIES.forEach((lobby) => {
    if (lobby.id > newLobbyId)  newLobbyId = lobby.id;
  });

  let newCode = createUniqueInvitationCode();

  let newLobby = new Lobby(newLobbyId + 1, host, true, newCode);
  LOBBIES.push(newLobby);
  // console.log("Added lobby: ", newLobby, " to the server");
  return newLobby;
}

io.on('connection', function(socket) {
  console.log('connection');
  ALL_SOCKETS.push(socket);

  socket.on('create private lobby', function(username) {
    let newUser = addUserToServer(username);
    socket.User = newUser;
    let newLobby = addLobbyToServer(socket.User);
    socket.User.lobbyid = newLobby.id;
    socket.join(newLobby.code);
    socket.emit('created private lobby', newLobby);
  });

  socket.on('join private lobby', function(username, joinCode) {
    let newUser = addUserToServer(username);
    socket.User = newUser;
    LOBBIES.forEach((lobby) => {
      if (lobby.code === joinCode) {
        lobby.users.push(socket.User);
        socket.join(joinCode);
        socket.User.lobbyid = lobby.id;
        socket.to(joinCode).emit('user joined lobby', socket.User);
        socket.emit('joined user lobby', lobby, socket.User);
      }
    });
  });

  socket.on('start game', function(userid, gameSettings) {
    let lobby = null;
    LOBBIES.forEach((l) => {
      if (l.hostid === userid) {
        lobby = l;
      }
    });

    if (lobby !== null) {
      lobby.game = new Game();
      // Set game settings
      lobby.game.turnTime = gameSettings.TurnTime;
      lobby.game.gameStarted = true;
      lobby.game.numInitCards = 5;
      lobby.game.playerTurn = userid;

      lobby.game.setDeck(parseInt(gameSettings.DeckType));

      // Set game players
      lobby.users.forEach((user) => {
        let player = new Player(user.id, user.name);
        // Add cards to player hand
        for (let i = 0; i < lobby.game.numInitCards; i++) {
          player.addToHand(lobby.game.popDeck());
        }

        lobby.game.addPlayer(player);
      });

      // Set discard pile
      lobby.game.discardCard(lobby.game.popDeck());

      io.in(lobby.code).emit('game started', lobby.game);
    }
  });

  socket.on('disconnect', function() {
    // printUsers();
    let removeIndex = ALL_SOCKETS.indexOf(socket);
    if (removeIndex !== -1) ALL_SOCKETS.splice(removeIndex, 1);
    console.log('user ', socket.User, ' disconnected');
    // printUsers();

    let removeLobby = null;
    LOBBIES.forEach((lobby) => {
      if (lobby.id === socket.User.lobbyid) {
        if (lobby.hostid === socket.User.id) {
          if (lobby.users.length <= 1) {
            /**
             * If the host of a lobby disconnected and
             * there is no one else in the lobby,
             * remove the lobby.
             */
            removeLobby = lobby;
          } else {
            /**
             * If the host of a lobby disconnected but
             * there are users left in the lobby,
             * remove the host of the lobby and
             * assign the host position to the next user in the lobby.
             */
            let i = lobby.users.indexOf(socket.User);
            if (i !== -1) lobby.users.splice(i, 1);
            lobby.hostid = lobby.users[0].id;
            socket.to(lobby.code).emit('user left lobby', lobby);
          }
        } else {
          /**
           * If a non-host user leaves a lobby,
           * remove them from the lobby.
           */
          let i = lobby.users.indexOf(socket.User);
          if (i !== -1) lobby.users.splice(i, 1);
          socket.to(lobby.code).emit('user left lobby', lobby);
        }
      }
    });
    if (removeLobby !== null) {
      let i = LOBBIES.indexOf(removeLobby);
      if (i !== -1) LOBBIES.splice(i, 1);
    }
  });

  /* Game events */

  socket.on('end turn', function() {
    let game = new Lobby().game; // Get the appropriate lobby
    game.nextPlayerTurn();
  });

  socket.on('pick and play cards', function(playCards, pickFrom) {
    let lobby = new Lobby(); // Get the appropriate lobby
    let game = lobby.game;
    let player = game.players.find((p) => p.id === game.playerTurn);
    if (pickFrom === 'DECK') {
      player.addToHand(game.popDeck());
      playerCards.forEach((card) => {
        player.removeFromHand(card);
        lobby.game.discardCard(card);
      });
    } else if (pickFrom === 'DISCARD') {
      player.addToHand(game.popDiscardPile());
      playerCards.forEach((card) => {
        player.removeFromHand(card);
        lobby.game.discardCard(card);
      });
    }
  });

  socket.on('call usef', function() {
    let game = new Lobby().game; // Get the appropriate game
    // Get the total points in hand for each player
    // If the player that called usef has the most points/is tied, he/she loses the round
    // Else all other players lose the round
    let maxPoints = 0;
    let usefPlayerPoints = 0;
    game.players.forEach((p) => {
      let playerPoints = p.addPointsInHand();
      maxPoints = (playerPoints > maxPoints) ? playerPoints : maxPoints;
      usefPlayerPoints = (p.id === game.playerTurn) ? playerPoints : usefPlayerPoints;
    });

    if (usefPlayerPoints < maxPoints) {
      // Usef player wins round
      lobby.game.players.forEach((p) => {
        if (p.id !== game.playerTurn) {
          p.addPoints(p.addPointsInHand());
        }
        // @todo check if score is above the score limit
      });
    } else {
      // Other players win round
      let losingPlayer = game.players.find((p) => p.id === game.playerTurn);
      losingPlayer.addPoints(losingPlayer.addPointsInHand());
      // @todo check if score is above the score limit
    }
  });
});

// Testing
function printUsers() {
  console.log('Printing users: ');
  ALL_SOCKETS.forEach((s) => {
    console.log(s.User);
  });
  console.log('----------');
}
