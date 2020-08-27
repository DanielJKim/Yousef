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

  get id() {
      return this.id;
  }

  get name() {
      return this.name;
  }

  get lobbyid() {
      return this.lobbyid;
  }
}

module.exports = { User };
