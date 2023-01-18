import request from '@/utils/request';

/**
 * 获取用户详情
 * 登录后调用此接口 , 传入用户 id, 可以获取用户详情
 * @param uid 用户 id
 * @returns 
 */
export function getUserInfo(uid:[string|number]) {
    return request({
        method: 'get',
        url: '/user/detail?uid='+uid,
      });
}

/**
 * 获取账号信息
 * 登录后调用此接口 ,可获取用户账号信息
 * @returns 
 */
export function getAccount() {
    return request({
        method: 'get',
        url: '/user/account',
      });
}

/**
 * 获取用户信息 , 歌单，收藏，mv, dj 数量
 * 登录后调用此接口 , 可以获取用户信息
 * @returns 
 */
export function getSubcount() {
    return request({
        method: 'get',
        url: '/user/subcount',
      });
}

/**
 * 获取用户等级信息
 * 登录后调用此接口 , 可以获取用户等级信息,包含当前登录天数,听歌次数,下一等级需要的登录天数和听歌次数,当前等级进度,对应 https://music.163.com/#/user/level
 * @returns 
 */
export function getLevel() {
    return request({
        method: 'get',
        url: '/user/level',
      });
}