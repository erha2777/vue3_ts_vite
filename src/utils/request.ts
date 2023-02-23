import axios from 'axios'

const request = axios.create({
    // baseURL: '/api', // 请求地址
    baseURL: 'https://markdown.erha2777.icu/', // 请求地址
    // baseURL: 'http://localhost:3000', // 请求地址
    // timeout: 1000 // 超时时间,
    withCredentials: true,
})

// 添加请求拦截器
request.interceptors.request.use(
    function (config) {
        let url: any = config.url
        // axios 缓存请求解决 （get请求）
        if (config.method === 'get' 
        && url.indexOf('login') === -1 
        && url.indexOf('song/url') === -1
        ) {
            url.indexOf('?') === -1 ? (config.url = url + '?_=' + new Date().getTime()) : (config.url = url + '&_=' + new Date().getTime())
        }
        // 在发送请求之前做些什么
        return config
    },
    function (error) {
        // 对请求错误做些什么
        return Promise.reject(error)
    }
)

// 添加响应拦截器
request.interceptors.response.use(
    function (response) {
        // 2xx 范围内的状态码都会触发该函数。
        // 对响应数据做点什么
        return response
    },
    function (error) {
        // 超出 2xx 范围的状态码都会触发该函数。
        // 对响应错误做点什么
        return Promise.reject(error)
    }
)

export default request
