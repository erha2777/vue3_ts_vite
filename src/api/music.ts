import axios from 'axios';
import request from '@/utils/request';
// 获取用户歌单
export function getPlaylist(uid: any) {
  return request({
    url: 'user/playlist',
    method: 'GET',
    params: {
      uid,
    },
  });
}
// 获取歌单信息
export function getPlaylistMsg(id: any) {
  return request({
    url: 'playlist/detail',
    method: 'GET',
    params: {
      id,
    },
  });
}
// 获取歌单歌曲
export function getSongList(ids: any) {
  return request({
    url: 'song/detail',
    method: 'GET',
    params: {
      ids,
    },
  });
}
// 获取歌曲播放地址
export function getSong(id: any) {
  return request({
    url: 'song/url',
    method: 'GET',
    params: {
      id,
    },
  });
}
// 获取歌曲热门评论
export function getSongComment(id: any) {
  return request({
    url: 'comment/new',
    method: 'GET',
    params: {
      type: 0,
      id,
      sortType: 2,
    },
  });
}
// 获取歌曲最新评论
export function getSongNewComment(id: any) {
  return request({
    url: 'comment/new',
    method: 'GET',
    params: {
      type: 0,
      id,
      sortType: 3,
    },
  });
}
// 获取歌曲歌词
export function getSongLyric(id: any) {
  return request({
    url: 'lyric',
    method: 'GET',
    params: {
      id,
    },
  });
}
// 获取歌曲数据(地址，评论，歌词)
export function getSongData(id: any) {
  return axios.all([getSong(id), getSongComment(id), getSongLyric(id),getSongNewComment(id)]);
}

// 获取每日推荐歌曲
export function getDailyRecommendation() {
  return request({
    method: 'GET',
    url: '/recommend/songs',
  });
}

// 签到
export function signIn(){
  return request({
    method: 'GET',
    url: '/daily_signin',
  });
}

// 搜索歌曲
export function searchSong(params:any) {
  return request({
    // url: 'search',
    url: 'cloudsearch',
    method: 'GET',
    params: {
      keywords: params.keywords,
      type:params.type||1,
      limit:params.limit||30,
      offset:params.offset||0
    },
  });
}

// 获取搜索建议
export function getSearchSuggest(keywords:string){
  return request({
    method:'GET',
    url:'/search/suggest?keywords='+keywords
  })
}

// 获取搜索建议（移动端）
export function getMobileSuggest(keywords:string){
  return request({
    method:'GET',
    url:'/search/suggest?keywords='+keywords+'&type=mobile'
  })
}

// 搜索建议集合
export function getSearchSuggestMsg(keywords:string){
  return axios.all([getMobileSuggest(keywords), getSearchSuggest(keywords)]);
}

// 获取热搜列表（详细）
export function getSearchHot(){
  return request({
    method:'GET',
    url:'/search/hot/detail'
  })
}

// 对歌单添加或删除歌曲
export function updateSongsheet(op:string='add',pid:string|number,tracks:string|number){
  return request({
    method:'GET',
    url:`/playlist/tracks?op=${op}&pid=${pid}&tracks=${tracks}`
  })
}

// 获取私人fm
export function personalFm(){
  return request({
    method:'GET',
    url:`/personal_fm`
  })
}