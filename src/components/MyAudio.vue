<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import music from '@/hooks/music'
// import { getCurrentInstance } from 'vue'

const store = useStore()
const songData = computed(() => store.state.songData) as any
const playState = computed(() => store.state.playState) as any
const endTime = computed(() => store.state.endTime)
const playTime = computed(() => store.state.playTime)
const playBar = computed(() => store.state.playBar)

// const { proxy } = getCurrentInstance() as any

const { modelStatus, modelChange, previousSong, playChange, nextPlay, playPlan, timeupdate, canplaythrough, nextSong } = music()

</script>

<template>
    <div id="audio">
        <div class="controller">
            <span
                class="iconfont"
                :class="{
                    'icon-suijibofang': playState.shuffle && !playState.repeat,
                    'icon-liebiaoshunxu': modelStatus === 'default',
                    'icon-caozuo-xunhuan1': playState.repeat && !playState.shuffle,
                }"
                @click="modelChange"
            ></span>
            <span class="iconfont icon-shangyiqu" @click="previousSong"></span>
            <div class="audio_play" @click="playChange">
                <span
                    class="iconfont text-color"
                    :class="{
                        'icon-24gf-pause2': !playState.stop,
                        'icon-bofang': playState.stop,
                    }"
                ></span>
            </div>
            <span class="iconfont icon-xiayiqu" @click="nextPlay"></span>
            <span class="iconfont icon-geciweidianji"></span>
        </div>
        <div class="progress_box">
            <span>{{ playTime }}</span>
            <div class="progress_bar" @click="playPlan">
                <span class="progress_bar_value theme-bg-color" :style="{ width: playBar }"></span>
            </div>
            <span>{{ endTime }}</span>
        </div>
        <audio
            ref="audio"
            :src="songData.url ? songData.url : './'"
            autoplay
            @timeupdate="timeupdate"
            @canplaythrough="canplaythrough"
            @ended="nextSong"
            :loop="playState.repeat"
            crossorigin="anonymous"
        ></audio>
    </div>
</template>
<style scoped lang="scss">
#audio {
    position: relative;
    width: 400px;
    height: 80px;
}
.controller {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 80%;
    .iconfont {
        font-size: 20px;
        margin: 0 20px;
        cursor: pointer;
    }
    .audio_play {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: rgba($color: #ccc, $alpha: 0.2);
        cursor: pointer;
        span {
            font-size: 18px;
        }
        .icon-bofang {
            transform: translateX(2px);
        }
        &:hover {
            background-color: rgba($color: #ccc, $alpha: 0.6);
        }
    }
}
.progress_box {
    position: absolute;
    bottom: 10px;
    left: 0;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #cecece;
}
.progress_bar {
    position: relative;
    //   top: 0;
    //   left: 0;
    width: 75%;
    height: 4px;
    background-color: #cecece;
}
.progress_bar_value {
    pointer-events: none;
    position: absolute;
    top: 0;
    left: 0;
    display: inline-block;
    height: 4px;
}
</style>
