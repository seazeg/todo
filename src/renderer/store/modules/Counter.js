const state = {
  taskNum: 1,
  isOpen:false,
  modeStatus:false
}

const mutations = {
  setTaskNum(state, num) {
    state.taskNum = num
  },
  setIsOpen(state, bool) {
    state.isOpen = bool
  },
  setModeStatus(state, bool) {
    state.modeStatus = bool
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
  },
  setModeStatus({
    commit
  }) {
    commit('setModeStatus', bool)
  }
}

export default {
  state,
  mutations,
  actions
}