import { personalFm } from '@/api/music'
import { ref, watch } from 'vue'
import playSong from '@/hooks/playSong'
import store from '@/store'

// 播放歌曲列表
const songlist: any = ref([])
// 将要填充的歌曲列表
const reserveList: any = ref([])
// 当前播放的索引
const currentIndex = ref(0)

export default function () {
    // 获取第一次的歌曲列表
    const getPersonalFm1 = async () => {
        if (store.state.songListFrom !== '私人FM') {
            const { data } = await personalFm()
            if (data.code === 200) {
                songlist.value = data.data
                store.commit('setSongList', songlist.value)
                getSongDataFn(songlist.value[0])
            }
        }
    }

    // 获取歌曲数据
    const { getSongData } = playSong()
    const getSongDataFn = (item: any) => {
        getSongData(item, '私人FM', [])
    }

    // 播放下一首
    const next = async () => {
        if (reserveList.value.length <= 0) {
            const { data } = await personalFm()
            if (data.code === 200) {
                reserveList.value = data.data
                songlist.value.push(reserveList.value.splice(0, 1)[0])
                store.commit('setSongList', songlist.value)
                currentIndex.value += 1
            }
        } else {
            songlist.value.push(reserveList.value.splice(0, 1)[0])
            store.commit('setSongList', songlist.value)
            currentIndex.value += 1
        }
    }

    // 切换下一首
    watch(currentIndex, (newValue, oldValue) => {
        if (songlist.value.length > 0) {
            getSongDataFn(songlist.value[newValue])
        }
    })

    // 切换上一首
    const changeSong = (index: number) => {
        if (index === currentIndex.value - 1) {
            currentIndex.value = index
        }
    }

    // 收藏菜单
    const mousedownFn = (e: any) => {
        store.commit('setRightClickMenu', {
            mouseX: e.clientX,
            mouseY: e.clientY,
            activeId: songlist.value[currentIndex.value].id,
            show: true,
            type: 'add',
        })
        return false
    }

    return {
        currentIndex,
        next,
        songlist,
        getPersonalFm1,
        changeSong,
        mousedownFn,
    }
}
