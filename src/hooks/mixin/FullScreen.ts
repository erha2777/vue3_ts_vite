import { ref, computed, watch, nextTick } from 'vue'

let fullScreenFlag = ref(false) // 是否全屏

/**
 * 全屏
 */
const myFullScreen = () => {
    fullScreenFlag.value = true
    var docElm = document.documentElement
    //W3C
    if (docElm.requestFullscreen) {
        docElm.requestFullscreen()
    }
}
/**
 * 退出全屏
 */
const closeMyFullScreen = () => {
    fullScreenFlag.value = false
    if (document.exitFullscreen) {
        document.exitFullscreen()
    }
}
export default function () {
    return {
        fullScreenFlag,
        myFullScreen,
        closeMyFullScreen
    }
}
