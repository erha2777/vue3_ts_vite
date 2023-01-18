export function singerName(arr: any[]) {
    return arr.map((v) => v.name).join('/')
}

export function indexNumber(num: number) {
    let str = num + 1
    return str < 10 ? '0' + str : str
}

export function SongTime(num: number) {
    return formatDuration(num)
}

export function filterLyrics(str: any) {
    let arr = str.replace(/\n/g, ',').split(',')
    arr = arr.map((v: any) => {
        let id = v.match(/^\[+.*\]/)
        id = id ? id[0] : id
        return {
            id,
            text: v.replace(/^\[+.*\]/, ''),
        }
    })
    return arr
}

export function randomNum(minNum: any, maxNum: any) {
    let num = null
    switch (arguments.length) {
        case 1:
            num = parseInt(Math.random() * minNum + 1 + '')
            break
        case 2:
            num = parseInt(Math.random() * (maxNum - minNum + 1) + minNum)
            break
        default:
            num = 0
    }
    return num
}

// 借助 canvas 提取图片主要 rgb 色值
export function getImgRGB(url: any): any {
    let img = document.createElement('img')
    img.src = url

    return new Promise(function (resolve, reject) {
        img.addEventListener('load', () => {
            let canvas = document.createElement('canvas')
            canvas.width = img.width
            canvas.height = img.height

            let context: any = canvas.getContext('2d')
            // img.crossOrigin = 'Anonymous';
            img.crossOrigin = ''
            context.drawImage(img, 0, 0, canvas.width, canvas.height)

            // 获取像素数据
            let data = context.getImageData(0, 0, img.width, img.height).data
            let r = 1,
                g = 1,
                b = 1
            // 取所有像素的平均值
            for (let row = 0; row < img.height; row++) {
                for (let col = 0; col < img.width; col++) {
                    // console.log(data[((img.width * row) + col) * 4])
                    if (row == 0) {
                        r += data[img.width * row + col]
                        g += data[img.width * row + col + 1]
                        b += data[img.width * row + col + 2]
                    } else {
                        r += data[(img.width * row + col) * 4]
                        g += data[(img.width * row + col) * 4 + 1]
                        b += data[(img.width * row + col) * 4 + 2]
                    }
                }
            }

            // 求取平均值
            r /= img.width * img.height
            g /= img.width * img.height
            b /= img.width * img.height

            // 将最终的值取整
            r = Math.round(r)
            g = Math.round(g)
            b = Math.round(b)
            resolve({
                rgb: `rgb(${r},${g},${b})`,
                hsl: rgbtohsl([r, g, b]),
                hex: getLightColor(RgbToHex(r, g, b), 0.7),
            })
        })
    })
}

// 将rgb色转位hsl色并增强 s，l值
function rgbtohsl(rgb: any) {
    let r = rgb[0] / 255
    let g = rgb[1] / 255
    let b = rgb[2] / 255

    let min = Math.min(r, g, b)
    let max = Math.max(r, g, b)
    let l: any = (min + max) / 2
    let difference = max - min
    let h: any, s
    if (max == min) {
        h = 0
        s = 0
    } else {
        s = l > 0.5 ? difference / (2.0 - max - min) : difference / (max + min)
        switch (max) {
            case r:
                h = (g - b) / difference + (g < b ? 6 : 0)
                break
            case g:
                h = 2.0 + (b - r) / difference
                break
            case b:
                h = 4.0 + (r - g) / difference
                break
        }
        h = Math.round(h * 60)
    }
    s = Math.round(s * 100 * 1.5) + '%' //转换成百分比的形式
    l = Math.round(l * 100 * 0.8) + '%'
    const str = 'hsl(' + h + ',' + s + ',' + l + ')'
    return str
}

//GRB颜色转Hex颜色
function RgbToHex(a: any, b: any, c: any): any {
    let r = /^\d{1,3}$/
    if (!r.test(a) || !r.test(b) || !r.test(c)) return console.log('输入错误的rgb颜色值')
    let hexs = [a.toString(16), b.toString(16), c.toString(16)]
    for (let i = 0; i < 3; i++) if (hexs[i].length == 1) hexs[i] = '0' + hexs[i]
    return '#' + hexs.join('')
}

//hex颜色转rgb颜色
function HexToRgb(str: string) {
    // let r = /^\#?[0-9A-F]{6}$/;
    let r = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
    //test方法检查在字符串中是否存在一个模式，如果存在则返回true，否则返回false
    if (!r.test(str)) return console.log('输入错误的hex')
    //replace替换查找的到的字符串
    str = str.replace('#', '')
    //match得到查询数组
    let hxs: any = str.match(/../g)
    //alert('bf:'+hxs)
    for (let i = 0; i < 3; i++) hxs[i] = parseInt(hxs[i], 16)
    //alert(parseInt(80, 16))
    //console.log(hxs);
    return hxs
}

//得到hex颜色值为color的加深颜色值，level为加深的程度，限0-1之间
function getDarkColor(color: string, level: number) {
    let r = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
    if (!r.test(color)) return window.alert('输入错误的hex颜色值')
    let rgbc = HexToRgb(color)
    //floor 向下取整
    for (let i = 0; i < 3; i++) rgbc[i] = Math.floor(rgbc[i] * (1 - level))
    return RgbToHex(rgbc[0], rgbc[1], rgbc[2])
}

//得到hex颜色值为color的减淡颜色值，level为减浅的程度，限0-1之间
function getLightColor(color: string, level: number) {
    // let r = /^\#?[0-9A-F]{6}$/;
    let r = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
    if (!r.test(color)) return console.log('输入错误的hex颜色值')
    let rgbc = HexToRgb(color)
    for (let i = 0; i < 3; i++) rgbc[i] = Math.floor((255 - rgbc[i]) * level + rgbc[i])
    return RgbToHex(rgbc[0], rgbc[1], rgbc[2])
}

// 判断元素是否为子元素(非常好用)
export const isDescendant = (el: any, type: string, name: any) => {
    let isChild = false

    if (type === 'class') {
        if (el.className === name) {
            //判断是否是其本身
            isChild = true
        }
    } else {
        if (el.id === name) {
            //判断是否是其本身
            isChild = true
        }
    }

    while ((el = el.parentNode)) {
        if (type === 'class') {
            if (el.className === name) {
                //判断是否是其本身
                isChild = true
            }
        } else {
            if (el.id == name) {
                isChild = true
            }
        }
    }

    return isChild
}

//  转换毫秒数时间
const formatDuration = (ms: any) => {
    if (ms < 0) ms = -ms
    const time = {
        day: Math.floor(ms / 86400000),
        hour: Math.floor(ms / 3600000) % 24,
        minute: Math.floor(ms / 60000) % 60,
        second: Math.floor(ms / 1000) % 60,
        millisecond: Math.floor(ms) % 1000,
    }
    // return Object.entries(time)
    //   .filter(val => val[1] !== 0)
    //   .map(([key, val]) => `${val} ${key}${val !== 1 ? 's' : ''}`)
    //   .join(', ');

    // return Object.entries(time)
    //   .filter(val => val[1] !== 0)
    //   .map(([key, val]) => `${val}`)
    //   .join(':');

    return `${time.minute < 10 ? '0' + time.minute : time.minute}:${time.second < 10 ? '0' + time.second : time.second}`
}

export const filterKeyword = (text: string, Keyword: string) => {
    let reg = new RegExp(`${Keyword}`, 'i')
    return text.replace(reg, `<span class="keywords">${text.match(reg)}</span>`)
}
