import { reactive } from 'vue'
import { getDailyRecommendation } from '@/api/music'
import playSongFn from '@/hooks/playSong'
import store from '@/store'

export default function () {
    let dailySongs: any = reactive([]) // 每日歌曲列表

    // 获取每日歌曲列表
    const getData = async function () {
        const { data } = await getDailyRecommendation()
        dailySongs.splice(0, dailySongs.length)
        dailySongs.push(...data.data.dailySongs)
    }

    const { getSongData } = playSongFn()
    /**
     * 播放歌曲
     * @param item 歌曲信息
     */
    const getSongDataFn = (item: any) => {
        getSongData(item, '每日歌曲推荐', dailySongs)
    }

    /**
     * 播放全部
     */
    const setSongList = () => {
        store.commit('setSongListFrom', '每日歌曲推荐')
        store.commit('setSongList', dailySongs)
        getSongDataFn(dailySongs[0])
    }

    /**
     * 右键操作
     * @param e 事件对象
     * @param item 歌曲数据
     * @returns 阻止默认行为
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
                type: 'add',
            })
        }
        return false
    }
    return {
        dailySongs,
        getData,
        getSongDataFn,
        setSongList,
        mousedownFn,
    }
}
