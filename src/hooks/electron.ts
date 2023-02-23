import { ref} from 'vue'
// import { ipcRenderer } from 'electron' // script标签内，引入ipcRenderer
// const { ipcRenderer } = require('electron') // script标签内，引入ipcRenderer

let isFullScreen = ref(false) // 是否全屏

//  methods 中 写下边三个方法，并且绑定到你自己的document 上。
const minimizeWin = () => {
    // ipcRenderer.send('window-min') // 通知主进程我要进行窗口最小化操作
}

const maximizeWin = () => {
    isFullScreen.value = !isFullScreen.value
    // ipcRenderer.send('window-max') // 通知主进程我要进行最大化 或 还原
}
const closeWin = () => {
    // ipcRenderer.send('window-close') // 通知主进程我要关闭
}
export default function () {
    return {
        isFullScreen,
        minimizeWin,
        maximizeWin,
        closeWin
    }
}
