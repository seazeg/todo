<template>
    <div class="floatbox_warp">
        <div class="floatbox" :class="{'open':isWinOpen}" @mouseup.prevent="mouseup($event)"
            @mousedown.prevent="mousedown($event)">
            <span>{{taskNum}}</span>
        </div>
        <div v-for="(item,index) in bubble" :key="'notice' + index">
            <transition name="component-fade" mode="out-in">
                <div class="bubblebox">
                    <div class="name">{{item.title}}</div>
                    <div class="group">
                        <span class="over" @click="closeNotice(item.id)">已完成</span>
                        <Select v-model="selectTime" class="post" placeholder="推迟" @on-change="postTimeHanldle(item)">
                            <Option v-for="(o,index) in postTimeList" :value="o.value" :key="o.value">{{o.label}}
                            </Option>
                        </Select>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>
<script>
    import {
        ipcRenderer
    } from 'electron'
    import {
        local
    } from '../libs/local'
    export default {
        data() {
            return {
                selectTime: "",
                isMoving: false,
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 0,
                postTimeList: [{
                    value: 600 * 1000,
                    label: "10分钟"
                }, {
                    value: 1800 * 1000,
                    label: "30分钟"
                }, {
                    value: 3600 * 1000,
                    label: "1小时"
                }, {
                    value: 3600 * 24 * 1000,
                    label: "1天"
                }],
                bubble: []
            }
        },
        computed: {
            taskNum: function () {
                return this.$store.state.Counter.taskNum
            },
            isWinOpen: function () {
                return this.$store.state.Counter.isOpen
            },
            modeStatus: function () {
                return this.$store.state.Counter.modeStatus
            },
            todolist: function () {
                return this.$store.state.Counter.todolist
            },
            menuList: function () {
                return this.$store.state.Counter.menuList
            }
        },
        methods: {
            mousedown(e) {
                this.x1 = e.screenX;
                this.y1 = e.screenY;
            },
            mouseup(e) {
                let _this = this
                _this.x2 = e.screenX;
                _this.y2 = e.screenY;
                let distance = Math.sqrt((_this.x1 - _this.x2) * (_this.x1 - _this.x2) + (_this.y1 - _this.y2) * (_this
                    .y1 - _this
                    .y2))
                if (distance < 1) {
                    ipcRenderer.send('openMainWin', true);
                    _this.switchView('main');
                    setTimeout(() => {
                        _this.$store.commit('setIsOpen', true);
                    }, 100);

                    ipcRenderer.send('modeStatus', false);
                    _this.bubble = [];
                }
            },
            switchView(path) {
                this.$router.push({
                    path: path
                })
            },
            initTaskNum() {
                let temp = [],
                    todolist = local.getData('todolist');
                for (let n of todolist) {
                    if (n.status == 0 && !n.isRecover) {
                        if (!temp[n.category]) {
                            temp[n.category] = 1
                        } else {
                            temp[n.category] = temp[n.category] + 1
                        }
                        temp['全部'] = (temp['全部'] || 0) + 1
                        this.$store.commit('setTaskNum', temp['全部']);
                    }
                }
            },
            getTaskResult() {
                let _this = this
                ipcRenderer.on('timedTask-reply', (event, arg) => {
                    if (!_this.isWinOpen) {
                        ipcRenderer.send('openBubbleWin', true);
                        ipcRenderer.send('modeStatus', 'bubble');
                        let task = JSON.parse(arg);
                        _this.bubble.push(task)
                    }
                })
            },
            closeNotice(id) {
                let _this = this
                for (let item of _this.todolist) {
                    if (item.id == id) {
                        item.status = 1;
                        item.checked = true;
                    }
                }
                _this.$store.commit('updateNum')
                for (let b = 0; b < _this.bubble.length; b++) {
                    if (_this.bubble[b].id == id) {
                        _this.bubble.splice(b, 1);

                    }
                }
                if (_this.bubble.length <= 0) {
                    ipcRenderer.send('modeStatus', false);
                }
            },
            postTimeHanldle(obj) {
                let _this = this;
                let item = obj;
                let date = _this.$moment(new Date()).valueOf();
                let time = _this.selectTime;
                let postTime = _this.$moment(date + Number(time)).format('YYYY-MM-DD HH:mm')
                for (let i of _this.todolist) {
                    if (i.id == item.id) {
                        i.remindDate = postTime
                    }
                }
                ipcRenderer.send('timedTask-message', {
                    id: item.id,
                    title: item.title,
                    date: postTime
                })
                _this.closeNotice(item.id)

            }
        },
        mounted() {
            let _this = this;
            _this.initTaskNum();
            _this.getTaskResult();

            // //开发完成后删
            // ipcRenderer.send('openBubbleWin', true);
            // ipcRenderer.send('modeStatus', 'bubble')
        }
    }
</script>