<script setup lang="ts">
import { getCurrentInstance } from 'vue'
import computedFn from '@/hooks/store'
import rightClickMenuFn from '@/hooks/component/rightClickMenu'
const { proxy } = getCurrentInstance() as any

const { show, type, rightClickMenu } = computedFn()

const { myCreate, boxForm, boxTop, collection, delCollection } = rightClickMenuFn(proxy)
</script>

<template>
    <div id="rightClickMenu" v-show="show" :style="{ top: rightClickMenu.mouseY + 'px', left: rightClickMenu.mouseX + 'px' }">
        <ul>
            <li>
                <div class="left"><span class="iconfont icon-24gl-playCircle"></span>播放</div>
            </li>
            <li class="collection" v-show="type === 'add'">
                <div class="left"><span class="iconfont icon-24gl-folderPlus"></span>收藏到歌单</div>
                <span class="iconfont icon-sanjiaoright"></span>
                <div ref="songSheet" class="songSheet" :style="{ transform: `translateY(${boxTop}px)`, left: boxForm.right < 0 ? '' : '100%', right: boxForm.right < 0 ? '100%' : '' }">
                    <ul>
                        <li @click="collection(item.id)" v-for="(item, index) in myCreate" :key="index">{{ item.name }}</li>
                    </ul>
                </div>
            </li>
            <li v-show="type === 'del'" @click="delCollection">
                <div class="left"><span class="iconfont icon-shanchu"></span>从歌单中删除</div>
            </li>
        </ul>
    </div>
</template>

<style scoped lang="scss">
#rightClickMenu {
    position: fixed;
    width: 200px;
    border-radius: 5px;
    box-shadow: 0px 0px 5px 1px rgba($color: #000, $alpha: 0.2);
    padding: 10px 0 10px;
    z-index: 9999;
    & > ul > li {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 40px;
        padding: 0 10px;
        font-size: 14px;
        .left {
            display: flex;
            align-items: center;
            span {
                margin-right: 10px;
                font-size: 16px;
            }
        }
        &:hover {
            background-color: rgba($color: #ccc, $alpha: 0.1);
        }
    }
    .collection {
        position: relative;

        .songSheet {
            border-left: 10px solid transparent;
            border-right: 10px solid transparent;
            visibility: hidden;
            position: absolute;
            top: 50%;
            // left: 100%;
            // transform: translateY(-50%);
            width: 200px;
            ul {
                border-radius: 5px;
                box-shadow: 0px 0px 5px 1px rgba($color: #000, $alpha: 0.2);
                max-height: 100vh;
                overflow-y: auto;
            }
            li {
                line-height: 30px;
                padding: 0 10px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                &:hover {
                    background-color: rgba($color: #ccc, $alpha: 0.1);
                }
            }
        }
        &:hover {
            .songSheet {
                visibility: visible;
            }
        }
    }
}
</style>
