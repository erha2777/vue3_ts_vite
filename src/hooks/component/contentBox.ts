import { ref, computed, watch, nextTick } from 'vue'
import { getImgRGB } from '@/utils/utils'
import store from '@/store'

export default function (proxy: any, emit: any) {

    // 专辑图片
    const picUrl = computed(() => store.state.songData.picUrl)

    // 背景色变化
    let rgbStr = ref('rgb(000,000,000)')
    watch(
        picUrl,
        (newValue, oldValue) => {
            nextTick(async () => {
                let name = proxy.$refs.rotate360.className
                if (name === 'rotate360') {
                    proxy.$refs.rotate360.className = 'rotate360-2'
                } else {
                    proxy.$refs.rotate360.className = 'rotate360'
                }

                const { rgb, hsl, hex } = await getImgRGB(newValue)
                rgbStr.value = hex
            })
        },
        { immediate: true }
    )

    /**
     * 关闭窗口
     */
    const close = () => {
        emit('close')
    }

    return {
        rgbStr,
        close
    }
}
