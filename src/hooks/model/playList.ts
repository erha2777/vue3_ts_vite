import { computed, watch, reactive } from 'vue'
import { getPlaylistMsg, getSongList } from '@/api/music'
import dayjs from 'dayjs'
import store from '@/store'
import playSongFn from '@/hooks/playSong'
import { useRouter } from 'vue-router'

export default function () {
    //路由
    const router = useRouter()

    // 歌单信息
    const isPlayListForm = reactive({
        coverImgUrl: 'https://z3.ax1x.com/2021/03/21/64HfxK.jpg',
        name: '',
        createTime: '',
        creator: {
            avatarUrl: '',
            nickname: '',
        },
    })

    /**
     * 获取歌单数据
     * @param id 歌单id
     */
    const getPlaylist = async (id: any) => {
        const { data } = await getPlaylistMsg(id)
        if (data.code === 200) {
            window.localStorage.setItem('songListId', id)
            const { coverImgUrl, name, createTime, creator } = data.playlist
            isPlayListForm.coverImgUrl = coverImgUrl
            isPlayListForm.name = name
            isPlayListForm.createTime = dayjs(createTime).format('YYYY-MM-DD')
            isPlayListForm.creator = creator
            console.log('获取' + name + '歌单信息成功')
            const trackIds = data.playlist.trackIds.map((v: { id: any }) => v.id).toString()
            getPlaylistSong(trackIds)
            if (status.value === 'update') {
                store.commit('setRightClickMenu', {
                    show: false,
                    status: 'complete',
                })
            }
        } else {
            console.log('获取歌单信息失败')
        }
    }

    const songs: any = reactive([]) // 歌单歌曲列表

    /**
     * 获取歌单歌曲
     * @param ids 歌单里的歌曲id
     */
    const getPlaylistSong = async (ids: string) => {
        const { data } = await getSongList(ids)
        if (data.code === 200) {
            console.log('获取歌单歌曲成功')
            songs.splice(0, songs.length)
            songs.push(...data.songs)
        } else {
            console.log('获取歌单歌曲失败')
        }
    }

    const { getSongData } = playSongFn()
    /**
     * 播放歌曲
     * @param item 歌曲数据
     */
    const getSongDataFn = (item: any) => {
        getSongData(item, isPlayListForm.name, songs)
    }

    /**
     * 播放全部
     */
    const setSongList = () => {
        store.commit('setSongListFrom', isPlayListForm.name)
        store.commit('setSongList', songs)
        getSongDataFn(songs[0])
    }

    /**
     * 右键操作
     * @param e
     * @param item
     * @returns
     */
    const mousedownFn = (e: any, item: any) => {
        // if(e.button ==2){
        //     console.log("你点了右键");
        // }else if(e.button ==0){
        //     console.log("你点了左键");
        // }else if(e.button ==1){
        //     console.log("你点了滚轮");
        // }
        if (e.button == 2) {
            store.commit('setRightClickMenu', {
                mouseX: e.clientX,
                mouseY: e.clientY,
                activeId: item.id,
                show: true,
                type: 'del',
            })
        }
        return false
    }

    const palyListId = computed(() => router.currentRoute.value.params.id) // 歌单id
    const status = computed(() => store.state.rightClickMenu.status) // 用来判断是否进行了更新歌单操作

    // 右键删除后更新列表
    watch(status, (newValue, oldValue) => {
        if (newValue === 'update') {
            getPlaylist(palyListId.value)
        }
    })

    // 歌单切换
    watch(
        palyListId,
        (newValue, oldValue) => {
            getPlaylist(newValue)
        },
        { immediate: true }
    )

    return {
        isPlayListForm,
        songs,
        getPlaylist,
        getPlaylistSong,
        getSongDataFn,
        setSongList,
        mousedownFn,
    }
}
