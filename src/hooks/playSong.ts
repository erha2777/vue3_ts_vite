import store from '@/store'

import computedFn from '@/hooks/store'

const { songListFrom, songList } = computedFn()

// 获取歌曲数据
/**
 *
 * @param item 歌曲参数
 * @param playFormName 歌单名称
 * @param songs 歌单歌曲
 */
const getSongData = (item: any, playFormName: string, songs: []) => {
    if (songList.value.length < 1) {
        store.commit('setSongListFrom', playFormName)
        if (songs.length > 0) {
            store.commit('setSongList', songs)
        }
    } else if (songListFrom.value !== playFormName) {
        store.commit('setSongListFrom', playFormName)
        if (songs.length > 0) {
            store.commit('setSongList', songs)
        }
    }
    window.localStorage.setItem('songItem', JSON.stringify(item))
    store.dispatch('getSongMsg', item)
}
export default function () {
    return {
        getSongData,
    }
}
