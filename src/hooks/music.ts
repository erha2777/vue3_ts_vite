import { computed, ref, watch, nextTick } from 'vue'
import store from '@/store'
import { randomNum } from '@/utils/utils'
import { useRouter } from 'vue-router'
import computedFn from '@/hooks/store'
import personalFmFn from '@/hooks/model/personalFm'

const { next: fmNext } = personalFmFn() // 引用私人fm的播放下一首

const { songData, playState, songList, volume, progress,playStop } = computedFn()

let audio: any = null // audio对象

window.onload = () => {
    audio = document.querySelector('#audio audio')
    // audio.play()
}

/**
 * 播放/暂停的切换
 */
const playChange = () => {
    if (playState.value.stop) {
        audio.play()
    } else {
        audio.pause()
    }
    store.commit('setSongStop', !playState.value.stop)
}

/**
 * 停止播放
 */
const stopPlay = () => {
    audio.pause()
    store.commit('setSongStop', true)
}

/**
 * 随机播放下一首
 */
const shufflePlay = () => {
    const index = songList.value.findIndex((v: { id: any }) => v.id === songData.value.id)
    let num = randomNum(0, songList.value.length)
    if (index === num) {
        num = randomNum(0, songList.value.length)
    }
    window.localStorage.setItem('songItem', JSON.stringify(songList.value[num]))
    store.dispatch('getSongMsg', songList.value[num])
}

/**
 * 是否随机播放下一首
 */
const changeShufflePlay = () => {
    store.commit('setSongShuffle', !playState.value.shuffle)
}

/**
 * 是否循环播放
 */
const changeRepeatPlay = () => {
    store.commit('setSongRepeat', !playState.value.repeat)
}

/**
 * 设置总时长
 * @param e audio对象
 */
const canplaythrough = (e: { target: any }) => {
    const mp3 = e.target
    let minute: any = Math.floor(mp3.duration / 60)
    let second: any = Math.floor(mp3.duration % 60)
    minute = minute >= 10 ? minute : '0' + minute
    second = second >= 10 ? second : '0' + second
    const times = minute + ':' + second
    store.commit('setEndTime', times)
}

/**
 * 设置当前播放时间
 * @param e audio对象
 */
const timeupdate = (e: any) => {
    const s1 = e.target.currentTime
    let minute: any = Math.floor(s1 / 60)
    let second: any = Math.floor(s1 % 60)
    let secondTo3: any = (s1 % 60).toFixed(3)
    minute = minute >= 10 ? minute : '0' + minute // 分
    second = second >= 10 ? second : '0' + second // 秒
    secondTo3 = secondTo3 >= 10 ? secondTo3 : '0' + secondTo3 // 秒保留三位小数
    store.commit('setPlayTime', minute + ':' + second)
    store.commit('setPlayTimeTo3', minute + ':' + secondTo3)
    store.commit('setPlayBar', Math.ceil((s1 / e.target.duration) * 100) + '%')
}

/**
 * 进度条控制播放进度
 * @param e 点击的进度条
 */
const playPlan = (e: any) => {
    const x = e.offsetX
    const w = e.target.offsetWidth
    const s = audio.duration
    const v = (x / w) * 100
    const vl = (s * v) / 100
    store.commit('setProgress', vl)
}
// 控制播放的进度
watch(progress, (newValue, oldValue) => {
    audio.currentTime = newValue
})

/**
 * 控制播放音量
 * @param e 点击的进度条
 */
const playVolume = (e: any) => {
    const x = e.offsetX
    const w = e.currentTarget.offsetWidth
    const v = x / w
    store.commit('setSongVolume', v)
}

/**
 * 静音
 */
const playMute = () => {
    store.commit('setSongVolume', 0)
}

/**
 * 最大音量
 */

const volumeMax = () => {
    store.commit('setSongVolume', 1)
}

// 控制音量的变化
watch(
    volume,
    (newValue, oldValue) => {
        nextTick(() => {
            audio.volume = newValue
        })
    }
)

export default function () {
    const router = useRouter()
    const currentRouter = computed(() => router.currentRoute.value.path)

    // 播放模式的切换
    const modelStatus = ref('default')
    const modelChange = () => {
        if (currentRouter.value === '/personalFm') {
            return
        }
        if (modelStatus.value === 'default') {
            modelStatus.value = 'loop'
            store.commit('setSongShuffle', false)
            store.commit('setSongRepeat', true)
        } else if (modelStatus.value === 'loop') {
            modelStatus.value = 'random'
            store.commit('setSongRepeat', false)
            store.commit('setSongShuffle', true)
        } else {
            modelStatus.value = 'default'
            store.commit('setSongShuffle', false)
            store.commit('setSongRepeat', false)
        }
    }

    // 上一曲
    const previousSong = () => {
        if (currentRouter.value === '/personalFm') {
            return
        }
        const index = songList.value.findIndex((v: { id: any }) => v.id === songData.value.id)
        if (index - 1 < 0) {
            store.dispatch('getSongMsg', songList.value[songList.value.length])
        } else {
            store.dispatch('getSongMsg', songList.value[index - 1])
        }
    }

    // 播放下一曲
    const nextSong = () => {
        if (currentRouter.value === '/personalFm') {
            fmNext()
        } else {
            if (playState.value.shuffle) {
                shufflePlay()
            } else {
                nextPlay()
            }
        }
    }

    // 顺序播放
    const nextPlay = () => {
        if (currentRouter.value === '/personalFm') {
            fmNext()
            return
        }
        const index = songList.value.findIndex((v: { id: any }) => v.id === songData.value.id)

        if (index + 1 === songList.value.length) {
            window.localStorage.setItem('songItem', JSON.stringify(songList.value[0]))
            store.dispatch('getSongMsg', songList.value[0])
        } else {
            window.localStorage.setItem('songItem', JSON.stringify(songList.value[index + 1]))
            store.dispatch('getSongMsg', songList.value[index + 1])
        }
    }

    /**
     * 加载完成后播放
     */
    const play = () => {
        console.log(audio);
        audio.play()
        audio = document.querySelector('#audio audio')
        console.log(audio);
        audio.play()
    }

    return {
        playChange,
        stopPlay,
        modelStatus,
        modelChange,
        previousSong,
        nextSong,
        nextPlay,
        canplaythrough,
        timeupdate,
        playPlan,
        playMute,
        volumeMax,
        playVolume,
        changeShufflePlay,
        changeRepeatPlay,
        play,
    }
}
