const state = {
  taskNum: 1
}

const mutations = {
  setTaskNum(state, num) {
    state.taskNum = num
  }
}

const actions = {
  setTaskNum({
    commit
  }) {
    commit('setTaskNum', num)
  }
}

export default {
  state,
  mutations,
  actions
}