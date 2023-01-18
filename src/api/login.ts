import request from '@/utils/request'

/**
 * 二维码 key 生成接口
 * 调用此接口可生成一个 key
 * @returns
 */
export function getQrKey() {
    return request({
        method: 'get',
        url: '/login/qr/key',
    })
}

/**
 * 二维码生成接口
 * 调用此接口传入上一个接口生成的 key 可生成二维码图片的 base64 和二维码信息,可使用 base64 展示图片,或者使用二维码信息内容自行使用第三方二维码生成库渲染二维码
 * @param key
 * @returns
 */
export function getQrCreate(key: string) {
    return request({
        method: 'get',
        url: '/login/qr/create?qrimg=qrimg&key=' + key,
    })
}

/**
 * 二维码检测扫码状态接口
 * 轮询此接口可获取二维码扫码状态,800 为二维码过期,801 为等待扫码,802 为待确认,803 为授权登录成功(803 状态码下会返回 cookies)
 * @param key
 * @returns
 */
export function getQrCheck(key: string) {
    return request({
        method: 'get',
        url: '/login/qr/check?key=' + key,
    })
}

/**
 * 游客登陆
 * 直接调用此接口, 可获取游客cookie,如果遇到其他接口未登录状态报400状态码需要验证的错误,可使用此接口获取游客cookie避免报错
 */
export function ykLogin() {
    return request({
        url: '/register/anonimous',
        method: 'GET',
    })
}

/**
 * 发送验证码
 * 调用此接口 ,传入手机号码, 可发送验证码
 * @param phone 手机号
 * @returns
 */
export function getCaptcha(phone: string | number) {
    return request({
        url: `/captcha/sent?phone=${phone}`,
        method: 'GET',
    })
}

/**
 * 验证验证码
 * 调用此接口 ,传入手机号码和验证码, 可校验验证码是否正确
 * @param params 手机号和验证码
 * @returns
 */
export function verifyCaptcha(params: { phone: string | number; captcha: string | number }) {
    return request({
        url: `/captcha/verify?phone=${params.phone}&captcha=${params.captcha}`,
        method: 'GET',
    })
}

/**
 * 手机账号密码登录
 * @param params 账号密码
 * @returns
 */
export function getLogin(params: any) {
    let urlStr = `/login/cellphone?phone=${params.phone}&`
    if (params.password) {
        urlStr = urlStr + 'password=' + params.password
    } else if (params.captcha) {
        urlStr = urlStr + 'captcha=' + params.captcha
    }
    return request({
        method: 'get',
        url: urlStr,
    })
    // return request({
    //   method: 'POST',
    //   url: '/login/cellphone',
    //   data:{
    //     phone:params.phone,
    //     captcha:params.captcha
    //   }
    // });
}

/**
 * 获取登录状态
 * @param params
 * @returns
 */
export function loginStatus(cookie: string) {
    if (cookie !== '') {
        return request({
            url: '/login/status?cookie=' + cookie,
            method: 'GET',
        })
    } else {
        return request({
            url: '/login/status',
            method: 'GET',
        })
    }
}

/**
 * 退出登录
 * 调用此接口 , 可退出登录
 * @returns
 */
export function logout() {
    return request({
        url: '/logout',
        method: 'GET',
    })
}
