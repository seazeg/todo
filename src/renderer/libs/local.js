import {
    menu,
    todo
} from './data'
export const local = {
    setData(jsonName, jsonValue) {
        localStorage.setItem(jsonName, JSON.stringify(jsonValue))
    },
    getData(jsonName) {
        return JSON.parse(localStorage.getItem(jsonName))
    },
    initData() {
        if (!this.getData('menuList') && !this.getData('todolist')) {
            this.setData('menuList', menu)
            this.setData('todolist', todo)
        }
    }
}