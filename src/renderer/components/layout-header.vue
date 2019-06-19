<template>
    <div class="layout-header">
        <slot></slot>
    </div>
</template>
<script>
    const {
        ipcRenderer: ipc
    } = require('electron');
    export default {
        name: "layout-header",
        methods: {
            winHandle(type) {
                ipc.send(type);
            }
        }
    }
</script>