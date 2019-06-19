<template>
    <div class="floatbox" :class="{'open':open}" @mouseup.prevent="mouseup($event)"
        @mousedown.prevent="mousedown($event)">
        <span>8</span>
    </div>
</template>

<script>
    import {
        ipcRenderer
    } from 'electron'
    export default {
        data() {
            return {
                open: false,
                isMoving: false,
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 0
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
                        _this.open = true;
                    }, 100);
                }
            },
            switchView(path) {
                this.$router.push({
                    path: path
                })
            }
        },
        mounted() {
            let _this = this
            ipcRenderer.on('closeMainWin', function (e, arg) {
                console.log(arg);
                if (arg) {
                    _this.open = false;
                    _this.switchView('/');
                }
            })


        }
    }
</script>