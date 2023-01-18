import { createStore } from 'vuex'
import { loginStatus, ykLogin, logout } from '@/api/login'
import { getPlaylist, getSongData } from '@/api/music'
import { singerName, filterLyrics } from '@/utils/utils'

// 创建一个新的 store 实例 并导出
export default createStore({
    state() {
        return {
            userInfo: {
                userId: '',
            }, // 用户信息
            songSheet: [], // 用户歌单
            songListFrom: '', // 当前歌曲列表来自哪
            playListId: '', // 当前歌单id
            songList: [], // 歌曲列表
            songData: {
                id: '', // 歌曲id
                singer: '', // 歌手
                name: '', // 歌曲名称
                alia: '', // 其他
                picUrl: '', // 歌曲专辑图片
                album: '',
                url: '', // 歌曲地址
                commentCount: 0, // 评论总数
                comments: [], // 歌曲评论
                newComments: [],
                lyricsForm: {
                    // 歌曲歌词
                    lrc: [],
                    tlyric: [],
                    double: false,
                },
            },
            activeId: '', // 点击的样式
            playState: {
                // 歌曲播放状态
                stop: false, // 停止播放
                repeat: false, // 循环播放
                shuffle: false, // 随机播放
            },
            volume: 1, // 音量
            playTime: '00:00', // 当前播放时间
            playTimeTo3: '00:00.000', // 保留三位小数
            endTime: '00:00', // 歌曲总时长
            playBar: '0%', // 进度条
            progress: '', // 歌曲播放进度数值型
            rightClickMenu: {
                // 右键菜单
                activeId: '',
                mouseX: '',
                mouseY: '',
                show: false,
                type: '',
                status: '',
            },
        }
    },
    mutations: {
        setPlayListId(state, id) {
            // 设置当前歌单id
            state.playListId = id
        },
        setRightClickMenu(state, data) {
            // 设置右键菜单
            state.rightClickMenu.activeId = data.activeId || state.rightClickMenu.activeId
            state.rightClickMenu.mouseX = data.mouseX || state.rightClickMenu.mouseX
            state.rightClickMenu.mouseY = data.mouseY || state.rightClickMenu.mouseY
            state.rightClickMenu.show = data.show
            state.rightClickMenu.type = data.type || state.rightClickMenu.type
            state.rightClickMenu.status = data.status || data.status
        },
        setUserInfo(state, userInfo) {
            // 设置用户信息
            state.userInfo = userInfo
        },
        setSongSheet(state, songSheet) {
            // 设置歌单
            state.songSheet = songSheet
        },
        setSongData(state, payload) {
            // 设置歌曲信息
            state.songData.id = payload.id
            state.songData.singer = payload.ar ? singerName(payload.ar) : singerName(payload.artists)
            state.songData.name = payload.name
            state.songData.picUrl = payload.al ? payload.al.picUrl : payload.album.picUrl
            state.songData.album = payload.al ? payload.al.name : payload.album.name
            state.songData.alia = payload.alia ? payload.alia.join('/') : payload.alias.join('/')
        },
        setSongUrl(state, data) {
            // 设置歌曲地址
            if (data.code === 200) {
                if (data.data[0].url) {
                    state.songData.url = data.data[0].url.replace('http', 'https')
                    // state.songData.url = data.data[0].url
                    state.playState.stop = false
                    console.log('获取歌曲地址成功')
                } else {
                    state.songData.url = './'
                    state.playState.stop = true
                    console.log('获取歌曲地址失败')
                }
            } else {
                console.log('获取歌曲地址失败')
            }
        },
        setComments(state, data) {
            // 设置歌曲评论
            if (data.code === 200) {
                state.songData.comments = data.data.comments
                state.songData.commentCount = data.data.totalCount
                console.log('获取歌曲评论成功')
            } else {
                console.log('获取歌曲评论失败')
            }
        },
        setNewComments(state, data) {
            // 设置歌曲评论
            if (data.code === 200) {
                state.songData.newComments = data.data.comments
            }
        },
        setLyric(state, data) {
            // 设置歌曲歌词
            if (data.code !== 200) {
                console.log('获取歌词失败')
                return
            }
            let flag = true
            if (data.lrc?.lyric) {
                state.songData.lyricsForm.lrc = filterLyrics(data.lrc.lyric)
                console.log('获取歌词成功')
            } else {
                flag = false
                console.log('暂无歌词')
            }
            if (data.tlyric?.lyric) {
                state.songData.lyricsForm.tlyric = filterLyrics(data.tlyric.lyric)
                console.log('获取歌词翻译成功')
            } else {
                flag = false
                console.log('暂无歌词翻译')
            }
            state.songData.lyricsForm.double = flag
        },
        setSongStop(state, payload) {
            // 是否停止播放
            state.playState.stop = payload
        },
        setSongList(state, payload) {
            // 设置歌单
            state.songList = payload
        },
        setSongListFrom(state, payload) {
            // 设置歌曲列表来源
            state.songListFrom = payload
        },
        setSongRepeat(state, payload) {
            // 是否循环播放
            state.playState.repeat = payload
        },
        setSongShuffle(state, payload) {
            // 是否随机播放
            state.playState.shuffle = payload
        },
        setPlayTime(state, playload) {
            // 设置当前播放时间
            state.playTime = playload
        },
        setPlayTimeTo3(state, playload) {
            // 设置当前播放时间
            state.playTimeTo3 = playload
        },
        setEndTime(state, playload) {
            // 设置歌曲总时长
            state.endTime = playload
        },
        setPlayBar(state, playload) {
            // 设置进度条
            state.playBar = playload
        },
        setSongVolume(state, playload) {
            // 设置音量
            state.volume = playload
        },
        setProgress(state, playload) {
            // 设置歌曲播放进度
            state.progress = playload
        },
        setActiveId(state, playload) {
            // 设置点击样式的id
            state.activeId = playload
        },
    },
    actions: {
        async getYKCookie() {
            // 游客登陆
            const { data } = await ykLogin()
            if (data.code === 200) {
                window.localStorage.setItem('ykCookie', data.cookie)
                console.log('游客登录成功');
            }else{
                console.log('游客登录失败');
            }
        },
        async getLoginStatus(context) {
            // 获取登陆状态
            const { data } = await loginStatus(localStorage.getItem('cookie') || '')
            if (data.data.profile) {
                console.log('登录成功')
                context.commit('setUserInfo', data.data.profile)
                context.dispatch('getSongSheet', data.data.profile.userId)
            } else {
                console.log('未登录')
            }
        },
        async getSongSheet(context, uid) {
            // 获取用户歌单
            const { data } = await getPlaylist(uid)
            if (data.code === 200) {
                context.commit('setSongSheet', data.playlist)
                console.log('获取用户歌单成功')
            } else {
                console.log('获取用户歌单失败')
            }
        },
        async getSongMsg(context, args) {
            // 获取歌曲数据
            context.commit('setSongData', args)
            const [{ data: res1 }, { data: res2 }, { data: res3 }, { data: res4 }] = await getSongData(args.id)
            context.commit('setSongUrl', res1)
            context.commit('setComments', res2)
            context.commit('setLyric', res3)
            context.commit('setNewComments', res4)
        },
        async logout(context, args) {
            const { data } = await logout()
            console.log(data)
            window.localStorage.removeItem('cookie')
            context.commit('setUserInfo', { userId: '' })
            context.commit('setSongSheet', [])
            // context.commit('setSongListFrom','')
            // context.commit('setPlayListId','')
        },
    },
})
