<script setup lang="ts">
import { getCurrentInstance } from 'vue'
import LyricBox from './LyricBox.vue'
import CommentBox from './CommentBox.vue'
import contentBoxFn from '@/hooks/component/contentBox'
import computedFn from '@/hooks/store'
import fullScreenFn from '@/hooks/fullScreen'
import electronFn from '@/hooks/electron'

const { songListFrom, songData, playStop } = computedFn()

const props = defineProps({
    showFlag: Boolean,
    theme: String,
})
const { proxy } = getCurrentInstance() as any

const emit = defineEmits(['close'])

const { rgbStr, close } = contentBoxFn(proxy, emit)

const {fullScreenFlag, myFullScreen, closeMyFullScreen} = fullScreenFn()
const { minimizeWin, maximizeWin, closeWin, isFullScreen } = electronFn()
</script>

<template>
    <div
        id="contentBox"
        :class="{ show: showFlag }"
        :style="{ 'background-image': theme !== 'dark' ? `linear-gradient(${rgbStr} 0,#fff 45%)` : '', 'background-color': theme === 'dark' ? '#2b2b2b' : '' }"
    >
        <header>
            <div class="logo" v-if="!fullScreenFlag">
                <span class="iconfont icon-xiangxiajiantou" @click="close"></span>
            </div>
            <div class="header-right" v-if="!fullScreenFlag">
                <div class="flex">
                    <div class="router">
                        <span class="iconfont icon-shangyiyehoutuifanhui"></span>
                        <span class="iconfont icon-xiayiyeqianjinchakangengduo"></span>
                    </div>
                    <div class="search">
                        <input type="search" />
                    </div>
                </div>
                <div class="flex_ac">
                    <div class="fullScreen" @click="myFullScreen">
                        <span class="iconfont icon-wangyequanping"></span>
                        全屏纯享
                    </div>
                    <div class="setting">
                        <span class="iconfont icon-shezhi"></span>
                    </div>
                    <div class="messages">
                        <span class="iconfont icon-youjian"></span>
                    </div>
                    <div class="operation">
                        <span class="iconfont icon-suoxiao1 nodrag"></span>
                        <span class="iconfont icon-suoxiao nodrag" @click="minimizeWin"></span>
                        <span class="iconfont nodrag" :class="{ 'icon-suoxiao4': isFullScreen, 'icon-fangda': !isFullScreen }" @click="maximizeWin"></span>
                        <span class="iconfont icon-guanbi nodrag" @click="closeWin"></span>
                        </div>
                </div>
            </div>
            <div class="closeMyFullScreen" v-if="fullScreenFlag">
                <span class="iconfont icon-suoxiao3" @click="closeMyFullScreen"></span>
            </div>
        </header>
        <main>
            <div>
                <div class="contioner">
                    <div class="box-left">
                        <div ref="rotate360" class="rotate360" :style="{ 'animation-play-state': playStop ? 'paused' : 'running' }">
                            <div :style="{ 'background-image': 'url(' + songData.picUrl + ')' }"></div>
                        </div>
                    </div>
                    <div class="box-right">
                        <h3 class="title">{{ songData.name }}</h3>
                        <div class="msg">
                            <span class="singer">歌手: {{ songData.singer }}</span>
                            <span class="album">专辑: {{ songData.album }}</span>
                            <span>来源: {{ songListFrom }}</span>
                        </div>
                        <div class="msg2">
                            {{ songData.alia }}
                        </div>
                        <LyricBox
                            :boxHeight="songData.name.length < 25 ? '400px' : '360px'"
                            lyricTop="30%"
                            :color="theme === 'dark' ? '#6b6b6b' : '#636363'"
                            :currentColor="theme === 'dark' ? '#fff' : '#000'"
                        ></LyricBox>
                    </div>
                </div>
                <CommentBox></CommentBox>
            </div>
        </main>
    </div>
</template>

<style scoped lang="scss">
$font-color: #868381;

#contentBox {
    position: fixed;
    top: calc(100vh - 80px);
    left: 0;
    width: 100%;
    height: calc(100vh - 80px);
    transition: top 0.5s;
    z-index: 9;
    // background-image: linear-gradient(#ded9d5 0,#fff 45%);
}
.show {
    top: 0 !important;
}
header {
    position: relative;
    width: 100%;
    height: 80px;
    display: flex;
    align-items: center;
    .iconfont {
        font-size: 20px;
        margin: 0 5px;
        cursor: pointer;
    }
    .header-right {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: $font-color;
    }

    .logo {
        width: 200px;
        font-size: 24px;
        .iconfont {
            margin-left: 30px;
            cursor: pointer;
        }
    }
    .router {
        margin-right: 10px;
    }
    .search {
        input {
            outline: none;
            border: none;
            border-radius: 10px;
            height: 25px;
            padding-left: 10px;
        }
    }
    .fullScreen {
        margin-right: 10px;
        cursor: pointer;
        display: flex;
        align-items: center;
        .iconfont {
            margin: 0;
            margin-right: 5px;
        }
    }
    .operation {
        border-left: 1px solid $font-color;
        margin-left: 10px;
        padding: 0 5px;
    }
    .closeMyFullScreen {
        position: absolute;
        top: 50%;
        right: 50px;
        transform: translateY(-50%);
        .iconfont {
            font-size: 50px;
        }
    }
}
main {
    width: 100%;
    overflow-y: auto;
    height: calc(100vh - 80px - 80px);
    &::-webkit-scrollbar-thumb {
        background-color: transparent;
    }
    &:hover {
        &::-webkit-scrollbar-thumb {
            background-color: #e0e0e0;
        }
    }
    & > div {
        width: 1000px;
        margin: 0 auto;
    }
}
.contioner {
    display: flex;
    height: 500px;
    & > div {
        width: 50%;
        height: 100%;
    }
    .box-left {
        display: flex;
        align-items: center;
        justify-content: center;
        & > div {
            width: 320px;
            height: 320px;
            border-radius: 50%;
            border: 10px solid rgba($color: #dadad9, $alpha: 0.5);
            & > div {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                border: 38px solid #000;
                background-size: cover;
                background-position: center;
            }
        }
        .rotate360 {
            animation: 30s rotate360 infinite linear;
        }
        .rotate360-2 {
            animation: 30s rotate360-2 infinite linear;
        }
    }
    .box-right {
        position: relative;
        overflow: hidden;
        .title {
            font-size: 30px;
            font-weight: normal;
            margin: 10px 0;
        }
        .msg {
            font-size: 14px;
            color: #8b8987;
            display: flex;
            span {
                display: block;
                margin-right: 20px;
            }
            .album {
                max-width: 80px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .singer {
                max-width: 160px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
        .msg2 {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin-top: 10px;
            font-size: 14px;
            color: #8b8987;
        }
    }
}

@keyframes rotate360 {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
@keyframes rotate360-2 {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>
