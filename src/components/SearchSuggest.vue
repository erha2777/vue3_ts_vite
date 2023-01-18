<script setup lang="ts">
import { singerName } from '@/utils/utils'
import searchSuggestFn from '@/hooks/component/searchSuggest'

const props = defineProps({
    show: {
        type: Boolean,
        default: false,
    },
    keywords: {
        type: String,
        default: '',
    },
})

const emit = defineEmits(['chengeValue'])

const { msgList, mobileSuggest, searchHot, searchHistory, filterValue, chengeValue } = searchSuggestFn(props, emit)

// 子组件 抛出方法(否则父组件获取不到)
defineExpose({ chengeValue });
</script>

<template>
    <div id="searchSuggest" v-show="show">
        <div class="searchMsg" v-show="keywords">
            <h6><span class="iconfont icon-sousuo"></span>猜你想搜</h6>
            <ul>
                <li @click="chengeValue(item.keyword)" v-for="(item, index) in mobileSuggest" :key="index" v-html="filterValue(item.keyword)"></li>
            </ul>
            <template v-for="(item, index) in msgList" :key="index">
                <h6><span class="iconfont" :class="item.icon"></span>{{ item.title }}</h6>
                <ul>
                    <template v-for="(v, i) in item.list" :key="i">
                        <li
                            @click="chengeValue(v.name)"
                            v-if="item.name === 'songs'"
                            v-html="filterValue(`${v.name}${v.alias.length > 0 ? '(' + v.alias[0] + ')' : ''} - ${singerName(v.artists)}`)"
                        ></li>
                        <li @click="chengeValue(v.name)" v-if="item.name === 'artists'" v-html="filterValue(v.name)"></li>
                        <li @click="chengeValue(v.name)" v-if="item.name === 'albums'" v-html="filterValue(`${v.name} - ${v.artist.name}`)"></li>
                        <li @click="chengeValue(v.name)" v-if="item.name === 'playlists'" v-html="filterValue(v.name)"></li>
                    </template>
                </ul>
            </template>
        </div>
        <div class="recommend" v-show="!keywords">
            <h6 v-show="searchHistory.length > 0" class="history-title">
                <div>搜索历史<span class="iconfont icon-shanchu ml5"></span></div>
                <span>查看全部</span>
            </h6>
            <ul v-show="searchHistory.length > 0" class="history">
                <li v-for="(item, index) in searchHistory" :key="index">{{ item }}</li>
            </ul>
            <h6>热搜榜</h6>
            <ul class="hot">
                <li v-for="(item, index) in searchHot" :key="index" @click="chengeValue(item.searchWord)">
                    <div class="index" :style="{ color: index + 1 <= 3 ? 'red' : '' }">{{ index + 1 }}</div>
                    <div>
                        <p>
                            <span class="text">{{ item.searchWord }}</span
                            ><span class="substyle">{{ item.score }}</span> <span class="hotIcon" v-if="item.iconType === 1">HOT</span>
                        </p>
                        <p class="substyle">{{ item.content }}</p>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped lang="scss">
#searchSuggest {
    position: fixed;
    top: 90px;
    left: 218px;
    width: 400px;
    height: 600px;
    border-radius: 5px;
    color: #000;
    overflow-y: auto;
    z-index: 9;
    h6 {
        font-size: 14px;
        line-height: 40px;
        color: #ccc;
        font-weight: normal;
        .iconfont {
            margin-right: 5px;
        }
    }
}
.searchMsg {
    padding: 10px;
    li {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        line-height: 40px;
        font-size: 14px;
        padding-left: 20px;
        ::v-deep .keywords {
            color: #85b9e6;
        }
        &:hover {
            background-color: rgba($color: #ccc, $alpha: 0.1);
        }
    }
}
.recommend {
    padding: 10px 0;
    h6 {
        padding: 0 20px;
    }
    .history-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .history {
        padding: 0 20px;
        display: flex;
        font-size: 12px;
        flex-wrap: wrap;
        li {
            margin-right: 10px;
            margin-bottom: 10px;
            padding: 5px 15px;
            border-radius: 10px;
            border: 1px solid rgba($color: #ccc, $alpha: 0.6);
            white-space: nowrap;
        }
    }
    .hot {
        font-size: 14px;
        li {
            display: flex;
            align-items: center;
            height: 60px;
            padding: 0 20px;
            p:nth-of-type(1) {
                margin-bottom: 5px;
            }
            &:hover {
                background-color: rgba($color: #ccc, $alpha: 0.1);
            }
        }
        .index {
            margin-right: 20px;
            color: rgba($color: #ccc, $alpha: 0.6);
        }
        .text {
            margin-right: 5px;
        }
        .substyle {
            font-size: 12px;
            color: rgba($color: #ccc, $alpha: 0.6);
        }
        .hotIcon {
            font-style: oblique;
            color: red;
            font-size: 12px;
        }
    }
}
</style>
