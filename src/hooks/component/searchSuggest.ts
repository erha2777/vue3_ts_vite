import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getSearchSuggestMsg, getSearchHot } from '@/api/music'

export default function (props: any,emit:any) {
    const router = useRouter()

    const msgType: any = [
        // 搜索提示的分类参数
        {
            name: 'songs',
            title: '单曲',
            icon: 'icon-yinle1',
            type: 1,
        },
        {
            name: 'artists',
            title: '歌手',
            icon: 'icon-shouye',
            type: 100,
        },
        {
            name: 'albums',
            title: '专辑',
            icon: 'icon-zhuanji',
            type: 10,
        },
        {
            name: 'playlists',
            title: '歌单',
            icon: 'icon-liebiao',
            type: 1000,
        },
    ]
    const msgList: any = ref([]) // 建议列表
    const mobileSuggest: any = ref([]) // 关键词建议
    const searchHot: any = ref([]) // 热门搜索
    const searchHistory = ref(JSON.parse(window.localStorage.getItem('historyKeywords') || '[]')) // 历史记录

    /**
     * 通过关键词获取搜索建议
     */
    const getSuggestMsg = async () => {
        const dataArr = await getSearchSuggestMsg(props.keywords)
        const { data: data1 } = dataArr[0]
        const { data: data2 } = dataArr[1]
        if (data1.code === 200 && data1.result.allMatch) {
            mobileSuggest.value = data1.result.allMatch
        }
        if (data2.code === 200 && data2.result.order) {
            msgList.value = data2.result.order.map((v: string) => {
                let item = msgType.find((v1: any) => v1.name === v)
                item.list = data2.result[v]
                return item
            })
        }
        clearTimeout(timer)
    }

    /**
     * 获取热门搜索
     */
    const getSearchHotMsg = async () => {
        const { data } = await getSearchHot()
        if (data.code === 200) {
            searchHot.value = data.data
            console.log('获取热门搜索成功');
        }else{
            console.log('获取热门搜索失败');
        }
        clearTimeout(timer)
    }

    // 根据输入内容变化进行搜索
    const keywordValue = computed(() => props.keywords)
    let timer: any = null // 防抖
    watch(
        keywordValue,
        (newValue, oldValue) => {
            clearTimeout(timer)
            timer = setTimeout(() => {
                if (newValue !== '') {
                    getSuggestMsg()
                } else {
                    getSearchHotMsg()
                }
            }, 500)
        },
        { immediate: true }
    )

    /**
     * 过滤关键词
     * @param text 需要过滤的文本 
     * @returns 过滤后的html
     */
    const filterValue = (text: string) => {
        let reg = new RegExp(`${props.keywords}`, 'i')
        return text.replace(reg, `<span class="keywords">${text.match(reg)}</span>`)
    }

    /**
     * 选择搜索建议选项进行搜索
     * @param value 
     */
    const chengeValue = (value: string) => {
        let newArr = [...searchHistory.value]
        newArr.push(value)
        newArr = [...new Set(newArr)]
        window.localStorage.setItem('historyKeywords', JSON.stringify(newArr))
        emit('chengeValue', value)
        router.push({ name: 'searchResult', params: { keyword: value } })
    }

    return {
        msgType,
        msgList,
        mobileSuggest,
        searchHot,
        searchHistory,
        getSuggestMsg,
        getSearchHotMsg,
        filterValue,
        chengeValue
    }
}
