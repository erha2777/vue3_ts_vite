// 主题切换相关
import { ref, watch } from 'vue'

// 主题菜单
const themeFlag = ref(false)
const theme = ref(window.localStorage.getItem('theme') || 'default')
const themeType = ref(window.localStorage.getItem('themeType') || 'theme')
const themeColor = ref(window.localStorage.getItem('themeColor') || '#ec4141')
const themeList = ref([
    {
        name: 'default',
        text: '官方红',
        color: '#ec4141',
    },
    {
        name: 'dark',
        text: '暗黑',
        color: '#222225',
    },
])

// 切换主题
const changeTheme = (name: string) => {
    theme.value = name
    window.localStorage.setItem('theme', name)
}

// 切换主题类型
const changeThemeType = (type: string) => {
    themeType.value = type
    window.localStorage.setItem('themeType', type)
}

// 主题颜色切换
const themeColorChange = () => {
    theme.value = 'color'
    document.documentElement.style.setProperty('--theme-color', themeColor.value)
    window.localStorage.setItem('theme', 'color')
    window.localStorage.setItem('themeColor', themeColor.value)
}

// 设置主题
watch(
    theme,
    (newValue, oldValue) => {
        if (newValue === 'default') {
            document.body.className = 'theme-default'
        } else if (newValue === 'dark') {
            document.body.className = 'theme-dark'
        } else if (newValue === 'color') {
            document.body.className = 'theme-color'
            document.documentElement.style.setProperty('--theme-color', themeColor.value)
        }
    },
    { immediate: true }
)
export default function () {
    return {
        themeFlag,
        theme,
        themeType,
        changeThemeType,
        themeList,
        themeColorChange,
        themeColor,
        changeTheme,
    }
}
