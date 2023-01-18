<script setup lang="ts">
import { ref } from 'vue'
import music from '@/hooks/music'
import computedFn from '@/hooks/store'

const { songData, songList, playState, playBar, playTime, endTime, volume } = computedFn()


const props = defineProps({
    right: {
        type: [String],
        default: '0px',
    },
    scrollShow: {
        type: [Boolean],
        default: true,
    },
})

const {
    previousSong,
    playChange,
    nextSong,
    playPlan,
    stopPlay,
    playMute,
    volumeMax,
    playVolume,
    changeShufflePlay,
    changeRepeatPlay,
} = music()

const audioShow = ref(false)
</script>
<template>
    <div class="m-audio" :style="{ right, transform: audioShow ? 'translate(-10px,-50%)' : `translate(${scrollShow ? '248px' : '240px'},-50%)` }">
        <header>
            <div>本地音乐</div>
            <span class="mr5 ml5">|</span>
            <div>在线音乐</div>
        </header>
        <main>
            <ul>
                <li v-for="(song, i) in (songList as any[])" :key="i" :class="{ activeSong: song.id === songData.id }">
                    {{ song.name }}
                </li>
            </ul>
        </main>
        <footer>
            <span class="progress_bar" @click="playPlan">
                <span class="progress_bar_value" :style="{ width: playBar }"></span>
            </span>
            <div class="timeStart">{{ playTime }}</div>
            <div class="timeEnd">{{ endTime }}</div>
            <span class="audio_mute" :class="{ muteT: volume === 0 }" @click="playMute">静音</span>
            <span class="volume_bar" @click="playVolume">进度条<span class="volume_bar_value" :style="{ width: volume * 100 + '%' }"></span></span>
            <span class="volume_max" @click="volumeMax">最大音量</span>
            <span class="audio_previous" @click="previousSong">上一曲</span>
            <span class="audio_play" :class="{ playT: !playState.stop }" @click="playChange">播放</span>
            <span class="audio_next" @click="nextSong">下一曲</span>
            <span class="audio_stop" @click="stopPlay">停止</span>
            <span class="audio_repeat" :class="{ repeat_click: playState.repeat }" @click="changeRepeatPlay">循环</span>
            <span class="audio_shuffle" :class="{ shuffle_click: playState.shuffle }" @click="changeShufflePlay">随机</span>
        </footer>
        <!-- {left:audioShow?'-24px':scrollShow?'-32px':'-24px'} -->
        <span v-show="audioShow" class="shrinkButton" @click="audioShow = false"><i class="iconfont icon-suoxiao2"></i></span>
        <span v-show="!audioShow" class="leftButton" :class="{ rotate360: !playState.stop }" :style="{ left: audioShow ? '-30px' : scrollShow ? '-40px' : '-30px' }" @click="audioShow = true"
            ><i class="iconfont icon-yinle"></i
        ></span>
        <!-- <audio
      :src="songData.url"
      ref="audio"
      autoplay
      @timeupdate="timeupdate"
      @canplaythrough="canplaythrough"
      @ended="nextSong"
      :loop="playState.repeat"
    ></audio> -->
    </div>
</template>

<style scoped lang="scss">
.m-audio {
    position: fixed;
    top: 50%;
    // width: 156px;
    width: 240px;
    transition: all 1s;
    background-color: rgba(000, 000, 000, 0.5);
    color: #fff;
    z-index: 999;
    header {
        display: flex;
        justify-content: center;
        padding: 15px 15px 10px;
    }
    main {
        position: relative;
        height: 200px;
        overflow: hidden;
        ul {
            position: absolute;
            top: 0;
            right: -8px;
            width: calc(100% + 8px);
            height: 200px;
            overflow: auto;
            li {
                padding-left: 5px;
                height: 25px;
                line-height: 25px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                &:hover {
                    background-color: rgba(255, 255, 255, 0.3);
                }
            }
            .activeSong {
                background-color: rgba(255, 255, 255, 0.6);
            }
        }
    }
    footer {
        padding: 20px 5px 10px;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        position: relative;
        span {
            font-size: 0;
        }
    }
    .shrinkButton {
        position: absolute;
        top: 0;
        left: 0;
        width: 24px;
        height: 24px;
        line-height: 24px;
        text-align: center;
        border-radius: 50%;
        // border: 1px solid rgba(255,255,255,0.5);
    }
    .leftButton {
        position: absolute;
        top: 50%;
        left: -24px;
        width: 24px;
        height: 24px;
        line-height: 24px;
        text-align: center;
        border-radius: 50%;
        transform: translateY(-50%);
        background-color: rgba(000, 000, 000, 0.5);
    }
    .rotate360 {
        animation: rotate 1.5s linear 0s infinite normal none running;
    }
}
/* 音量控件 */
.audio_mute,
.volume_max {
    width: 20px;
    height: 15px;
    padding-top: 0px;
}
.audio_mute {
    background: url('../assets/button.png') 0 -170px no-repeat;
}
.volume_max {
    background: url('../assets/button.png') 0 -186px no-repeat;
}
.audio_mute:hover {
    background: url('../assets/button.png') -19px -170px no-repeat;
}
.muteT {
    background: url('../assets/button.png') -60px -170px no-repeat;
}
.muteT:hover {
    background: url('../assets/button.png') -79px -170px no-repeat;
}
.volume_max:hover {
    background: url('../assets/button.png') -19px -186px no-repeat;
}
.volume_bar {
    background-color: #5c4169;
    width: 50px;
    height: 3px;
    display: inline-block;
    // position: relative;
    // top: -4px;
    border-radius: 3px;
    cursor: pointer;
    margin-left: 1px;
}
.volume_bar .volume_bar_value {
    width: 80%;
    display: inline-block;
    height: 3px;
    background-color: #6646a1;
}

/* 播放控件 */
.audio_previous,
.audio_next,
.audio_stop {
    width: 28px;
    height: 28px;
    // margin-top: 6px;
}
.audio_previous {
    background: url('../assets/button.png') 0 -112px no-repeat;
}
.audio_previous:hover {
    background: url('../assets/button.png') -29px -112px no-repeat;
}
.audio_next {
    background: url('../assets/button.png') 0 -141px no-repeat;
}
.audio_next:hover {
    background: url('../assets/button.png') -29px -141px no-repeat;
}
.audio_stop {
    background: url('../assets/button.png') 0 -83px no-repeat;
}
.audio_stop:hover {
    background: url('../assets/button.png') -29px -83px no-repeat;
}
.audio_play {
    width: 40px;
    height: 40px;
    background-image: url('../assets/button.png');
    background-repeat: no-repeat;
    background-color: transparent;
}
.audio_play:hover {
    background-position: -41px 0;
}
.playT {
    background-position: 0 -42px;
}
.playT:hover {
    background-position: -41px -42px;
}
/* 切换控件 */
.audio_repeat,
.audio_shuffle {
    width: 25px;
    height: 18px;
    line-height: 100%;
}
.audio_repeat {
    background: url('../assets/button.png') 0 -291px no-repeat;
}
.audio_repeat:hover {
    background: url('../assets/button.png') -30px -291px no-repeat;
}
.repeat_click {
    background: url('../assets/button.png') -30px -291px no-repeat;
}
.audio_shuffle {
    background: url('../assets/button.png') 0 -271px no-repeat;
}
.audio_shuffle:hover {
    background: url('../assets/button.png') -30px -271px no-repeat;
}
.shuffle_click {
    background: url('../assets/button.png') -30px -271px no-repeat;
}
/* 进度条 */
.progress_bar {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background-color: #8c738ef2;
}
.progress_bar_value {
    display: inline-block;
    height: 4px;
    background-color: #7e60ad;
}
.timeStart {
    font-size: 12px !important;
    position: absolute;
    top: 4px;
    left: 5px;
}
.timeEnd {
    font-size: 12px !important;
    position: absolute;
    top: 4px;
    right: 5px;
}
@keyframes rotate {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>
