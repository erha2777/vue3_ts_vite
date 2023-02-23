import { isDescendant } from '@/utils/utils'
import { computed, ref, watch, nextTick, getCurrentInstance } from 'vue'
import store from '@/store'
import computedFn from '@/hooks/store'
import themeFn from '@/hooks/theme'
import { signIn } from '@/api/music'
import dayjs from 'dayjs'
import { useRouter } from 'vue-router'

const { userInfo, songData, volume } = computedFn()

export default function () {
    const { proxy } = getCurrentInstance() as any
    const router = useRouter() // 路由
    const currentRouter: any = computed(() => router.currentRoute.value) // 当前路由数据

    const { themeFlag } = themeFn() // 主题下拉框显示隐藏
    const userInfoFlag = ref(false) // 用户信息下拉框显示隐藏
    const songListFlag = ref(false) // 右侧歌曲列表显示隐藏
    const loginFlag = ref(false) // 用户登录框显示隐藏
    const showContentFlag = ref(false) // 音乐内容层显示隐藏
    const showMusicCanvas = ref(false) // 音乐频谱层显示隐藏
    const isFullScreen = ref(false) // 是否全屏

    // 页面跳转相关
    const history = computed(() => window.history) // 历史记录
    /**
     * 页面跳转
     * @param path
     */
    const routerPush = (path: any) => {
        router.push(path)
    }
    /**
     * 页面回退
     */
    const routerBack = () => {
        if (window.history.state.back) {
            window.history.back()
        }
    }
    /**
     * 返回下一个页面
     */
    const routerNext = () => {
        if (window.history.state.forward) {
            router.push(window.history.state.forward)
        }
    }

    // 搜索相关
    const searchFlag = ref(false)
    const searchValue = ref('')
    const chengeValue = (value: string) => {
        searchValue.value = value
        searchFlag.value = false
    }
    const enterSearch = () => {
        proxy.$refs.child.chengeValue(searchValue.value)
    }

    // 用户下拉框
    // 签到相关
    const qdFlag = ref(false)
    const clickSignIn = async () => {
        if (qdFlag.value) return
        const { data } = await signIn()
        if (data.code === 200) {
            console.log('签到成功');
            window.localStorage.setItem('qdDate', dayjs(new Date()).format('YYYY-MM-DD'))
            qdFlag.value = true
        }else{
            console.log('签到失败');
        }
    }
    const qdDate = computed(() => window.localStorage.getItem('qdDate'))
    watch(
        qdDate,
        (newValue, oldValue) => {
            qdFlag.value = newValue === dayjs(new Date()).format('YYYY-MM-DD')
        },
        { immediate: true }
    )
    // 退出登录
    const logoutFn = async () => {
        store.dispatch('logout')
    }

    // 左侧菜单-我的歌单相关
    const myCreateFlag = ref(false)
    const myCreate: any = computed(() => store.state.songSheet.filter((v: { creator: { userId: any } }) => v.creator.userId === userInfo.value.userId))

    // 左侧菜单-收藏的歌单相关
    const collectionFlag = ref(false)
    const collection: any = computed(() => store.state.songSheet.filter((v: { creator: { userId: any } }) => v.creator.userId !== userInfo.value.userId))

    // footer底部相关
    /**
     * 控制播放音量
     * @param e 当前元素
     */
    const playVolume = (e: any) => {
        const x = 82 - e.offsetY
        const w = e.currentTarget.offsetHeight
        const v = x / w
        store.commit('setSongVolume', v)
    }

    // 歌曲名字滚动相关
    let timer1: any = null
    let timerFlag1 = ref(false)
    let gdFlag1 = ref(false)
    const songDataName = computed(() => songData.value.name)
    /**
     * 歌曲名字滚动
     * @returns 节流阀
     */
    const mouseenter1 = () => {
        if (timerFlag1.value === true || gdFlag1.value === false) return
        proxy.$refs.text1.style.animationDuration = songData.value.name.length / 2 + 's'
        timerFlag1.value = true
        timer1 = setTimeout(() => {
            timerFlag1.value = false
            clearTimeout(timer1)
        }, (songData.value.name.length / 2) * 1000)
    }
    // 歌曲歌手名字滚动相关
    let timer2: any = null
    let timerFlag2 = ref(false)
    let gdFlag2 = ref(false)
    /**
     * 歌曲歌手名字滚动
     * @returns 节流阀
     */
    const mouseenter2 = () => {
        if (timerFlag2.value === true || gdFlag2.value === false) return
        proxy.$refs.text2.style.animationDuration = songData.value.singer.length / 2 + 's'
        timerFlag2.value = true
        timer2 = setTimeout(() => {
            timerFlag2.value = false
            clearTimeout(timer2)
        }, (songData.value.singer.length / 2) * 1000)
    }

    // 控制歌曲名字滚动节流阀
    watch(
        songDataName,
        (newValue, oldValue) => {
            gdFlag1.value = false
            gdFlag2.value = false
            nextTick(() => {
                if (proxy.$refs.text1.offsetWidth > 120) {
                    gdFlag1.value = true
                } else {
                    gdFlag1.value = false
                }
                if (proxy.$refs.text2.offsetWidth > 140) {
                    gdFlag2.value = true
                } else {
                    gdFlag2.value = false
                }
            })
        },
        { immediate: true }
    )

    // 禁用右键菜单
    document.oncontextmenu = function (e) {
        return false
    }

    // 关闭遮罩下拉层的事件
    window.addEventListener('click', (e: any) => {
        if (!isDescendant(e.target, 'class', 'userInfo')) {
            userInfoFlag.value = false
        }
        if (!isDescendant(e.target, 'id', 'songList-right') && e.target.className.indexOf('icon-24gf-playlistMusic5') === -1) {
            songListFlag.value = false
        }
        if (!isDescendant(e.target, 'class', 'theme-drop-down') && e.target.className.indexOf('icon-pifuzhuti-xianxing') === -1) {
            themeFlag.value = false
        }
        if (!isDescendant(e.target, 'id', 'searchSuggest') && e.target.id.indexOf('searchInput') === -1) {
            searchFlag.value = false
        }
        if (!isDescendant(e.target, 'id', 'rightClickMenu') && !isDescendant(e.target, 'class', 'rightClick')) {
            store.commit('setRightClickMenu', {
                show: false,
            })
        }
        return
    })
    return {
        currentRouter, // 路由相关
        history,
        routerPush,
        routerBack,
        routerNext,
        userInfo, // 用户数据
        songData, // 歌曲数据
        volume, // 音量
        songListFlag, // 控制显示隐藏相关
        userInfoFlag,
        loginFlag,
        showContentFlag,
        showMusicCanvas,
        searchFlag, // 搜索相关
        searchValue,
        chengeValue,
        clickSignIn, // 签到相关
        qdFlag,
        myCreateFlag, // 左侧菜单相关
        myCreate,
        collectionFlag,
        collection,
        playVolume, // footer底部相关
        mouseenter1,
        gdFlag1,
        timerFlag1,
        mouseenter2,
        gdFlag2,
        timerFlag2,
        enterSearch,
        logoutFn,
        isFullScreen
    }
}
