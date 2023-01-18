import store from '@/store'
import computedFn from '@/hooks/store'

const { activeId } = computedFn()

/**
 * 单击歌曲高亮
 * @param id
 * @returns 阻止默认行为
 */
const setActive = (id: any) => {
    store.commit('setActiveId', id)
    return false
}
export default function () {
    return {
        setActive,
        activeId,
    }
}
