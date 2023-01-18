import store from '@/store'
import { computed } from 'vue'

// 主题相关
const theme = computed(() => window.localStorage.getItem('theme')) // 主题

// 用户信息
const userInfo: any = computed(() => store.state.userInfo) // 用户数据

// 音乐信息相关
const songData = computed(() => store.state.songData) // 当前播放的歌曲信息
const songList = computed(() => store.state.songList) // 当前播放的歌曲列表
const songListFrom = computed(() => store.state.songListFrom) // 当前播放的歌单

// audio相关
const volume = computed(() => store.state.volume) // 当前音量
const progress = computed(() => store.state.progress) // 歌曲播放进度 数值型
const playStop = computed(() => store.state.playState.stop) // 播放状态是否停止
const playState = computed(() => store.state.playState) // 播放状态
const playBar = computed(() => store.state.playBar) // 播放进度百分比
const playTime = computed(() => store.state.playTime) // 当前播放时间
const endTime = computed(() => store.state.endTime) // 歌曲总时长

// 单击高亮
const activeId = computed(() => store.state.activeId) // 单击高亮的id

// 右键菜单相关
const rightClickMenu: any = computed(() => store.state.rightClickMenu)
const show: any = computed(() => store.state.rightClickMenu.show)
const type: any = computed(() => store.state.rightClickMenu.type)

export default function () {
    return {
        userInfo,
        songData,
        theme,
        playStop,
        playState,
        songList,
        volume,
        progress,
        songListFrom,
        activeId,
        playBar,
        playTime,
        endTime,
        show,
        type,
        rightClickMenu,
    }
}
