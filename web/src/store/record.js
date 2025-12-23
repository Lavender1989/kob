export default {
  state: {
    is_record: false,  // true表示是录像，false表示不是录像，默认为false-为true说明在对战中
    a_steps: "",
    b_steps: "",
    record_loser: "",
  },
  getters: {
  },
  mutations: {
    updateIsRecord(state, is_record) {
      state.is_record = is_record;
    },
    updateSteps(state, data) {
      // 只能传一个参数 如果是多个参数就存在字典里
      state.a_steps = data.a_steps;
      state.b_steps = data.b_steps;
    },
    updateRecordLoser(state, loser) {
      state.record_loser = loser;
    }

  },
  actions: {
  },
  modules: {
  }
}
