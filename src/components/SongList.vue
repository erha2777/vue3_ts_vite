<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import { singerName } from '@/utils/utils'
import { useRouter } from 'vue-router'
import computedFn from '@/hooks/store'
import clickHighlightFn from '@/hooks/clickHighlight'
import personalFmFn from '@/hooks/model/personalFm'

const store = useStore()
const router = useRouter()

const currentRouter = computed(() => router.currentRoute.value.path)

const { songListFrom, songList, songData } = computedFn()

const { activeId, setActive } = clickHighlightFn()

const { currentIndex } = personalFmFn()

// 获取歌曲数据
const getSongData = async (item: any, index: number) => {
    if (currentRouter.value === '/personalFm') {
        currentIndex.value = index
        return
    }
    window.localStorage.setItem('songItem', JSON.stringify(item))
    store.dispatch('getSongMsg', item)
}
</script>

<template>
    <div id="songList-right">
        <div class="container">
            <div class="header">
                <h3>当前播放</h3>
                <div>
                    <div>总{{ songList.length }}首</div>
                </div>
            </div>
            <ul class="songList">
                <li
                    v-for="(item, index) in (songList as any[])"
                    :key="index"
                    :class="{ active: activeId === 'songListRight' + item.id }"
                    @dblclick="getSongData(item, index)"
                    @click="setActive('songListRight' + item.id)"
                >
                    <span class="name" :class="{ 'theme-text-color': item.id === songData.id }"><span class="iconfont icon-bofangzanting" v-if="item.id === songData.id"></span> {{ item.name }}</span>
                    <span :class="{ 'theme-text-color': item.id === songData.id }">{{ item.ar ? singerName(item['ar']) : singerName(item['artists']) }}</span>
                    <span><span :title="songListFrom" class="iconfont icon-lianjie"></span></span>
                    <span>{{ item['dt'] ? item['dt'] : item['duration'] }}</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped lang="scss">
#songList-right {
    position: fixed;
    top: 80px;
    right: 0;
    width: 400px;
    height: calc(100vh - 80px - 80px);
    overflow: hidden;
    .container {
        position: absolute;
        top: 0;
        right: 0;
        width: calc(100% - 5px);
        height: 100%;
        box-shadow: -1px 0px 5px 0px rgba(0, 0, 0, 0.1);
        border-radius: 10px 0 0 0;
        overflow-y: auto;
    }
}
.header {
    padding: 20px 20px 0;
    h3 {
        margin-bottom: 10px;
    }
    & > div {
        color: #cccccc;
        font-size: 14px;
        padding-bottom: 15px;
        border-bottom: 1px solid rgba($color: #ccc, $alpha: 0.1);
    }
}
.songList {
    .select {
        & > span:nth-child(1),
        & > span:nth-child(2) {
            color: red;
        }
    }
    .active {
        background-color: rgba($color: #ccc, $alpha: 0.6) !important;
    }
    li {
        display: flex;
        align-items: center;
        height: 30px;
        cursor: pointer;

        .name {
            position: relative;
            .iconfont {
                position: absolute;
                top: -1px;
                left: 0;
            }
        }
        &:nth-child(2n) {
            background-color: rgba($color: #ccc, $alpha: 0.1);
        }
        &:hover {
            background-color: rgba($color: #ccc, $alpha: 0.4);
        }
        & > span {
            display: block;
            font-size: 14px;
            &:nth-child(1) {
                width: 40%;
                padding-left: 20px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            &:nth-child(2) {
                width: 30%;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            &:nth-child(3) {
                width: 10%;
                text-align: center;
            }
            &:nth-child(4) {
                width: 20%;
            }
        }
    }
}
</style>
