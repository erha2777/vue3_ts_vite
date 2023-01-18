<script setup lang="ts">
import { useStore } from 'vuex';
import { onMounted,computed } from 'vue';
import { singerName, indexNumber } from '@/utils/utils';
import dayjs from 'dayjs'
import storeFn from '@/hooks/store'
import homeFn from '@/hooks/model/home'
import clickHighlightFn  from '@/hooks/clickHighlight'


const {
    songData
} = storeFn()

const {
  dailySongs,
  getData,
  getSongDataFn,
  setSongList,
  mousedownFn
} = homeFn()

const {
    activeId,
    setActive,
} = clickHighlightFn()



onMounted(() => {
  document.cookie = localStorage.getItem('cookie') + '';
  getData();
});
</script>

<template>
  <div id="dailySongs">
    <div class="home-header theme-border-color">
    <div class="flex">
      <div class="date theme-text-color">
        <span class="num">{{dayjs(new Date()).format('DD')}}</span>
        <span class="iconfont icon-rili"></span>
      </div>
      <div class="box-right">
        <h3>每日歌曲推荐</h3>
        <p>根据你的音乐口味生成，每天6:00更新</p>
      </div>
    </div>
    <div>
      <button class="playAll theme-bg-color" @click="setSongList">
        <span class="iconfont icon-bofang"></span>
        播放全部
      </button>
    </div>
  </div>
  <ul class="songList">
    <li class="title">
      <span></span>
      <span>音乐标题</span>
      <span>歌手</span>
      <span>专辑</span>
      <span>时长</span>
    </li>
    <li
      v-for="(item, index) in dailySongs"
      :key="index"
      @dblclick="getSongDataFn(item)"
      @click="setActive('mrtj'+item.id)" 
      @mousedown="mousedownFn($event,item)"
      :class="{'active':activeId==='mrtj'+item.id}"
      class="rightClick"
    >
      <span class="operation">
        <span class="index"><span class="iconfont icon-24gf-volumeMiddle" :class="{'theme-text-color':item.id===songData.id}" v-if="item.id===songData.id"></span> {{ item.id===songData.id?'':indexNumber(index) }}</span>
        <span class="iconfont icon-xihuan1 like"></span>
        <span class="iconfont icon-xiazai"></span>
      </span>
      <span class="name" :class="{'theme-text-color':item.id===songData.id}">{{ item['name'] }}</span>
      <span>{{ singerName(item['ar']) }}</span>
      <span>{{ item['al'].name }}</span>
      <span>时长</span>
    </li>
  </ul>
</div>
</template>

<style scoped lang="scss">
@import '@/styles/songlist.scss';
.home-header {
  border-bottom: 1px solid;
  padding: 10px;
  .date {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  .num {
    width: fit-content;
    white-space: nowrap;
    position: absolute;
    font-size: 40px;
    font-weight: 700;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -20%);
  }
  .icon-rili {
    font-size: 100px;
  }
  .box-right {
    padding-left: 20px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    h3 {
      margin-bottom: 10px;
    }
    p{
      font-size: 14px;
      color: rgba($color: #ccc, $alpha: .6);
    }
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
</style>
