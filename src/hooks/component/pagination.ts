import { computed, reactive, watch } from 'vue'

export default function (props:any,emit:any) {
    const pageForm = reactive({
        // 分页组件的属性
        size: 0,
        num: 0,
        total: 0,
    })
    const pageCount = computed(() => Math.ceil(pageForm.total / pageForm.size)) // 总页数

    /**
     * 上一页
     */
    const previous = () => {
        if (pageForm.num - 1 >= 0) {
            pageForm.num -= 1
        }
    }
    /**
     * 页数切换
     * @param num 页数
     */
    const changeNum = (num: number) => {
        pageForm.num = num
    }
    /**
     * 下一页
     */
    const next = () => {
        if (pageForm.num + 1 < pageCount.value) {
            pageForm.num += 1
        }
    }

    // 当前第几页
    const pageFormNum = computed(() => pageForm.num)
    watch(
        pageFormNum,
        (newValue, oldValue) => {
            pageChange(newValue)
        },
        { deep: true }
    )
    // 页数切换触发事件通知父组件
    const pageChange = (page: number) => {
        emit('pageChange', page)
    }

    // 第一次赋值分页参数
    watch(
        props,
        (newValue, oldValue) => {
            pageForm.size = newValue.pageSize
            pageForm.num = newValue.pageNum
            pageForm.total = newValue.total
        },
        { deep: true, immediate: true }
    )
    return {
        pageForm,
        pageCount,
        previous,
        changeNum,
        next,
    }
}
