<script setup lang="ts">
import MiniAudio from '@/components/MiniAudio.vue'
import LyricBox from './LyricBox.vue'
import musicCanvasFn from '@/hooks/component/musicCanvas'

import computedFn from '@/hooks/store'

const { songData } = computedFn()

const { wrapHeight, reset, operationFlag, scrollShow, mouseX, mouseY, getImageUrl, bgList, bgIndex, bgChange } = musicCanvasFn()

const props = defineProps({
    showFlag: Boolean,
})

window.addEventListener('resize', () => {
    reset()
})

const emit = defineEmits(['close'])

const close = () => {
    operationFlag.value = false
    emit('close')
}
</script>

<template>
    <div id="musicCanvas" :class="{ show: showFlag }" :style="{ 'background-image': 'url(' + getImageUrl(bgList[bgIndex]) + ')' }">
        <div class="operation animated" :style="{ top: mouseY + 'px', left: mouseX + 'px' }" :class="{ bounceIn: operationFlag, bounceOut: !operationFlag }">
            <span class="iconfont icon-xuanxiang"></span>
            <ul class="options animated bounceInDown" v-show="operationFlag">
                <li @click="bgChange">
                    <span class="iconfont icon-dituqiehuan_0"></span>
                </li>
                <li @click="close">
                    <span class="iconfont icon-tuichu"></span>
                </li>
            </ul>
        </div>
        <div class="songMsg">
            <p class="name">{{ songData.name }}</p>
            <p class="singer">{{ songData.singer }}</p>
        </div>
        <div class="lyricContainer">
            <LyricBox
                lyricTop="calc((100vh - 120px - 400px - 80px) / 2)"
                :scrollShow="false"
                textAg="center"
                color="rgba(255,255,255,.4)"
                currentColor="rgba(255,255,255,1)"
                boxHeight="calc(100vh - 120px - 400px - 80px)"
                :lineHeight="60"
                :fontSize="30"
            >
            </LyricBox>
        </div>
        <div class="canvasBox">
            <canvas id="wrap" :height="wrapHeight" width="1000"></canvas>
        </div>
        <!-- 音乐播放器 -->
        <mini-audio :right="scrollShow ? '8px' : '0px'" :scrollShow="scrollShow" v-if="showFlag"></mini-audio>
    </div>
</template>

<style scoped lang="scss">
#musicCanvas {
    position: fixed;
    top: calc(100vh);
    left: 0;
    width: 100%;
    transition: top 0.5s;
    height: calc(100vh);
    background-color: rgba(000, 000, 000, 1);
    // background: url('../assets/bg/3.jpg') no-repeat;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    min-width: 1000px;
    z-index: 99;
}
.operation {
    position: absolute;
    width: 50px;
    height: 50px;
    text-align: center;
    line-height: 50px;
    background-color: rgba(255, 255, 255, 0.4);
    border-radius: 50%;
    .icon-xuanxiang {
        font-size: 24px;
        color: #fff;
    }
}
.options {
    position: absolute;
    top: calc(100% + 10px);
    left: 0;
    width: 100%;
    transition: all 1s;
    li {
        width: 50px;
        height: 50px;
        background-color: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        margin-bottom: 10px;
        cursor: pointer;
        .iconfont {
            color: rgba(255, 255, 255, 0.4);
        }
        &:hover {
            background-color: rgba(255, 255, 255, 0.4);
            .iconfont {
                color: #fff;
            }
        }
    }
}

.songMsg {
    margin-top: 80px;
    color: #fff;
    text-align: center;
    p {
        line-height: 60px;
        font-size: 30px;
    }
    .name {
        font-weight: 700;
    }
}

.canvasBox {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 400px;
}
.canvasBox,
.icon-xuanxiang,
.songMsg,
.lyricContainer {
    pointer-events: none;
}
.show {
    top: 0 !important;
}
</style>
