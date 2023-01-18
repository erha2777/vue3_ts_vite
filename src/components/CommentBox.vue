<script setup lang="ts">
import dayjs from 'dayjs'
import computedFn from '@/hooks/store'
const { songData } = computedFn()
</script>

<template>
    <div class="commentBox">
        <div class="allTitle">全部评论({{ songData.commentCount }})</div>
        <ul class="hot">
            <li v-for="(comment, index) in (songData.comments as any[])" :key="index">
                <div class="avatar">
                    <img :src="comment.user.avatarUrl" />
                </div>
                <div class="content">
                    <div class="comment">
                        <a href="javascript:;" class="theme-comment-username-color">{{ comment.user.nickname }} : </a>{{ comment.content }}
                    </div>
                    <div class="operation">
                        <span class="time">{{ dayjs(comment.time).format('YYYY年MM月DD日 HH:mm') }}</span>
                        <span class="like"><span class="iconfont icon-zan"></span>{{ comment.likedCount }}</span>
                    </div>
                </div>
            </li>
        </ul>
        <div class="newTitle">
            最新评论
        </div>
        <ul class="new">
            <li v-for="(comment, index) in (songData.newComments as any[])" :key="index">
                <div class="avatar">
                    <img :src="comment.user.avatarUrl" />
                </div>
                <div class="content">
                    <div class="comment">
                        <a href="javascript:;" class="theme-comment-username-color">{{ comment.user.nickname }} : </a>{{ comment.content }}
                    </div>
                    <div class="operation">
                        <span class="time">{{ dayjs(comment.time).format('YYYY年MM月DD日 HH:mm') }}</span>
                        <span class="like"><span class="iconfont icon-zan"></span>{{ comment.likedCount }}</span>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<style scoped lang="scss">
.commentBox {
    width: 100%;
    .allTitle,
    .newTitle {
        font-weight: 700;
        padding: 10px 0;
    }
    .hot,
    .new {
        margin-bottom: 20px;
        li {
            display: flex;
            padding: 20px 0;
            border-bottom: 1px solid rgba($color: #ccc, $alpha: 0.2);
            .avatar {
                margin-right: 20px;
                img {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                }
            }
            .content {
                width: 100%;
                .comment {
                    margin-bottom: 10px;
                    line-height: 20px;
                    font-size: 16px;
                }
                .time {
                    color: #c2c2c2;
                }
                .operation {
                    display: flex;
                    justify-content: space-between;
                    font-size: 14px;
                }
                .like {
                    .iconfont {
                        margin-right: 5px;
                    }
                }
            }
        }
    }
}
</style>
