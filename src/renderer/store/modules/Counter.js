const state = {
  taskNum: 1,
  isOpen:false,
  modeStatus:false,
  todolist:[],
  menuList:[]
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
  },
  setTodolist(state, arr) {
    state.todolist = arr
  },
  setMenuList(state, arr) {
    state.menuList = arr
  },
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
  },
  setTodolist({
    commit
  }) {
    commit('setTodolist', arr)
  },
  setMenuList({
    commit
  }) {
    commit('setMenuList', arr)
  }
}

export default {
  state,
  mutations,
  actions
}