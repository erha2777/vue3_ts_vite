import { ref, watch, reactive } from 'vue'
import { getQrKey, getQrCreate, getQrCheck, getLogin, getCaptcha,verifyCaptcha } from '@/api/login'
import store from '@/store'

export default function (emit:any) {
    const cookie = ref('')
    const loginType = ref('qrCode') // 切换登录方式

    // 二维码登录相关
    const qrKey = ref('') // 用来生成二维码的key
    const qrImg = ref('') // 生成的 base64 二维码
    const status = ref(801) // 二维码登录状态 800|801|802|803

    /**
     * 获取二维码
     */
    const getData = async function () {
        const { data } = await getQrKey()
        if (data.code === 200) {
            qrKey.value = data.data.unikey
            const { data: data2 } = await getQrCreate(data.data.unikey)
            qrImg.value = data2.data.qrimg
            getLonginStatus()
        }
    }

    let timer: any = null // 轮询登录状态的节流定时器
    /**
     * 轮询二维码登录状态
     * @returns
     */
    const getLonginStatus = async () => {
        if (loginType.value !== 'qrCode') return
        const { data } = await getQrCheck(qrKey.value)
        status.value = data.code
        if (data.code === 801 || data.code === 802) {
            // 等待扫码 和 待确认
            timer = setTimeout(() => {
                clearTimeout(timer)
                getLonginStatus()
            }, 1000)
        }
        if (data.code === 803) {
            // 授权登录成功
            localStorage.setItem('cookie', data.cookie)
            cookie.value = data.cookie
            store.dispatch('getLoginStatus')
            close()
        }
        if (data.code === 800) {
            // 二维码过期
            getData()
        }
    }

    watch(loginType, (newValue, oldValue) => {
        if (newValue === 'qrCode') {
            getLonginStatus()
        }
    })

    // 手机登录相关
    const loginForm = reactive({
        phone: '',
        captcha: '',
        password: '',
    })
    const verifyPhone = ref(false) // 手机验证是否通过 false为通过
    const verifyText = ref('') // 验证的消息
    const captchaFlag = ref(true) // 是否可以发送验证码
    let captchaTimer:any = null // 计时器
    let countDown = ref(60) // 倒计时

    /**
     * 获取手机验证码
     */
    const getCaptchaFn = () => {
        if (!loginForm.phone||!captchaFlag.value) return
        let reg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/
        if (!reg.test(loginForm.phone)) {
            verifyText.value = '请输入11位数字的手机号'
            verifyPhone.value = true
        } else {
            verifyPhone.value = false
            verifyText.value = ''
            getCaptcha(loginForm.phone) // 发送验证码
            countDown.value = 60
            captchaFlag.value = false
            captchaTimer = setInterval(() => {
                if (countDown.value === 0) {
                    captchaFlag.value = true
                    clearInterval(captchaTimer)
                }
                countDown.value -= 1
            }, 1000)
        }
    }

    /**
     * 手机登录
     */
    const login = async function () {
        let reg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/
        if(!reg.test(loginForm.phone)){
            verifyText.value = '请输入11位数字的手机号'
            verifyPhone.value = true
            return
        }
        if(loginType.value==='password'&&!(loginForm.password)){
            verifyText.value = '请输入密码'
            verifyPhone.value = true
            return
        }
        if(loginType.value==='captcha'&&!(loginForm.captcha)){
            verifyText.value = '请输入验证码'
            verifyPhone.value = true
            return
        }
        verifyPhone.value = false
        verifyText.value = ''

        let params:any = {phone: loginForm.phone}
        if(loginType.value==='password'){
            params.password = loginForm.password
            const {data} = await getLogin(params)
            if(data.code === 200){
                localStorage.setItem('cookie', data.cookie)
                cookie.value = data.cookie
                store.dispatch('getLoginStatus')
                close()
            }
        }
        if(loginType.value==='captcha'){
            params.captcha = loginForm.captcha
            const {data} = await verifyCaptcha(params)
            if(data.code===200&&data.data){
                const {data:data1} = await getLogin(params)
                localStorage.setItem('cookie', data1.cookie)
                cookie.value = data1.cookie
                store.dispatch('getLoginStatus')
                close()
            }else{
                verifyText.value = '验证码错误'
                verifyPhone.value = true
            }
        }
    }

    /**
     * 关闭登录框
     */
    const close = () => {
        emit('close')
    }

    return {
        qrKey,
        qrImg,
        status,
        cookie,
        loginForm,
        login,
        loginType,
        getData,
        getCaptchaFn,
        verifyPhone,
        verifyText,
        captchaFlag,
        countDown,
        close
    }
}
