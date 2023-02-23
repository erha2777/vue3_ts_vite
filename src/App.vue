<script setup lang="ts">
import LoginBox from './components/LoginBox.vue'
import MyAudio from './components/MyAudio.vue'
import SongList from './components/SongList.vue'
import ContentBox from './components/ContentBox.vue'
import MusicCanvas from './components/MusicCanvas.vue'
import SearchSuggest from './components/SearchSuggest.vue'
import RightClickMenu from './components/RightClickMenu.vue'

import AppFn from '@/hooks/model/app'
import themeFn from '@/hooks/theme'

import { useStore } from 'vuex'

// import music from '@/hooks/music'
// import { ipcRenderer } from 'electron' // script标签内，引入ipcRenderer
// const { ipcRenderer } = require('electron') // script标签内，引入ipcRenderer

const store = useStore()

// 主题切换相关
const { themeFlag, theme, themeType, changeThemeType, themeList, themeColorChange, themeColor, changeTheme } = themeFn()

const {
    currentRouter, // 路由相关
    history,
    routerPush,
    routerBack,
    routerNext,
    userInfo, // 用户数据
    songData, // 歌曲数据
    volume, // 音量
    songListFlag, // 控制显示隐藏相关
    userInfoFlag,
    loginFlag,
    showContentFlag,
    showMusicCanvas,
    searchFlag, // 搜索相关
    searchValue,
    chengeValue,
    clickSignIn, // 签到相关
    qdFlag,
    myCreateFlag, // 左侧菜单相关
    myCreate,
    collectionFlag,
    collection,
    playVolume, // footer底部相关
    mouseenter1,
    gdFlag1,
    timerFlag1,
    mouseenter2,
    gdFlag2,
    timerFlag2,
    enterSearch,
    logoutFn,
    isFullScreen
} = AppFn()



// 获取用户登录状态
// if (window.localStorage.getItem('cookie')) {
store.dispatch('getLoginStatus')
// } else {
//     store.dispatch('getYKCookie')
// }
// const { play } = music()

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
</script>

<template>
    <header
        id="header"
        @selectstart="
            () => {
                return false
            }
        "
    >
        <div class="logo">网易云音乐</div>
        <div class="header-right">
            <div class="flex">
                <div class="router nodrag">
                    <span :class="{ not: !history.state.back }" class="iconfont icon-shangyiyehoutuifanhui" @click="routerBack"></span>
                    <span :class="{ not: !history.state.forward }" class="iconfont icon-xiayiyeqianjinchakangengduo" @click="routerNext"></span>
                </div>
                <div class="searchBox nodrag">
                    <input @keyup.enter="enterSearch" id="searchInput" type="search" v-model="searchValue" @click="searchFlag = true" />
                </div>
            </div>
            <div class="flex_ac">
                <div class="userInfo nodrag" v-if="!userInfo.nickname" @click="loginFlag = !loginFlag">
                    <img class="avatar" src="./assets/avatar.png" alt="" />
                    未登录
                </div>
                <div class="userInfo" v-else>
                    <div class="userInfo-box nodrag" @click="userInfoFlag = !userInfoFlag">
                        <img class="avatar" :src="userInfo.avatarUrl" alt="" />
                        {{ userInfo.nickname }}
                        <span class="iconfont icon-xiala"></span>
                    </div>
                    <div class="userInfo-drop-down nodrag" v-show="userInfoFlag">
                        <div class="drop-down-top">
                            <ul>
                                <li>
                                    <span class="text-color">3</span>
                                    动态
                                </li>
                                <li>
                                    <span class="text-color">4</span>
                                    关注
                                </li>
                                <li>
                                    <span class="text-color">1</span>
                                    粉丝
                                </li>
                            </ul>
                            <button :style="{ cursor: qdFlag ? 'not-allowed' : 'pointer' }" :class="{ isFlag: qdFlag }" @click="clickSignIn">{{ qdFlag ? '已签到' : '签到' }}</button>
                        </div>
                        <ul>
                            <li class="text-color" @click="logoutFn"><span class="iconfont icon-tuichu"></span> 退出登录</li>
                        </ul>
                    </div>
                </div>
                <div class="theme nodrag">
                    <span class="iconfont icon-pifuzhuti-xianxing" @click="themeFlag = !themeFlag"></span>
                    <div class="theme-drop-down" v-show="themeFlag">
                        <ul class="model-change">
                            <li class="text-color" :class="{ select: themeType === 'theme' }" @click="changeThemeType('theme')">主题</li>
                            <li class="text-color" :class="{ select: themeType === 'color' }" @click="changeThemeType('color')">纯色</li>
                        </ul>
                        <div class="select-box">
                            <ul class="theme-list" v-if="themeType === 'theme'">
                                <li v-for="(item, index) in themeList" :key="index" :style="{ 'background-color': item.color }" @click="changeTheme(item.name)">
                                    {{ item.text }}
                                    <span class="iconfont icon-choosehandle" v-if="item.name === theme"></span>
                                </li>
                            </ul>
                            <div v-else>
                                <input @change="themeColorChange" v-model="themeColor" type="color" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="setting">
                    <span class="iconfont icon-shezhi nodrag"></span>
                </div>
                <div class="messages">
                    <span class="iconfont icon-youjian nodrag"></span>
                </div>
                <div class="operation">
                    <span class="iconfont icon-suoxiao1 nodrag"></span>
                    <span class="iconfont icon-suoxiao nodrag" @click="minimizeWin"></span>
                    <span class="iconfont nodrag" :class="{'icon-suoxiao4':isFullScreen,'icon-fangda':!isFullScreen}" @click="maximizeWin"></span>
                    <!-- <span class="iconfont icon-suoxiao4" @click="maximizeWin"></span> -->
                    <span class="iconfont icon-guanbi nodrag" @click="closeWin"></span>
                </div>
            </div>
        </div>
    </header>
    <main id="main">
        <aside id="aside" class="theme-border-color">
            <div :class="{ active: currentRouter.path === '/home' }" @click="routerPush('/home')">
                发现音乐
            </div>
            <div :class="{ active: currentRouter.path === '/personalFm' }" @click="routerPush('/personalFm')">
                私人FM
            </div>
            <div>我的音乐</div>
            <div @click="myCreateFlag = !myCreateFlag" class="myCreate">
                创建的歌单
                <span
                    class="iconfont"
                    :class="{
                        'icon--shanglajiantou': myCreateFlag,
                        'icon--xialajiantou': !myCreateFlag,
                    }"
                ></span>
            </div>
            <ul v-show="!myCreateFlag">
                <li
                    v-for="(item, index) in myCreate"
                    :key="index"
                    @click="routerPush({ name: 'palyList', params: { id: item.id } })"
                    :class="{ active: currentRouter.path === '/palyList/' + item.id }"
                >
                    {{ item.name }}
                </li>
            </ul>
            <div @click="collectionFlag = !collectionFlag" class="myCollection">
                收藏的歌单
                <span
                    class="iconfont"
                    :class="{
                        'icon--shanglajiantou': collectionFlag,
                        'icon--xialajiantou': !collectionFlag,
                    }"
                ></span>
            </div>
            <ul v-show="!collectionFlag">
                <li
                    v-for="(item, index) in collection"
                    :key="index"
                    @click="routerPush({ name: 'palyList', params: { id: item.id } })"
                    :class="{ active: currentRouter.path === '/palyList/' + item.id }"
                >
                    {{ item.name }}
                </li>
            </ul>
        </aside>
        <div class="container">
            <router-view></router-view>
        </div>
    </main>
    <footer id="footer" class="theme-border-color" :class="{ transparentCss: showMusicCanvas }">
        <div class="footer-left">
            <img :src="songData.picUrl" width="50" @click="showContentFlag = !showContentFlag" />
            <div class="songMsg">
                <div class="songName">
                    <div @mouseenter="mouseenter1" :style="{ width: gdFlag1 ? '120px' : 'fit-content' }" :title="songData.name">
                        <span ref="text1" :class="{ 'animation-text': gdFlag1 && timerFlag1 }">
                            {{ gdFlag1 ? songData.name + '   ' + songData.name : songData.name }}
                        </span>
                    </div>
                    <span class="iconfont icon-xihuan1"></span>
                </div>
                <div class="singer">
                    <div @mouseenter="mouseenter2" :style="{ width: gdFlag2 ? '140px' : 'fit-content' }" :title="songData.singer">
                        <span ref="text2" :class="{ 'animation-text': gdFlag2 && timerFlag2 }">
                            {{ gdFlag2 ? songData.singer + '   ' + songData.singer : songData.singer }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <div>
            <my-audio></my-audio>
        </div>
        <div class="footer-right">
            <span class="iconfont icon-chakanpinpu" @click="showMusicCanvas = !showMusicCanvas"></span>
            <span class="iconfont icon-24gl-volumeZero">
                <div class="volumeBar">
                    <div class="volumeBox" @click="playVolume">
                        <div class="volumeValue" :style="{ height: volume * 100 + '%' }">
                            <span class="dot"></span>
                        </div>
                    </div>
                </div>
            </span>
            <span class="iconfont icon-24gf-playlistMusic5" @click="songListFlag = !songListFlag"></span>
        </div>
    </footer>
    <LoginBox v-if="loginFlag" @close="loginFlag = false"></LoginBox>
    <SongList v-if="songListFlag"></SongList>
    <ContentBox :theme="theme" :showFlag="showContentFlag" @close="showContentFlag = false"></ContentBox>
    <MusicCanvas :showFlag="showMusicCanvas" @close="showMusicCanvas = false"></MusicCanvas>
    <SearchSuggest ref="child" :keywords="searchValue" @chengeValue="chengeValue" :show="searchFlag"></SearchSuggest>
    <RightClickMenu></RightClickMenu>
</template>

<style scoped lang="scss">
@import '@/styles/app.scss';
</style>
