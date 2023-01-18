<script setup lang="ts">
import paginationFn from '@/hooks/component/pagination'
const props = defineProps({
    pageSize: {
        type: [Number],
        default: 30,
    },
    pageNum: {
        type: [Number],
        default: 0,
    },
    total: {
        type: [Number],
        default: 0,
    },
})

const emit = defineEmits(['pageChange'])

const { pageForm, pageCount, previous, changeNum, next } = paginationFn(props, emit)
</script>

<template>
    <div class="pagination">
        <ul>
            <li @click="previous" :class="{ disable: pageForm.num === 0 }" class="previous"><span class="iconfont icon-shangyiyehoutuifanhui"></span></li>
            <li @click="changeNum(i)" :class="{ 'select theme-bg-color': pageForm.num === i }" v-for="(v, i) in pageCount" :key="i">{{ i + 1 }}</li>
            <li @click="next" :class="{ disable: pageForm.num + 1 === pageCount }" class="next"><span class="iconfont icon-xiayiyeqianjinchakangengduo"></span></li>
        </ul>
    </div>
</template>

<style scoped lang="scss">
.pagination {
    & > ul {
        display: flex;
        align-items: center;
        justify-content: center;
        li {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 30px;
            height: 30px;
            margin: 0 4px;
            border-radius: 5px;
            border: 1px solid rgba($color: #ccc, $alpha: 0.4);
            &:not(.select, .disable) {
                cursor: pointer;
            }
        }
        .select {
            border: none;
            color: #fff;
        }
        .disable {
            background-color: rgba($color: #ccc, $alpha: 0.1);
            color: rgba($color: #ccc, $alpha: 0.8);
        }
    }
}
</style>
