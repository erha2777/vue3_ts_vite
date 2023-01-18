<script setup lang="ts">
import { getCurrentInstance } from 'vue';
import lyricBoxFn from '@/hooks/component/lyricBox'
const { proxy } = getCurrentInstance() as any;
const props = defineProps({
    boxHeight: {
        type:[String],
        default:'400px'
    },
    lyricTop:{
        type:[String],
        default:'30%'
    },
    color:{
        type:[String],
        default:'#636363'
    },
    currentColor:{
        type:[String],
        default:'#000'
    },
    scrollShow:{
        type:[Boolean],
        default:true
    },
    fontSize:{
        type:[Number],
    },
    textAg:{
        type:[String],
        default:'left'
    },
    lineHeight:{
        type:[Number],
        default:30
    },
    
});

const {
  lyricsDouble,
  lyricsForm,
  topNumber,
  currentIndex
} = lyricBoxFn(props,proxy)

</script>

<template>
  <div
    id="lyricBox"
    ref="lyricBox"
    :style="{ height: boxHeight,'overflow-y': scrollShow?'auto':'hidden','min-height':lyricsDouble?lineHeight*2*3+'px':lineHeight*3+'px'}"
  >
    <ul :style="{ top: '-' + topNumber + 'px','padding-top': lyricTop}">
      <li v-for="(item, index) in lyricsForm.lyrics" :key="index"
        :style="{
            'font-size':fontSize+'px',
            'line-height':lineHeight+'px',
            'min-height':lineHeight+'px',
            'text-align':textAg  as any
        }"
      >
        <a
          href="javascript:;"
          :class="{ currentItem: currentIndex === index }"
          :style="{color:currentIndex === index?currentColor:color}"
          >
          <p >{{ item.text?item.text:'　' }}</p>
          <p v-if="lyricsDouble">{{ item.text2?item.text2:'　' }}</p>
        </a>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
#lyricBox {
  position: relative;
//   bottom: 0;
//   right: 0;
  width: 100%;
  ul {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    transition: top 0.5s ease;
  }
  li {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .currentItem {
    font-weight: 700;
    white-space: normal;
    overflow: auto;
    text-overflow: initial;
  }
  &::-webkit-scrollbar-thumb {
    background-color: transparent;
  }
  &:hover {
    &::-webkit-scrollbar-thumb {
      background-color: #e0e0e0;
    }
  }
}
</style>
