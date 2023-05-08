<template>
  <view class="settingHeadImage" @touchstart="onTouchstart" @touchmove.stop.prevent="onTouchmove" @touchend="touchE">
    <!-- 蒙层 -->
    <canvas class="pre-canvas" canvas-id="firstCanvas" :style="{ width: 100 + 'vw', height: 100 + 'vh' }"></canvas>
    <!-- img预览 -->
    <view class="preImage" :style="{ width: preImgW + 'px' }">
<!--      <movable-area-->
<!--          :scale-area="true"-->
<!--      >-->
<!--        <movable-view-->
<!--            direction="all"-->
<!--            :inertia="true"-->
<!--            :scale-min="0.001"-->
<!--            :scale-max="4"-->
<!--            :scale="true"-->
<!--            @scale="scaleChange"-->
<!--        >-->
          <canvas
              canvas-id="mycanvas"
              class="pre-i"
              :style="{ width: preImgW + 'px', height: preImgH + 'px', transform: `translate(${x}px,${y}px)` }"
          />
<!--        </movable-view>-->
<!--      </movable-area>-->
    </view>
    <!-- 工具 -->
    <view class="setting-btns">
      <view @click="$emit('close')">取消</view>
      <view @click="onCrop">确定</view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ImageCropper',
  props: ['imgUrl'],
  data() {
    return {
      maxW: 250, // 最大宽度
      maxH: 250,
      screenWidth: '', // 屏幕宽
      screenHeight: '',
      xToTop: 0, // x方向距离顶部距离
      scale: 1, // 缩放
      preSrc: '',
      preImgW: '',
      preImgH: '',
      x: 0,
      y: 0,
      oldx: 0,
      oldy: 0,
      isMove: false,
      start: {
        left: 0,
        top: 0
      }
    };
  },
  computed: {},
  mounted() {
    // 选择照片信息
    const query = uni.createSelectorQuery().in(this);
    query.select('.settingHeadImage').fields({
      node: true,
      size: true
    }).exec(res => {
      // 设置屏幕大小
      this.screenWidth = res[0].width;
      this.screenHeight = res[0].height;
      // 设置图像基准值，图像基准值按屏幕宽度设置，两边留白各40
      this.maxH = res[0].width - 80;
      this.maxW = res[0].width - 80;
      // 设置X轴值，算式：屏幕高度的一半减去基准框高度的一半
      this.xToTop = this.screenHeight / 2 - this.maxH / 2;
      this.setImageSize();
    });
  },
  methods: {
    // 宽高处理
    setImageSize(data) {
      const tempFilePath = this.imgUrl
      const {
        maxH,
        maxW
      } = this;
      uni.getImageInfo({
        src: tempFilePath,
        fail(res) {

        },
        success: res => {

          const {
            errMsg,
            path,
            width,
            height
          } = res;
          let w = '';
          let h = '';
          if (errMsg === 'getImageInfo:ok') {
            w = width;
            h = height;
            // 宽大与高大于最大宽度
            if (width > height && width > maxW) {
              w = Math.floor((width / height) * maxW);
              h = maxH;
            }
            // 高大于宽大于最大高度
            if (height > width && height > maxH) {
              h = Math.floor((height / width) * maxH);
              w = maxW;
            }
            // 宽高相等或者宽高小于最大值
            if (width === height || (width < maxW && height < maxH)) {
              h = maxH;
              w = maxW;
            }
            this.preSrc = path;
            this.preImgH = h;
            this.preImgW = w;
            // 设置蒙层
            this.setBgBox();
            // 图像预览
            this.previewCanvas({
              w,
              h,
              path
            });
          }
        }
      });
    },

    // 设置蒙层
    setBgBox() {
      const {
        maxW,
        maxH,
        screenHeight,
        screenWidth,
        xToTop
      } = this;
      const ctx = uni.createCanvasContext('firstCanvas', this);
      // 先清除矩形
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      // 设置canvas透明度
      ctx.setGlobalAlpha(0.7);
      // 设置蒙层颜色
      ctx.setFillStyle('#000000');
      // 绘制蒙层
      ctx.fillRect(0, 0, screenWidth, screenHeight);
      // 基准框留白
      ctx.clearRect(40, xToTop, maxW, maxH);
      // 绘制基准框
      ctx.beginPath();
      ctx.setStrokeStyle('#FFFFFF');
      ctx.strokeRect(40, xToTop, maxW, maxH);
      ctx.closePath();
      ctx.draw();
    },
    // 预览
    previewCanvas(
        {
          w,
          h,
          path
        }) {
      const ctx = uni.createCanvasContext('mycanvas', this);
      ctx.drawImage(path, 0, 0, w, h);
      ctx.draw();
    },
    onTouchstart(ev) {
      if (ev.changedTouches.length === 1) {
        this.isMove = true;
        this.start.left = ev.changedTouches[0].clientX;
        this.start.top = ev.changedTouches[0].clientY;
      }
    },
    onTouchmove(ev) {
      const {
        maxW,
        maxH,
        preImgH,
        preImgW,
        xToTop
      } = this;
      if (this.isMove && ev.changedTouches.length === 1) {
        let clientX = ev.changedTouches[0].clientX,
            clientY = ev.changedTouches[0].clientY;
        this.x = preImgW <= maxW ? 0 : this.oldx + clientX - this.start.left;
        this.y = preImgH <= maxH ? 0 : this.oldy + clientY - this.start.top;
      }
    },
    touchE(val) {
      const {
        preImgH,
        preImgW,
        maxH,
        maxW
      } = this;
      const query = uni.createSelectorQuery().in(this);
      const fx = this.x;
      query.select('.pre-i').boundingClientRect();
      query.exec(res => {
        // x、y回弹计算
        let y = (res[0].height - res[0].width) / 2;
        /**
         * 判断照片可移动的距离是否大于留白的值，如果大于向右划时图片的宽减去基准框的宽减去留白向左时留白，小于时按图片的可移动值
         * */
        let x = (preImgW - maxW) / 2 > 40 ? (fx < 0 ? preImgW - maxW - 40 : 40) : (preImgW - maxW) / 2;
        if (preImgH > maxH) {
          this.y = this.y > y ? y : this.y < -y ? -y : this.y;
        }
        if (preImgW > maxW) {
          this.x = this.x > x ? x : this.x < -x ? -x : this.x;
        }
        this.oldx = this.x;
        this.oldy = this.y;
        this.isMove = false;
      });
    },
    // 裁剪
    onCrop() {
      let y = 0;
      let x = 0;
      const query = uni.createSelectorQuery().in(this);
      query.select('.pre-i').boundingClientRect();
      query.exec(res => {
        // 获取预览img距离左上的距离
        y = Math.abs(res[0].top);
        x = Math.abs(res[0].left);
        const {
          maxW,
          maxH,
          xToTop
        } = this;
        const _this = this
        uni.canvasToTempFilePath({
          x: Math.abs(res[0].left < 0 ? x + 40 : x - 40),
          y: Math.abs(res[0].top < 0 ? xToTop + y : xToTop - y),
          width: maxW,
          height: maxH,
          destWidth: maxW,
          destHeight: maxH,
          canvasId: 'mycanvas',
          success: fileRes => {
            _this.$emit('done', fileRes.tempFilePath)
          },
          fail: function (err) {
            console.log(err);
            uni.showToast({
              title: '裁剪失败：图片生成过程中遇到错误',
              icon: 'none'
            });
          }
        }, this);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.settingHeadImage {
  background-color: #000000;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2;

  .pre-canvas {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 20;
  }

  .preImage {
    min-width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    z-index: 1;

    .pre-i {
      // transition: all 0.1s;
    }
  }

  .setting-btns {
    position: fixed;
    bottom: 24px;
    left: 0;
    z-index: 25;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24px;
    width: calc(100% - 48px);
  }
}
</style>
