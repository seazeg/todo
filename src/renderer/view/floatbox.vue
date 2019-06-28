<template>
    <div class="floatbox_warp">
        <div class="floatbox" :class="{'open':isWinOpen}" @mouseup.prevent="mouseup($event)"
            @mousedown.prevent="mousedown($event)">
            <span>{{taskNum}}</span>
        </div>
        <div class="bubblebox">
            <div class="name">任务完成</div>
            <div class="group">
                <span class="over">已完成</span>
                <span class="post">推迟</span>
            </div>
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
                modeStatus: false,
                isMoving: false,
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 0
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
                for (let n of JSON.parse(todolist)) {
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
                        console.log('完成：', arg)
                    }
                })
            }
        },
        mounted() {
            let _this = this;
            _this.initTaskNum();
            _this.getTaskResult();



            ipcRenderer.send('openBubbleWin', true);

            ipcRenderer.send('modeStatus', true);
            // _this.modeStatus 
        }
    }
</script>