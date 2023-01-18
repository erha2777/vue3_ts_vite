<script setup lang="ts">
import { singerName, indexNumber, SongTime } from '@/utils/utils'
import Pagination from '@/components/Pagination.vue'
import storeFn from '@/hooks/store'
import searchResultFn from '@/hooks/model/searchResult'
import clickHighlightFn from '@/hooks/clickHighlight'

const { songData } = storeFn()

const { activeId, setActive } = clickHighlightFn()

const { currentType, searchType, resultList, listForm, pageChange, keyword, filterValue, getSongDataFn, setSongList } = searchResultFn()
</script>

<template>
    <div id="searchResult">
        <header>
            <h3>搜索 {{ keyword }}</h3>
            <div class="changeType">
                <ul>
                    <li :class="{ select: currentType === item.type }" v-for="(item, index) in searchType" :key="index">
                        {{ item.name }}
                    </li>
                </ul>
                <span>找到 {{ listForm.total }} 首单曲</span>
            </div>
            <div>
                <button class="playAll theme-bg-color" @click="setSongList">
                    <span class="iconfont icon-bofang"></span>
                    播放全部
                </button>
            </div>
        </header>
        <main>
            <ul class="songList">
                <li class="title">
                    <span></span>
                    <span>音乐标题</span>
                    <span>歌手</span>
                    <span>专辑</span>
                    <span>时长</span>
                    <span>热度</span>
                </li>
                <li v-for="(item, index) in resultList" :key="index" @dblclick="getSongDataFn(item)" @click="setActive('palyList' + item.id)" :class="{ active: activeId === 'palyList' + item.id }">
                    <!-- {{ item.name }} -->
                    <span class="operation">
                        <span
                            class="index"
                            :class="{
                                'theme-text-color': item.id === songData.id,
                            }"
                            ><span style="font-size: 14px;" class="iconfont icon-24gf-volumeMiddle" v-if="item.id === songData.id"></span>
                            {{ item.id === songData.id ? '' : indexNumber(index + listForm.pageNum * listForm.pageSize) }}</span
                        >
                        <span class="iconfont icon-xihuan1 like"></span>
                        <span class="iconfont icon-xiazai"></span>
                    </span>
                    <span class="name" :class="{ 'theme-text-color': item.id === songData.id }" v-html="filterValue(item['name'])"></span>
                    <span v-html="filterValue(singerName(item['ar']))"></span>
                    <span v-html="filterValue(item['al'].name)"></span>
                    <span>{{ SongTime(item['dt']) }}</span>
                    <span>
                        <div class="pop">
                            <div class="popValue" :style="{ width: item['pop'] + '%' }"></div>
                        </div>
                    </span>
                </li>
            </ul>
            <Pagination :page-size="listForm.pageSize" :page-num="listForm.pageNum" :total="listForm.total" @pageChange="pageChange"></Pagination>
        </main>
    </div>
</template>

<style scoped lang="scss">
@import '@/styles/songlist.scss';
#searchResult {
    padding: 20px;
    header {
        margin-bottom: 20px;
        h3 {
            margin-bottom: 20px;
        }
        .playAll {
            padding: 5px 15px;
            border: none;
            color: white;
            border-radius: 15px;
            margin-left: 10px;
            cursor: pointer;
        }
    }
}
.result-list {
}
.changeType {
    display: flex;
    justify-content: space-between;
    align-items: center;
    line-height: 40px;
    margin-bottom: 20px;
    ul {
        display: flex;
        li {
            margin-right: 30px;
        }
    }
    .select {
        position: relative;
        &::after {
            content: '';
            position: absolute;
            left: 50%;
            bottom: 0;
            transform: translateX(-50%);
            width: 80%;
            height: 3px;
            background-color: red;
        }
    }
}
.songList {
    ::v-deep .keywords {
        color: #85b9e6 !important;
    }
    li > span {
        &:nth-child(1) {
            width: 10%;
        }
        &:nth-child(2) {
            width: 30%;
        }
        &:nth-child(3) {
            width: 20%;
        }
        &:nth-child(4) {
            width: 20%;
        }
        &:nth-child(5) {
            width: 10%;
        }
        &:nth-child(6) {
            width: 10%;
        }
    }
    .pop {
        width: 90%;
        height: 8px;
        border-radius: 10px;
        background-color: rgba($color: #ccc, $alpha: 0.2);
        .popValue {
            width: 100%;
            border-radius: 10px;
            height: 100%;
            background-color: rgba($color: #ccc, $alpha: 0.4);
        }
    }
}
</style>
