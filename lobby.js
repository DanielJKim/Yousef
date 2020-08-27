const { Game } = require("./game");

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
  game;

  /**
  * @type boolean
  * @description True if the game has started.
  */
  gameStarted = false;

  constructor(id, hostid) {
    this.id = id;
    this.hostid = hostid;
  }

  get id() {
    return this.id;
  }

  get hostid() {
    return this.hostid;
  }

  get code() {
    return this.code;
  }

  get users() {
    return this.users;
  }

  get game() {
    return this.game;
  }

  get gameStarted() {
    return this.gameStarted;
  }

  /**
  * Sets the invite code of the lobby.
  */
  setLobbyCode() {
    this.code = createInviteCode();
  }

  /**
  * Adds a user to the lobby.
  * @param {User} user The user to add.
  */
  addPoints(user) {
    this.users.push(user);
  }
}

/**
* Creates an invite code string.
*/
const createInviteCode = () => {
  let result = '';
  const INVITE_CODE_LENGTH = 10;
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < INVITE_CODE_LENGTH; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

module.exports = { Lobby };
