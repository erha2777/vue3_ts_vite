<script setup lang="ts">
import {singerName,indexNumber,SongTime} from '@/utils/utils'
import storeFn from '@/hooks/store'
import clickHighlightFn  from '@/hooks/clickHighlight'
import playListFn from '@/hooks/model/playList'

const {
    songData
} = storeFn()

const {
    activeId,
    setActive,
} = clickHighlightFn()

const {
    isPlayListForm,
    songs,
    getSongDataFn,
    setSongList,
    mousedownFn
} = playListFn()

</script>

<template>
    <div class="playListMsg">
        <div class="header">
            <div class="coverImg">
            <img :src="isPlayListForm.coverImgUrl" width="200" height="200">
            </div>
            <div class="box-right">
                <h3 class="title"><span>歌单</span>{{ isPlayListForm.name }}</h3>
                <p class="creator"><img :src="isPlayListForm.creator.avatarUrl" width="30" height="30"> {{isPlayListForm.creator.nickname}} {{ isPlayListForm.createTime+'创建' }}</p>
                <p>
                    <button class="playAll theme-bg-color" @click="setSongList">
                      <span class="iconfont icon-bofang"></span>
                      播放全部
                    </button>
                </p>
                <p>标签：</p>
                <p>歌曲：{{ songs.length }}</p>
                <p>简介：</p>
            </div>
        </div>
        <div>

        </div>
    </div>
    <div>
        <ul class="songList">
            <li class="title">
                <span class="tac">操作</span>
                <span>标题</span>
                <span>歌手</span>
                <span>专辑</span>
                <span>时间</span>
            </li>
            <li v-for="(item,index) in songs" :key="index" 
            @dblclick="getSongDataFn(item)"
            @click="setActive('palyList'+item.id)" 
            @mousedown="mousedownFn($event,item)"
            :class="{'active':activeId==='palyList'+item.id}">
                <span class="operation">
                  <span class="index" :class="{'theme-text-color':item.id===songData.id}"><span style="font-size: 14px;" class="iconfont icon-24gf-volumeMiddle" v-if="item.id===songData.id"></span> {{ item.id===songData.id?'':indexNumber(index) }}</span>
                  <span class="iconfont icon-xihuan1 like"></span>
                  <span class="iconfont icon-xiazai"></span>
                </span>
                <span class="name" :class="{'theme-text-color':item.id===songData.id}">{{ item['name'] }}</span>
                <span>{{ singerName(item['ar']) }}</span>
                <span>{{ item['al'].name }}</span>
                <span>{{ SongTime(item['dt']) }}</span>
            </li>
        </ul>
    </div>
</template>

<style scoped lang="scss">
@import '@/styles/songlist.scss';
.playListMsg{
    padding: 20px;
    .header{
        display: flex;
    }
    .coverImg{
        margin-right: 20px;
    }
    .box-right{
        p{
            margin-bottom: 10px;
        }
        .playAll{
          padding: 5px 15px;
          border: none;
          color: white;
          border-radius: 15px;
          margin-left: 10px;
          cursor: pointer;
        }
    }
    .title{
        margin-bottom: 10px;
        span{
            padding: 1px 3px;
            font-weight: normal;
            border: 1px solid;
            border-radius: 5px;
            font-size: 16px;
            margin-right: 10px;
        }
    }
    .creator{
        img{
            border-radius: 50%;
            border: 1px solid #ccc;
        }
    }
}
</style>