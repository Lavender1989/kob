export default {
  state: {
    status: "matching", // matching表示匹配界面，playing表示对战界面
    socket: null, // 存储前后端建立的连接是什么
    opponent_username: "", // 存储对手的用户名
    opponent_photo: "",
    gamemap: null, // 存储对战地图
    a_id: 0, // 存储自己的id
    a_sx: 0,
    a_sy: 0,
    b_id: 0, // 存储对手的id
    b_sx: 0,
    b_sy: 0,
    gameObject: null, // 存储对战地图的对象
    loser: "none", // none, all, A, B
  },
  getters: {
  },
  mutations: {
    updateSocket(state, socket) {
      state.socket = socket;
    },
    updateOpponent(state, opponent) {
      state.opponent_username = opponent.username;
      state.opponent_photo = opponent.photo;
    },
    updateStatus(state, status) {
      state.status = status;
    },
    updateGame(state, game) {
      state.gamemap = game.map;
      state.a_id = game.a_id;
      state.a_sx = game.a_sx;
      state.a_sy = game.a_sy;
      state.b_id = game.b_id;
      state.b_sx = game.b_sx;
      state.b_sy = game.b_sy;
    },
    updateGameObject(state, gameObject) {
      state.gameObject = gameObject;
    },
    updateLoser(state, loser) {
      state.loser = loser;
    }
  },
  actions: {
  },
  modules: {
  }
}
