const state = {
  taskNum: 1,
  isOpen:false
}

const mutations = {
  setTaskNum(state, num) {
    state.taskNum = num
  },
  setIsOpen(state, bool) {
    state.isOpen = bool
  }
}

const actions = {
  setTaskNum({
    commit
  }) {
    commit('setTaskNum', num)
  },
  setIsOpen({
    commit
  }) {
    commit('setIsOpen', bool)
  }
}

export default {
  state,
  mutations,
  actions
}