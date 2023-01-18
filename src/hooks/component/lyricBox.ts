import { ref, computed, watch, nextTick } from 'vue'
import store from '@/store'
export default function (props: any, proxy: any) {
    const playTimeTo3 = computed(() => store.state.playTimeTo3) // 当前播放时间保留三位小数
    const lyricsDouble = computed(() => store.state.songData.lyricsForm.double) // 是否有歌词翻译
    const lrc: any = computed(() => store.state.songData.lyricsForm.lrc) // 歌词
    const tlyric: any = computed(() => store.state.songData.lyricsForm.tlyric) // 歌词翻译
    const lyricsForm = computed(() => {
        // 歌曲数据
        if (lyricsDouble) {
            lrc.value.forEach((item: any) => {
                const data = tlyric.value.find((v: any) => v.id === item.id)
                if (data) {
                    item.text2 = data.text
                }
            })
        }
        return {
            lyrics: lrc.value,
        }
    })

    const topNumber = ref(0) // 歌曲向上偏移高度
    const currentIndex = ref(0) // 当前行数

    // 歌词滚动
    let nextTimer: any = null
    let nextFlag = ref(true)
    let skipFlag = ref(true)
    watch(playTimeTo3, (newValue, oldValue) => {
        // 是否有下一行
        if (currentIndex.value + 1 >= lyricsForm.value.lyrics.length) return
        // 比较下一行歌词是否有时间
        let nextTime = lyricsForm.value.lyrics[currentIndex.value + 1].id
        if (nextTime) {
            skipFlag.value = false
            // 有时间
            nextTime = nextTime.replace('[', '').replace(']', '')
            if (nextTime < newValue.slice(0, nextTime.length)) {
                currentIndex.value = currentIndex.value + 1
                if (!lyricsDouble.value) {
                    topNumber.value = currentIndex.value * props.lineHeight
                } else {
                    topNumber.value = currentIndex.value * props.lineHeight * 2
                }
                nextTick(() => {
                    proxy.$refs.lyricBox.scrollTop = 0
                })
            }
        } else {
            // 无时间
            let nextText = lyricsForm.value.lyrics[currentIndex.value + 1].text
            let nextTextLength = lyricsForm.value.lyrics[currentIndex.value].text ? lyricsForm.value.lyrics[currentIndex.value].text.length : 0
            if (nextFlag.value) {
                nextFlag.value = false
                nextTimer = setTimeout(
                    () => {
                        currentIndex.value = currentIndex.value + 1
                        if (nextText) {
                            if (!lyricsDouble.value) {
                                topNumber.value = currentIndex.value * props.lineHeight
                            } else {
                                topNumber.value = currentIndex.value * props.lineHeight * 2
                            }
                        }
                        nextFlag.value = true
                        clearTimeout(nextTimer)
                    },
                    skipFlag.value && nextText ? 500 : nextTextLength * 100
                )
            }
        }
    })

    watch(
        lyricsForm,
        () => {
            // 切歌重置歌词位置
            skipFlag.value = true
            currentIndex.value = 0
            topNumber.value = 0
        },
        { deep: true }
    )
    return {
        playTimeTo3,
        lyricsDouble,
        lrc,
        tlyric,
        lyricsForm,
        topNumber,
        currentIndex,
    }
}
