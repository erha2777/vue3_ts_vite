import { createApp } from 'vue'
import './assets/fonts/iconfont.css'
import './styles/normalize.css'
import './styles/animate.min.css'
import './styles/common.scss'
import './styles/global.scss'
import App from './App.vue'
import router from './router'
import store from './store'

const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')
