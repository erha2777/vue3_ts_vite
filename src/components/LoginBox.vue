<script setup lang="ts">
import loginBoxFn from '@/hooks/component/loginBox'

const emit = defineEmits(['close'])

const { qrImg, status, loginForm, login, loginType, getData, getCaptchaFn, verifyPhone, verifyText, captchaFlag, countDown, close } = loginBoxFn(emit)

getData()
</script>

<template>
    <div id="loginbox" v-show="qrImg">
        <span class="iconfont icon-guanbi" @click="close()"></span>
        <div class="qrloginImg" v-show="loginType !== 'qrCode'" @click="loginType = 'qrCode'">
            <img src="../assets/qr.png" alt="" width="50" />
            <div class="mask"></div>
        </div>
        <div class="qrlogin" v-show="loginType === 'qrCode'">
            <h2>扫码登录</h2>
            <div class="qrimg">
                <img :src="qrImg" alt="" width="180" height="180" />
                <div class="mask_img" v-if="status === 800">
                    二维码已失效
                    <button @click="getData">点击刷新</button>
                </div>
            </div>
            <p>使用 <a href="javascript:;">网易云音乐APP</a> 扫码登录</p>
            <a href="javascript:;" @click="loginType = 'password'">选择其他登录模式 ></a>
        </div>
        <div class="tel_login" v-show="loginType === 'password' || loginType === 'captcha'">
            <div class="loginForm">
                <div class="phone">
                    <input type="text" v-model="loginForm.phone" placeholder="请输入手机号" />
                </div>
                <div class="captcha" v-show="loginType === 'captcha'">
                    <input type="text" v-model="loginForm.captcha" placeholder="请输入验证码" />
                    <a class="captchaBtn" :class="{ disable: !loginForm.phone || !captchaFlag }" href="javascript:;" @click="getCaptchaFn">{{ captchaFlag ? '获取验证码' : countDown }}</a>
                </div>
                <div class="password" v-show="loginType === 'password'">
                    <input type="text" v-model="loginForm.password" placeholder="请输入密码" />
                </div>
            </div>
            <div class="loginChange">
                <p class="verify_text" v-show="verifyPhone">{{ verifyText }}</p>
                <p class="changeLogin">
                    <a class="autoLogin" href="javascript:;">
                        <input type="checkbox" />
                        自动登录
                    </a>
                    <a class="loginModel" href="javascript:;" @click="loginType === 'password' ? (loginType = 'captcha') : (loginType = 'password')">{{
                        loginType === 'password' ? '验证码登录' : '密码登录'
                    }}</a>
                </p>
            </div>
            <button class="login" @click="login">登录</button>
        </div>
    </div>
</template>

<style scoped lang="scss">
#loginbox {
    width: 350px;
    height: 500px;
    box-shadow: 1px 0px 5px 1px #000;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    color: #000;
    .icon-guanbi {
        position: absolute;
        top: 10px;
        right: 10px;
    }
    .qrloginImg {
        position: absolute;
        top: 0;
        left: 0;
        cursor: pointer;
        .mask {
            position: absolute;
            top: 0;
            left: 0;
            width: 0;
            height: 0;
            border: 25px solid transparent;
            border-right: 25px solid #fff;
            border-bottom: 25px solid #fff;
        }
    }
    .qrlogin {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .qrimg {
        position: relative;
        width: 180px;
        height: 180px;
        .mask_img {
            position: absolute;
            top: 0;
            left: 0;
            width: 180px;
            height: 180px;
            color: white;
            background-color: rgba(000, 000, 000, 0.8);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            button {
                padding: 5px 10px;
                border-radius: 5px;
                font-size: 12px;
                margin-top: 10px;
                color: white;
                background-color: #0c73c2;
            }
        }
    }
}
.tel_login {
    text-align: center;
    .loginForm {
        border: 1px solid #ccc;
        border-radius: 5px;
        & > div {
            width: 250px;
            height: 40px;
        }
    }
    input[type='text'] {
        width: 100%;
        outline: none;
        border: none;
        height: 40px;
        padding-left: 20px;
        border-radius: 5px;
        font-size: 14px;
    }
    .phone {
    }
    .password {
        border-top: 1px solid #ccc;
        box-sizing: content-box;
    }
    .captcha {
        display: flex;
        align-items: center;
        border-top: 1px solid #ccc;
        box-sizing: content-box;
        input {
            width: 65%;
        }
        .captchaBtn {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 35%;
            height: 50%;
            font-size: 12px;
            padding: 0;
            margin: 0;
            border-left: 1px solid #ccc;
            color: #666666;
        }
        .disable {
            color: #ccc;
            cursor: not-allowed;
        }
    }

    .verify_text {
        color: red;
        font-size: 12px;
        text-align: left;
        line-height: 30px;
    }
    .login {
        border: none;
        width: 100%;
        color: white;
        height: 40px;
        border-radius: 5px;
        background-color: red;
    }
}
.loginChange {
    height: 70px;
}
.changeLogin {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 30px;
    font-size: 14px;
    a {
        display: flex;
        align-items: center;
    }
    .autoLogin {
        display: flex;
        align-items: center;
        input {
            margin-right: 5px;
        }
    }
    .loginModel {
        color: #0c73c2;
    }
}
</style>
