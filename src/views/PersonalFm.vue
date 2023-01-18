<script setup lang="ts">
import {singerName} from '@/utils/utils'
import LyricBox from '@/components/LyricBox.vue';
import CommentBox from '@/components/CommentBox.vue';
import personalFmFn from '@/hooks/model/personalFm'
import storeFn from '@/hooks/store'
import music from '@/hooks/music';

const {
    songData,
    theme,
    playStop
} = storeFn()

const {
    playChange
} = music()

const {
    currentIndex,
    next,
    songlist,
    getPersonalFm1,
    changeSong,
    mousedownFn
} =personalFmFn()

getPersonalFm1();

</script>

<template>
<div id="personalFm">
    <div class="songMsg">
        <div class="box-left">
            <div class="pic">
                <div class="img" @click="changeSong(index)" :class="{'hidden':index<currentIndex-1,'current':index===currentIndex,'previous':index===currentIndex-1,'next':index===currentIndex+1}" v-for="(item,index) in songlist" :key="index" :style="{'background-image':`url(${item.album.picUrl})`}">
                    <div v-if="index===currentIndex" @click="playChange" class="playButton" :class="{'middle':playStop,'bottom':!playStop}"><span class="iconfont theme-text-color" :class="{'icon-bofang':playStop,'icon-bofangzanting':!playStop}"></span></div>
                </div>
            </div>
            <div class="operation">
                <div><span class="iconfont icon-xihuan1"></span></div>
                <div><span class="iconfont icon-shanchu"></span></div>
                <div @click="next"><span class="iconfont icon-next"></span></div>
                <div class="rightClick" @mousedown="mousedownFn"><span class="iconfont icon-24gf-ellipsis"></span></div>
            </div>
        </div>
        <div class="box-right">
            <h3 class="name">{{ songlist[currentIndex]?.name }}</h3>
            <p class="alias">{{ songlist[currentIndex]?.alias[0] }}</p>
            <p class="msg"><span>专辑: {{  songlist[currentIndex]?.album.name }}</span><span>歌手: {{ songlist[currentIndex]?.artists?singerName(songlist[currentIndex].artists):[] }}</span></p>
            <LyricBox :boxHeight="songData.name.length < 25 ? '420px' : '380px'" lyricTop="30%" 
            :color="theme==='dark'?'#6b6b6b':'#636363'" :currentColor="theme==='dark'?'#fff':'#000'"></LyricBox>
        </div>
    </div>
    <CommentBox></CommentBox>
</div>
</template>

<style scoped lang="scss">
#personalFm{
    max-width: 1000px;
    margin: 0 auto;
}
.songMsg{
    display: flex;
    &>div{
        width: 50%;
    }
}
.box-left{
    .pic{
        position: relative;
        height: 350px;
        margin-top: 100px;
        margin-bottom: 40px;
        overflow: hidden;
        .img{
            position: absolute;
            left: 50%;
            transform: translateX(84%);
            transition: all 1s;
            min-width: 350px;
            width: 350px;
            height: 350px;
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            border-radius: 5px;

            &.hidden{
                transform: translateX(-80%) scale(.6);
                opacity: 0;
            }
            &.previous{
                transform: translateX(-60%) scale(.8);
                cursor: pointer;
            }
            &.current{
                transform: translateX(-40%);
                z-index: 2;
            }
            &.next{
                transform: translateX(84%);
                z-index: 3;
            }
        }
        .playButton{
            position: absolute;
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background-color: rgba($color: #fff, $alpha: .9);
            border: 1px solid rgba($color: #ccc, $alpha: .3);
            z-index: 5;
            transition: all .5s ;
            cursor: pointer;
            span{
                font-size: 24px;
                line-height: 24px;
            }
            .icon-bofang{
                transform: translate(3px,1px);
            }
        }
        .middle{
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
        }
        .bottom{
            top: 90%;
            left: 90%;
            transform: translate(-50%,-50%);
            // right: 10px;
            // bottom: 10px;
        }
    }
    .operation{
        display: flex;
        justify-content: flex-end;
        &>div{
            width: 50px;
            height: 50px;
            line-height: 50px;
            text-align: center;
            border-radius: 50%;
            background-color: rgba($color: #ccc, $alpha: .2);
            border:1px solid rgba($color: #ccc, $alpha: .3);
            margin-right: 40px;
            cursor: pointer;
        }
    }
}
.box-right{
    padding-top: 40px;
    .name{
        line-height: 40px;
        font-weight: normal;
        font-size: 24px;
    }
    .alias{
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 30px;
        white-space: nowrap;
        font-size: 14px;
    }
    .msg{
        line-height: 30px;
        display: flex;
        font-size: 14px;
        span{
            width: 50%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            display: block;
        }
    }
}
</style>