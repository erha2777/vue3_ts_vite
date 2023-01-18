import { computed, watch, ref, nextTick, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { updateSongsheet } from '@/api/music'
import computedFn from '@/hooks/store'
import store from '@/store'

const { userInfo, show, type, rightClickMenu } = computedFn()

export default function (proxy: any) {
    const router = useRouter()

    // 我创建的歌单
    const myCreate: any = computed(() => store.state.songSheet.filter((v: { creator: { userId: any } }) => v.creator.userId === userInfo.value.userId))
    const boxForm = reactive({
        // 右键菜单的参数
        top: 0,
        bottom: 0,
        height: 0,
        left: 0,
        right: 0,
    })
    const boxTop = ref(0) // box向上偏移值

    // 计算右键菜单位置变化
    watch(
        rightClickMenu,
        (newValue, oldValue) => {
            boxForm.right = 0
            nextTick(() => {
                let selectDom = proxy.$refs.songSheet
                boxTop.value = -(selectDom.offsetHeight / 2)
                nextTick(() => {
                    selectDom = proxy.$refs.songSheet
                    let realTop = selectDom?.getBoundingClientRect().top
                    boxForm.top = realTop
                    boxForm.height = selectDom.offsetHeight
                    boxForm.bottom = document.body.offsetHeight + 80 - realTop - selectDom.offsetHeight
                    let realLeft = selectDom?.getBoundingClientRect().left
                    boxForm.left = realLeft
                    boxForm.right = document.body.offsetWidth - realLeft - 200
                })
            })
        },
        { deep: true, immediate: true }
    )
    watch(
        boxForm,
        (newValue, oldValue) => {
            if (newValue.top < 0) {
                boxTop.value = newValue.bottom
            } else if (newValue.bottom < 0) {
                boxTop.value = newValue.bottom - boxForm.height / 2
            } else {
                boxTop.value = -(boxForm.height / 2)
            }
        },
        { deep: true, immediate: true }
    )

    /**
     * 收藏到歌单
     * @param palyListId 歌单id
     */
    const collection = async (palyListId: string | number) => {
        const { data } = await updateSongsheet('add', palyListId, rightClickMenu.value.activeId)
        if (data.status === 200) {
            console.log('收藏成功')
            store.commit('setRightClickMenu', {
                show: false,
            })
        }else{
            console.log('收藏失败');
        }
    }

    // 歌单id
    const palyListId: any = computed(() => router.currentRoute.value.params.id)
    /**
     * 从歌单删除
     */
    const delCollection = async () => {
        const { data } = await updateSongsheet('del', palyListId.value, rightClickMenu.value.activeId)
        if (data.status === 200) {
            console.log('移除收藏成功')
            store.commit('setRightClickMenu', {
                show: false,
                status: 'update',
            })
        }else{
            console.log('移除收藏失败');
        }
    }
    return {
        myCreate,
        boxForm,
        boxTop,
        collection,
        delCollection,
        show,
        type,
        rightClickMenu,
    }
}
