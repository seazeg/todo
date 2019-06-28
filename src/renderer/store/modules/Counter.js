const state = {
  taskNum: 0,
  isOpen: false,
  modeStatus: false,
  todolist: [],
  menuList: []
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
  updateNum(state) {
    let temp = {},
      todolist = state.todolist,
      menuList = state.menuList
    for (let n of todolist) {
      if (n.status == 0 && !n.isRecover) {
        if (!temp[n.category]) {
          temp[n.category] = 1
        } else {
          temp[n.category] = temp[n.category] + 1
        }
        temp['全部'] = (temp['全部'] || 0) + 1
      }

      if (n.isRecover) {
        temp['废稿箱'] = (temp['废稿箱'] || 0) + 1
      }

    }
    for (let m of menuList) {
      m.num = temp[m.name] || 0;
    }
    state.taskNum = temp['全部'] || 0
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
  },
  updateNum({
    commit
  }) {
    commit('updateNum')
  }
}

export default {
  state,
  mutations,
  actions
}