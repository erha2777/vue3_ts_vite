import { ref, watch, reactive, computed } from 'vue'
import { searchSong } from '@/api/music'
import { useRouter } from 'vue-router'
import store from '@/store'
import playSongFn from '@/hooks/playSong'

export default function () {
    const router = useRouter()
    const keyword = computed(() => router.currentRoute.value.params.keyword)

    const currentType = ref(1) // 搜索的类型
    const resultList: any = reactive([]) // 搜索的结果列表
    const searchType = ref([
        // 搜索相关的类型参数
        {
            name: '单曲',
            type: 1,
        },
        {
            name: '歌手',
            type: 100,
        },
        {
            name: '专辑',
            type: 10,
        },
        {
            name: '视频',
            type: 1014,
        },
        {
            name: '歌单',
            type: 1000,
        },
        {
            name: '歌词',
            type: 1006,
        },
        {
            name: '播客',
            type: 1018,
        },
        {
            name: '声音',
            type: 2000,
        },
        {
            name: '用户',
            type: 1002,
        },
    ])
    const listForm = reactive({
        // 分页相关参数
        pageSize: 100,
        pageNum: 0,
        total: 0,
    })

    /**
     * 分页搜索
     * @param keyword 关键词
     */
    const searchSongList = async (keyword: any) => {
        const { data } = await searchSong({
            keywords: keyword,
            type: 1,
            limit: listForm.pageSize,
            offset: listForm.pageNum * listForm.pageSize,
        })
        if (data.code === 200) {
            listForm.total = data.result.songCount
            resultList.splice(0, resultList.length)
            resultList.push(...data.result.songs)
            // hasMore.value = data.result.hasMore
            console.log('获取搜索结果成功');
        }else{
            console.log('获取搜索结果失败');
        }
    }

    /**
     * 分页切换
     * @param num 页数
     */
    const pageChange = (num: number) => {
        listForm.pageNum = num
        searchSongList(keyword.value)
    }

    /**
     * 过滤关键词样式
     * @param text 需要过滤的文字内容
     * @returns 过滤之后的html内容
     */
    const filterValue = (text: string) => {
        let reg = new RegExp(`${keyword.value}`, 'i')
        return text.replace(reg, `<span class="keywords">${text.match(reg)}</span>`)
    }

    const { getSongData } = playSongFn()
    /**
     * 播放歌曲
     * @param item 歌曲数据
     */
    const getSongDataFn = (item: any) => {
        getSongData(item, '搜索页', resultList)
    }

    /**
     * 播放全部
     */
    const setSongList = () => {
        store.commit('setSongListFrom', '搜索页')
        store.commit('setSongList', resultList)
        getSongDataFn(resultList[0])
    }

    // 关键词变化后重新搜索
    watch(
        keyword,
        (newValue, oldValue) => {
            searchSongList(newValue)
        },
        { immediate: true }
    )

    return {
        currentType,
        searchType,
        resultList,
        listForm,
        searchSongList,
        pageChange,
        keyword,
        filterValue,
        getSongDataFn,
        setSongList,
    }
}
