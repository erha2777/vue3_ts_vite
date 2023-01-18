import { ref,onMounted } from 'vue'
import { randomNum } from '@/utils/utils';
export default function () {
    const interval: any = ref(0) // 间隔 = 线的宽度加间隔宽度
    const intervalWidth = ref(2) // 间隔宽度
    const lineWidth: any = ref(0) // 线的宽度
    const wrapWidth: any = ref(0) // canvas宽度
    const wrapHeight: any = ref(400) // canvas高度
    const step: any = ref(180) // 频谱步长

    /**
     * 重置canvas属性
     */
    const reset = () => {
        // 重置canvas宽度
        const box: any = document.querySelector('#musicCanvas')
        const canvas: any = document.querySelector('#wrap')
        canvas.width = window.getComputedStyle(box).width.replace('px', '')
        wrapWidth.value = window.getComputedStyle(box).width.replace('px', '')
        // wrapHeight.value = window.getComputedStyle(box).height.replace('px','')
        lineWidth.value = wrapWidth.value / step.value - intervalWidth.value
        interval.value = lineWidth.value + intervalWidth.value
    }

    // 单击出现的选项相关
    let mouseX = ref(0) // x轴距离
    let mouseY = ref(0) // y轴距离
    let clickFlag = ref(true)
    let clickTimer: any = null

    const scrollShow = ref(false)
    const operationFlag = ref(false)

    onMounted(() => {
        reset()
        init()

        const musicCanvas = document.querySelector('#musicCanvas')
        musicCanvas?.addEventListener('mousemove', (e: any) => {
            if (!clickFlag.value) return
            if (!operationFlag.value) {
                mouseX.value = e.clientX - 25
                mouseY.value = e.clientY - 25
            }
        })
        musicCanvas?.addEventListener('click', (e: any) => {
            if (!clickFlag.value) return
            if (e.target.id === 'musicCanvas' || e.target.className.indexOf('operation') !== -1) {
                clickFlag.value = false
                operationFlag.value = !operationFlag.value
                if (operationFlag.value) {
                    mouseX.value = e.clientX - 25
                    mouseY.value = e.clientY - 25
                }
                clickTimer = setTimeout(() => {
                    clickFlag.value = true
                    clearTimeout(clickTimer)
                }, 1000)
            }
        })
    })

    let oldArr: any = ref([])

    // 初始化 canvas 函数
    const init = () => {
        const wrap: any = document.querySelector('#wrap')
        const cxt = wrap.getContext('2d') // 获取画布对象
        // 获取API
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext
        const context = new AudioContext()
        // 加载媒体
        const audio: any = document.querySelector('#audio audio')
        // 创建节点
        const source = context.createMediaElementSource(audio)
        const analyser = context.createAnalyser()
        // 连接：source → analyser → destination
        source.connect(analyser)
        analyser.connect(context.destination)

        // 创建数据
        const output = new Uint8Array(step.value)

        // 画长条图谱
        ;(function drawSpectrum() {
            analyser.getByteFrequencyData(output) //获取频域数据
            cxt.clearRect(0, 0, wrapWidth.value, wrapHeight.value)
            let num = 0
            for (let i = 0; i < step.value; i++) {
                let value = output[i] * 1.5 //<===获取数据
                drawBar(i, num, value)
                drawBarLine(i, num, value)
                num += interval.value
            }

            // 画柱子
            function drawBar(i: number, num: number, value: number) {
                cxt.beginPath()
                cxt.lineWidth = lineWidth.value
                cxt.moveTo(i + num, wrapHeight.value)
                cxt.lineTo(i + num, wrapHeight.value - value)
                // cxt.strokeStyle = '#fff';
                //创建线性渐变的方法->CanvasGradient类型的对象
                let linearGradient = cxt.createLinearGradient(i + num, wrapHeight.value, i + num, 0)
                linearGradient.addColorStop(0, 'rgba(255,255,255,.1)')
                linearGradient.addColorStop(1, 'rgba(255,255,255,1)')
                //添加渐变颜色
                cxt.strokeStyle = linearGradient
                cxt.stroke()
            }

            // 画柱子上的横线
            function drawBarLine(i: number, num: number, value: number) {
                if (oldArr.value[i] == undefined || value >= oldArr.value[i]) {
                    oldArr.value[i] = value
                } else {
                    oldArr.value[i] = oldArr.value[i] - 0.5
                }
                cxt.beginPath()
                cxt.lineWidth = lineWidth.value
                cxt.moveTo(i + num, wrapHeight.value - oldArr.value[i])
                cxt.lineTo(i + num, wrapHeight.value - oldArr.value[i] - 2)
                cxt.strokeStyle = 'rgba(255,255,255,.5)'
                cxt.stroke()
            }

            //请求下一帧
            requestAnimationFrame(drawSpectrum)
        })()
    }
    // 画圆形图谱
    const init2 = () => {
        //   (function drawSpectrum() {
        //     analyser.getByteFrequencyData(output); //获取频域数据
        //     cxt.clearRect(0, 0, wrap.width, wrap.height);
        //     //画线条
        //     for (var i = 0; i < 360; i++) {
        //       var value = output[i] / 8; //<===获取数据
        //       cxt.beginPath();
        //       cxt.lineWidth = 2;
        //       cxt.moveTo(300, 300);
        //       //R * cos (PI/180*一次旋转的角度数) ,-R * sin (PI/180*一次旋转的角度数)
        //       cxt.lineTo(
        //         Math.cos(((i * 1) / 180) * Math.PI) * (200 + value) + 300,
        //         -Math.sin(((i * 1) / 180) * Math.PI) * (200 + value) + 300
        //       );
        //       cxt.strokeStyle = '#fff';
        //       cxt.stroke();
        //     }
        //     //画一个小圆，将线条覆盖
        //     cxt.beginPath();
        //     cxt.lineWidth = 1;
        //     cxt.arc(300, 300, 200, 0, 2 * Math.PI, false);
        //     // cxt.fillStyle = "#fff";
        //     cxt.stroke();
        //     cxt.fill();
        //     //请求下一帧
        //     requestAnimationFrame(drawSpectrum);
        //   })();
    }

    // 切换背景图片
    const getImageUrl = (name: string) => {
        return new URL(`../../assets/bg/${name}`, import.meta.url).href
    }
    const bgList = ref(['3.jpg', '2.png', '1.jpg','4.jpg', '6.png', '7.jpg', '8.png', '9.jpg', '10.jpg'])
    const bgIndex = ref(0)
    const bgChange = () => {
        let index = 0
        do {
            index = randomNum(0, bgList.value.length-1)
        } while (bgIndex.value == index)
        bgIndex.value = index
    }
    return {
        interval,
        intervalWidth,
        lineWidth,
        wrapWidth,
        wrapHeight,
        step,
        reset,
        operationFlag,
        scrollShow,
        mouseX,
        mouseY,
        getImageUrl,
        bgList,
        bgIndex,
        bgChange
    }
}
