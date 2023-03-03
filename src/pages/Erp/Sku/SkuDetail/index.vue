<template>
  <view id="root">
    <view class="safeArea">
      <view class="skuDetail">
        <view class="adm-swiper" style="--slide-size: 100%;--track-offset: 0%">
          <view class="adm-swiper-track adm-swiper-track-allow-touch-move">
            <view class="adm-swiper-track-inner" style="transform: none">
              <view class="adm-swiper-slide">
                <view class="adm-swiper-item">
                  <view class="imgS">
                    <view class="uni-margin-wrap">
                      <swiper @change="change">
                        <swiper-item v-for="src in srcs" :key="srcs">
                          <image :src="src" @click="img" mode="aspectFill"></image>
                        </swiper-item>
                      </swiper>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
          <view class="edit">
            <uni-icons type="compose" color="#ffffff"></uni-icons>
          </view>
          <view class="customIndicator">{{ customIndicator }}/{{ total }}</view>
        </view>
        <view class="header">
          <view class="flexCenter sku">
            <view class="flexGrow">
              <view class="spuName">{{ spuName }}</view>
              <view class="skuName">{{ skuName }}</view>
              <view class="bindPosition">{{ bindPosition }}</view>
            </view>
            <view class="otherData">
              <uni-icons custom-prefix="iconfont" type="icon-erweima" @click="center"></uni-icons>
              <view class="adm-mask adm-center-popup-mask" style="background: rgba(0,0,0,0.55); opacity: 1"
                    :hidden="centerHidden">
                <view class="adm-mask-aria-button" role="button" aria-label="背景蒙层"></view>
                <view class="adm-center-popup-wrap" role="dialog">
                  <view style="opacity: 1;transform: none;">
                    <view class="adm-center-popup-body adm-dialog-body">
                      <view class="adm-dialog-content">
                        <view style="text-align: center;">
                          <view class="codeTitle">
                            是否打印物料码
                          </view>
                          <view style="padding-top: 19px;">
                            <image :src="erweima" style="width: 187px; height: 187px"></image>
                          </view>
                        </view>
                      </view>
                      <view class="adm-dialog-footer">
                        <view class="adm-dialog-action-row">
                          <view class="button">
                            <view class="cancel" @click="cencel">取消</view>
                          </view>
                          <view class="button">
                            <view class="cancel">打印</view>
                          </view>
                        </view>
                      </view>
                    </view>
                  </view>
                </view>
              </view>
              <view class="number">
                <view class="span">×234</view>
                <view class="unit">件</view>
              </view>
            </view>
          </view>
          <view class="actions flexCenter">
            <view class="action flexGrow">
              <uni-icons type="list"></uni-icons>
              库存明细
            </view>
            <view class="action flexGrow">
              <uni-icons type="flag"></uni-icons>
              关联任务
            </view>
            <view class="action flexGrow">
              <uni-icons type="info"></uni-icons>
              操作记录
            </view>
          </view>
        </view>
        <view class="skuData">
          <view class="adm-space adm-space-vertical" style="width: 100%">
            <view class="adm-space-item">
              <view class="flexCenter">
                <view class="lable lables">物料分类</view>
                <view class="value">产成品</view>
              </view>
            </view>
            <view class="adm-space-item">
              <view class="flexCenter">
                <view class="lable lables">物料编码</view>
                <view class="value">00001</view>
              </view>
            </view>
            <view class="adm-space-item">
              <view class="flexCenter">
                <view class="lable lables">产品名称</view>
                <view class="value">数控车床</view>
              </view>
            </view>
            <view class="adm-space-item">
              <view class="flexCenter">
                <view class="lable lables">产品码</view>
                <view class="value">2</view>
              </view>
            </view>
            <view class="show" style="overflow: hidden" :hidden="hidden">
              <view class="adm-space-item">
                <view class="flexCenter">
                  <view class="lable lables">单位</view>
                  <view class="value">件</view>
                </view>
                <view class="adm-space-item">
                  <view class="flexCenter">
                    <view class="lable lables">二维码...</view>
                    <view class="value">一批一码</view>
                  </view>
                </view>
                <view class="adm-space-item">
                  <view class="flexCenter">
                    <view class="lable lables">规格</view>
                    <view class="value">0213</view>
                  </view>
                </view>
                <view class="adm-space-item">
                  <view class="flexCenter">
                    <view class="lable lables">养护周期</view>
                    <view class="value">0 天</view>
                  </view>
                </view>
                <view class="adm-space-item">
                  <view class="flexCenter">
                    <view class="lable lables">物料描述</view>
                    <view class="value">无</view>
                  </view>
                </view>
                <view class="adm-space-item">
                  <view class="flexCenter">
                    <view class="lable lables">品牌</view>
                    <view class="value">浑河库存、超同步</view>
                  </view>
                </view>
                <view class="adm-space-item">
                  <view class="flexCenter">
                    <view class="lable lables">型号</view>
                    <view class="value">-</view>
                  </view>
                </view>
                <view class="adm-space-item">
                  <view class="flexCenter">
                    <view class="lable lables">材质</view>
                    <view class="value">-</view>
                  </view>
                </view>
                <view class="adm-space-item">
                  <view class="flexCenter">
                    <view class="lable lables">重量</view>
                    <view class="value">0 kg</view>
                  </view>
                </view>
                <view class="adm-space-item">
                  <view class="flexCenter">
                    <view class="lable lables">尺寸</view>
                    <view class="value">-</view>
                  </view>
                </view>
                <view class="adm-space-item">
                  <view class="flexCenter">
                    <view class="lable lables">表色</view>
                    <view class="value">-</view>
                  </view>
                </view>
                <view class="adm-space-item">
                  <view class="flexCenter">
                    <view class="lable lables">级别</view>
                    <view class="value">-</view>
                  </view>
                </view>
                <view class="adm-space-item">
                  <view class="flexCenter">
                    <view class="lable lables">热处理</view>
                    <view class="value">-</view>
                  </view>
                </view>
                <view class="adm-space-item">
                  <view class="flexCenter">
                    <view class="lable lables">包装方式</view>
                    <view class="value">-</view>
                  </view>
                </view>
                <view class="adm-space-item">
                  <view class="flexCenter">
                    <view class="lable lables">图幅</view>
                    <view class="value">-</view>
                  </view>
                </view>
                <view class="adm-space-item">
                  <view class="flexCenter">
                    <view class="lable lables">备注</view>
                    <view class="value">-</view>
                  </view>
                </view>
              </view>
            </view>
          </view>
          <view class="adm-divider adm-divider-horizontal adm-divider-center"
                style="color: rgb(128,128,128);font-size: 12px;margin: 0; border-color: rgb(245,245,245)">
            <view class="adm-divider-content" @click="show">
              <uni-icons :type=" hidden===true ? 'bottom' : 'top' "></uni-icons>
            </view>
          </view>
        </view>
        <view class="supply">
          <view class="title">
            供应商(2)
            <view class="extra">
              <view class="submit" @click="more">
                查看更多
                <uni-icons type="right" color="#2680eb"></uni-icons>
              </view>
            </view>
          </view>
          <view class="flexCenter supplyItem">
            <view class="flexGrow">沧州力久机械执照有限公司</view>
          </view>
          <view class="flexCenter supplyItem">
            <view class="flexGrow">成都信华光电技术有限公司</view>
          </view>
        </view>
        <view class="adm-popup" style="--z-index:1001;">
          <view class="adm-mask" style="background: rgba(0,0,0,0.55); opacity: 1;" :hidden="maskHidden">
            <view class="adm-mask-aria-button" role="button" aria-label="背景蒙层"></view>
          </view>
          <view class="adm-popup-body adm-popup-body-position-bottom" style="transform: translate(0,0%)"
                :hidden="cancelHidden">

            <view class="headers">
              供应商
              <view class="right" @click="cancel">
                <uni-icons type="closeempty"></uni-icons>
              </view>
            </view>
            <view style="padding: 12px">
              <view class="supplyCard card">
                <view class="supplyHeader header_3">
                  <view class="titles">沧州力久机械制造有限公司</view>
                </view>
                <view class="supplyContent content">
                  <view class="adm-space adm-space-wrap amd-space-horizontal">
                    <view class="adm-space-item">
                      <view class="brands">无品牌</view>
                    </view>
                  </view>
                </view>
              </view>
              <view class="supplyCard card">
                <view class="supplyHeader header_3">
                  <view class="titles">成都信华光电技术有限公司</view>
                </view>
                <view class="supplyContent content">
                  <view class="adm-space adm-space-wrap amd-space-horizontal">
                    <view class="adm-space-item">
                      <view class="brands">浑河库存</view>
                    </view>
                    <view class="adm-space-item">
                      <view class="brands">丹东汉克</view>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>


import UniIcons from "@/uni_modules/uni-icons/components/uni-icons/uni-icons.vue";
import "@/static/iconfont/iconfont.css"

export default {
  name: "index.vue",
  components: {UniIcons},
  data() {
    return {
      srcs: [
        'https://gpkx.oss-cn-beijing.aliyuncs.com/upload/jpeg/20230217/20230217278175.jpeg?Expires=1678345061&OSSAccessKeyId=LTAIypr5IqQ1tvpM&Signature=%2BSm42IYUEASV5Vm%2F7N5oj2FLk4s%3D',
        'https://gpkx.oss-cn-beijing.aliyuncs.com/upload/jpeg/20230217/20230217754752.jpeg?Expires=1678510284&OSSAccessKeyId=LTAIypr5IqQ1tvpM&Signature=SLMhj9DKJkpPtrhHkIXtc%2FllqL4%3D',
        'https://gpkx.oss-cn-beijing.aliyuncs.com/upload/png/20230217/20230217261905.png?Expires=1678505096&OSSAccessKeyId=LTAIypr5IqQ1tvpM&Signature=BAOzIRKgVkPAl2K3Q5uZZy8kywY%3D'
      ],
      erweima:
          'data:image/png;base64,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'
      ,
      customIndicator: 1,
      spuName: '数控车床',
      skuName: 't5 /0213',
      bindPosition: '铸件一区 / 南坡大坝',
      hidden: true,
      type: 'bottom',
      cancelHidden: true,
      maskHidden: true,
      imgHidden: true,
      centerHidden: true
    }
  },
  computed: {
    total() {
      return this.srcs.length;
    }
  },
  methods: {
    show() {
      this.hidden = !this.hidden;
    },
    more() {
      this.cancelHidden = false
      this.maskHidden = false
    },
    cancel() {
      this.cancelHidden = true
      this.maskHidden = true
    },
    img() {
      uni.previewImage({
        urls: [
          'https://gpkx.oss-cn-beijing.aliyuncs.com/upload/jpeg/20230217/20230217278175.jpeg?Expires=1678345061&OSSAccessKeyId=LTAIypr5IqQ1tvpM&Signature=%2BSm42IYUEASV5Vm%2F7N5oj2FLk4s%3D',
          'https://gpkx.oss-cn-beijing.aliyuncs.com/upload/jpeg/20230217/20230217754752.jpeg?Expires=1678510284&OSSAccessKeyId=LTAIypr5IqQ1tvpM&Signature=SLMhj9DKJkpPtrhHkIXtc%2FllqL4%3D',
          'https://gpkx.oss-cn-beijing.aliyuncs.com/upload/png/20230217/20230217261905.png?Expires=1678505096&OSSAccessKeyId=LTAIypr5IqQ1tvpM&Signature=BAOzIRKgVkPAl2K3Q5uZZy8kywY%3D'
        ]
      })
    },
    change(event) {
      const {current} = event.detail;
      this.customIndicator = current + 1;
    },
    center() {
      this.centerHidden = false
    },
    cencel() {
      this.centerHidden = true
    }
  }

}
</script>

<style lang="scss">

body {
  margin: 0;
  line-height: initial;
  --body--background--color: #E1EBF6
}

*, *::before, *::after {
  box-sizing: border-box;
}

.safeArea {
  height: 100%;
  overflow: auto;
}

.skuDetail {
  height: 100%;
  overflow: auto;
  background: var(--body--background--color);
}


.adm-swiper-track {
  width: 100%;
  height: 100%;
  white-space: nowrap;
  padding: var(--track-padding);
}

.adm-swiper .adm-swiper-track {
  transform: translateX(var(--track-offset));
}

.adm-swiper-horizontal .adm-swiper-track-allow-touch-move {
  touch-action: pan-y;
}

.adm-swiper-track-allow-touch-move {
  cursor: grab;
}

.adm-swiper-horizontal .adm-swiper-track-inner {
  flex-direction: row;
  width: var(--slide-size);
}

.adm-swiper-track-inner {
  width: 100%;
  height: 100%;
  overflow: visible;
  position: relative;
  display: flex;
  flex-wrap: nowrap;
}

.adm-swiper-slide {
  width: 100%;
  height: 100%;
  display: block;
  position: relative;
  white-space: unset;
  flex: none;
}

.adm-swiper-item {
  display: block;
  width: 100%;
  height: 100%;
  white-space: normal;
}

.imgS {
  width: 100%;
  height: 400px;
}

.uni-margin-wrap {
  width: 100%;
  height: 100%;
}

swiper {
  width: 100%;
  height: 100%;
}

image {
  width: 100%;
  height: 100%;
}

.edit {
  position: absolute;
  top: 12px;
  right: 12px;
  border-radius: 50px;
  background: rgba(0, 0, 0, 0.5);
  height: 24px;
  text-align: center;
  line-height: 24px;
  width: 24px;
  color: #FFFFFF;
}

.anticon[tabindex] {
  cursor: pointer;
}

.anticon {
  display: inline-block;
  color: inherit;
  font-style: normal;
  line-height: 0;
  text-align: center;
  text-transform: none;
  vertical-align: -0.125em;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
}

.anticon > * {
  line-height: 1;
}

.customIndicator {
  position: absolute;
  bottom: 12px;
  right: 12px;
  border-radius: 50px;
  font-size: 12px;
  background: rgba(0, 0, 0, 0.5);
  padding: 4px 8px;
  color: #FFFFFF;
  user-select: none;
}

.header {
  margin: 8px;
  padding: 0 12px;
  background-color: #FFFFFF;
  border-radius: 6px;
}

.sku {
  padding-top: 12px;
  align-items: stretch;
}

.flexCenter {
  display: flex;
  align-items: center;
}

.spuName {
  font-weight: bold;
  font-size: 20px;
}

.skuName {
  font-size: 14px;
  padding-top: 8px;
}

.bindPosition {
  font-size: 14px;
  padding-top: 8px;
}

.actions {
  font-size: 12px;
  padding: 8px 0 12px 0;
  border-top: 1px solid #F5F5F5;
  margin-top: 12px;
}

.uniui-list {
  margin-right: 4px;
  font-size: 12px !important;
  color: #257BDE !important;
}

.uniui-flag {
  margin-right: 4px;
  font-size: 12px !important;
  color: #257BDE !important;
}

.uniui-info {
  margin-right: 4px;
  font-size: 12px !important;
  color: #257BDE !important;
}

.uniui-icon-erweima {
  color: #2680eb !important;
  font-size: 20px !important;
}

.action {
  font-size: 12px;
  color: #3D3D3D;
  text-align: center;
}

.flexGrow {
  flex-grow: 1;
}

.otherData {
  width: 82.05px;
  height: 71px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
}

.number {
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
}

.skuData {
  margin: 0 8px;
  padding: 12px;
  background-color: #FFFFFF;
  border-radius: 6px;
}

.adm-space-vertical {
  flex-direction: column;
}

.adm-space {
  display: inline-flex;
  --gap: 8px;
  --gap-vertical: var(--gap);
  --gap-horizontai: var(--gap);
}

.adm-space-vertical > .adm-space-item {
  margin-bottom: var(--gap-vertical);
}

.adm-space-item {
  flex: none;
}

.value {
  flex-grow: 1;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font-size: 14px;
}

.lable {
  min-width: 80px;
  width: 80px;
  color: #9A9A9A;
  margin-right: 12px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font-size: 14px;
}

.lables {
  text-align: justify;
  text-align-last: justify;
  display: inline-block;
  color: #9d9d9d;
}

.adm-divider-horizontal {
  display: flex;
  align-items: center;
  margin: 16px 0;
  border-width: 0;
  border-style: solid;
  font-size: 14px;
}

.content {
  flex: none;
  padding: 0 16px;
}

.adm-divider-horizontal::before, .adm-divider-horizontal::after {
  flex: auto;
  display: block;
  content: '';
  border-style: inherit;
  border-color: inherit;
  border-width: 1px 0 0;
}

.supply {
  margin: 8px;
  padding: 12px;
  background-color: #FFFFFF;
  border-radius: 6px;
}

.title {
  font-weight: bold;
  padding-bottom: 8px;
  font-size: 13px;
}

.extra {
  float: right;
}

.submit {
  padding-bottom: 8px;
  color: #2680eb;
}

.supplyItem {
  margin: 8px 0;
  font-size: 14px;
}

.adm-popup-body {
  max-width: 640px;
  left: 0;
  right: 0;
  margin: auto;
}

.adm-popup-body-position-bottom {
  width: 100%;
  bottom: 0;
  left: 0;
}

.adm-popup-body {
  position: fixed;
  background-color: #FFFFFF;
  z-index: calc(var(--z-index) + 10)
}

.headers {
  height: 45px;
  line-height: 45px;
  text-align: center;
  font-size: 18px;
  border-bottom: 1px solid #EEEEEE;
  position: relative;
}

.right {
  top: 0;
  position: absolute;
  right: 0;
  padding: 0 12px;
}

.supplyCard {
  padding: 0;
  margin-bottom: 8px;
  border: 1px solid #E1EBF6;
}

.supplyHeader {
  background-color: #E1EBF6;
  padding: 8px 12px;
}

.titles {
  flex-grow: 1;
}

.supplyContent {
  background-color: #FFFFFF;
  padding: 8px;
}

.amd-space-horizontal.adm-space-wrap {
  flex-wrap: wrap;
  margin-bottom: calc(var(--gap-vertical) * -1);
}

.amd-space-horizontal {
  flex-direction: row;
}

.amd-space-horizontal.adm-space-wrap > .adm-space-item {
  padding-bottom: var(--gap-vertical);
}

.amd-space-horizontal > .adm-space-item:last-child {
  margin-right: 0;
}

.amd-space-horizontal > .adm-space-item {
  margin-right: var(--gap-horizontai);
}

.brands {
  padding: 4px 8px;
  background-color: #EEEEEE;
}

.adm-mask {
  --z-index: 1003;
}

.adm-mask {
  max-width: 640px;
  left: 0;
  right: 0;
  margin: auto;
}

.adm-mask {
  --z-index: var(--adm-masl-z-index, 1000);
  position: fixed;
  top: 0;
  left: 0;
  z-index: var(--z-index);
  display: block;
  width: 100%;
  height: 100%;
}

.adm-mask-aria-button {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.amd-mask-content {
  width: 100%;
  height: 100%;
  z-index: 1;
}

.adm-image-viewer-content {
  width: 100vw;
  height: 100vh;
  user-select: none;
}

.adm-image-viewer-slides {
  height: 100%;
  position: relative;
  z-index: 1;
  cursor: grab;
  touch-action: none;
}

.adm-image-viewer-indicator {
  position: absolute;
  z-index: 2;
  left: 50%;
  top: 12px;
  transform: translateX(-50%);
  color: #E6E6E6;
  font-size: 14px;
}

.adm-image-viewer-slides-inner {
  height: 100%;
  white-space: nowrap;
}

.adm-image-viewer-slide {
  position: relative;
  width: 100%;
  height: 100%;
  display: inline-block;
}

.adm-image-viewer-slides-inner > * {
  margin-right: 16px;
}

.adm-image-viewer-control {
  position: relative;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  cursor: grab;
  touch-action: none;
}

.adm-image-viewer-image-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.adm-image-viewer-image-wrapper image {
  display: block;
  max-width: 100%;
  max-height: 100%;
}

image {
  vertical-align: middle;
  border-style: none;
}

.span {
  font-size: 24px;
  color: #FA8F2B;
  text-align: left;
  margin-right: 8px;
  position: absolute;
  left: 0;
  bottom: 0;
}

.unit {
  color: #333333;
  font-size: 14px;
  position: absolute;
  right: 0;
  bottom: 2px;
}

.adm-dialog {
  --z-index: 1004;
}

.adm-dialog {
  ---z-index: var(--z-index);
}


.adm-center-popup .adm-center-popup-mask {
  z-index: 0;
}

.adm-center-popup-wrap {
  position: fixed;
  z-index: 1;
  top: 50%;
  left: 50%;
  width: auto;
  min-width: 280px;
  max-width: 75vw;
  transform: translate(-50%, -50%);
  background-color: #FFFFFF;
  border-radius: 8px;
}

.codeDialog .adm-dialog-body {
  padding-top: 12px;
}

.adm-dialog-body:not(.adm-dialog-with-image) {
  padding-top: 20px;
}

.adm-dialog-body {
  width: 100%;
  max-height: 70vh;
  font-size: 14px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.adm-center-popup-body {
  background-color: var(--background-color);
  border-radius: var(--border-radius);
}


.adm-dialog-body > .adm-dialog-content {
  flex: none;
}

.adm-dialog-content {
  padding: 0 12px 20px;
  max-height: 70vh;
  overflow-x: hidden;
  overflow-y: auto;
  font-size: 15px;
  line-height: 1.4;
  color: #333333;
}

.codeTitle {
  font-size: 18px;
  color: #000000;
  border-bottom: 1px solid #EEEEEE;
  padding-bottom: 12px;
}

.adm-dialog-action-row {
  display: flex;
  align-items: stretch;
  border-top: 0.5px solid #eeeeee;
}

.adm-dialog-action-row > .button {
  padding: 10px;
  font-size: 18px;
  line-height: 25px;
  border-radius: 0;
  border-right: 0.5px solid #EEEEEE;
  width: 139px;
  text-align: center;
  color: #2680EB;
}

</style>