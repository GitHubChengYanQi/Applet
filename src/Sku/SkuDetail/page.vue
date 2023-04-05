<template>
  <scroll-view style="height:100vh" :scroll-y="scroll">
    <Empty v-if="error" type="error" description="获取物料详情失败" />
    <Loading :skeleton="true" skeleton-type="page" v-else-if="loading" />
    <view v-else :style="{paddingBottom:`${safeAreaHeight}px`}">
      <view class="skuDetail">
        <view class="imgS">
          <view class="uni-margin-wrap">
            <swiper @change="change">
              <swiper-item v-for="(value,name) in skuDetail.imgResults" :key="name">
                <image
                    :src="value.url"
                    @click="img(value.url)"
                    mode="aspectFill"
                />
              </swiper-item>
            </swiper>
          </view>
          <view class="edit" @click="edit">
            <uni-icons type="compose" color="#ffffff" size="20"></uni-icons>
          </view>
          <view class="customIndicator">{{ customIndicator }}/{{ total }}</view>
        </view>
        <view class="header">
          <view class="flexCenter sku">
            <view class="flexGrow">
              <view class="standard">{{ skuDetail.standard || '无' }}</view>
              <view class="spuName">{{ skuDetail.spuName || '无' }}</view>
              <view class="skuName">{{ SkuResultSkuJsons({skuResult: skuDetail, sku: true}) }}</view>
              <view class="bindPosition" v-if="!!skuDetail.positionsName">
                <view>{{ skuDetail.positionsName || '' }} / {{ skuDetail.storehouseName || '' }}</view>
              </view>
            </view>
            <view @click="auto">
              <uni-icons size="24" custom-prefix="icon-font" type="icon-erweima" color="#2680EB"></uni-icons>
            </view>
            <van-dialog
                use-slot
                :show="showErWeiMa"
                confirm-button-text="确认"
                confirm-button-color="#2680EB"
                width="280px"
            >
              <view style='text-align: center;padding-top: 12px'>
                <view class='codeTitle'>物料码</view>
                <view class="dialogContent">
                  <view style="padding-top: 19px">
                    <canvas
                        id="firstCanvas"
                        canvas-id="firstCanvas"
                        style="width: 187px;height: 187px;display: inline-block"
                    />
                  </view>
                </view>
              </view>
            </van-dialog>
          </view>
          <view class="otherData">
            <view class="number">
              <view class="numberDes">库存数量({{ skuDetail.unit ? skuDetail.unit.unitName : '' }})</view>
              <view class="otherNumber">{{ skuDetail.stockNumber }}</view>
            </view>
            <view class="numberMonDes">-</view>
            <view class="number">
              <view class="numberDes">已备数量({{ skuDetail.unit ? skuDetail.unit.unitName : '' }})</view>
              <view class="otherNumber">{{ skuDetail.lockStockDetailNumber || 0 }}</view>
            </view>
            <view class="numberMonDes">=</view>
            <view class="number">
              <view class="numberDes">可用数量({{ skuDetail.unit ? skuDetail.unit.unitName : '' }})</view>
              <view class="span">{{ skuDetail.stockNumber - skuDetail.lockStockDetailNumber }}</view>
            </view>
          </view>
          <view class="actions flexCenter">
            <view class="action flexGrow">
              <view class="list" @click="showList">
                <uni-icons type="list" color="#2680EB" size="12"></uni-icons>
                库存明细
              </view>
            </view>
            <!--            <view class="action flexGrow">-->
            <!--              <view class="list">-->
            <!--                <uni-icons type="flag" color="#2680EB" size="12"></uni-icons>-->
            <!--                关联任务-->
            <!--              </view>-->
            <!--            </view>-->
            <view class="action flexGrow">
              <view class="list" @click="showRecord">
                <uni-icons type="info" color="#2680EB" size="12"></uni-icons>
                操作记录
              </view>
            </view>
          </view>
        </view>
        <view class="skuData">
          <view class="adm-space" style="width: 100%">
            <view
                class="adm-space-item"
                v-for="(item,index) in typeSettings"
                :key="item.key"
                v-if="index <= 3 || hidden"
            >
              <view class="flexCenter">
                <view class="lable lables">{{ item.filedName }}</view>
                <view class="value">{{ format(item.key) || '-' }}</view>
              </view>
            </view>
          </view>

          <view @click="many()">
            <van-divider dashed contentPosition="center" customStyle="margin:0">
              <uni-icons :type=" hidden===true ? 'top' : 'bottom' "></uni-icons>
            </van-divider>
          </view>

        </view>
      </view>

      <Supply :skuId="skuId" />

      <Popup :show="showSkuDetail" position="bottom" @close="overlay" close-on-click-overlay="true" title="库存明细">
        <InkindItem :skuId="skuId" v-if="showSkuDetail" />
      </Popup>

      <Popup
          :show="showOperationRecord"
          position="bottom"
          @close="operation"
          close-on-click-overlay="true"
          title="操作记录"
      >
        <SkuLog v-if="showOperationRecord" :skuId="skuId" />
      </Popup>
    </view>
  </scroll-view>
</template>

<script>

import Search from "@/components/Search";
import {Sku} from "MES-Apis/lib/Sku/promise";
import SkuLog from "@/Sku/components/SkuLog/index.vue";
import InkindItem from "@/Sku/components/InkindItem/index.vue";
import Supply from "@/Sku/components/Supply/index.vue";
import {SkuResultSkuJsons} from "../sku";
import UQRCode from "uqrcodejs";
import {request} from "MES-Apis/lib/Service/request";
import {getLocalParmas, isArray} from "../../util/Tools";
import Loading from "../../components/Loading";
import Empty from "../../components/Empty";
import Popup from "../../components/Popup";

export default {
  name: "SkuDetail",
  components: {Popup, Empty, Loading, Supply, InkindItem, SkuLog, Search},
  data() {
    return {
      skuDetail: {},
      typeSettings: {},
      customIndicator: 1,
      hidden: '',
      inkindItemHidden: false,
      show: false,
      showErWeiMa: false, //展示二维码
      showSkuDetail: false, //展示物料清单
      showOperationRecord: false, //展示操作记录
      showSkuErWeiMa: false, //展示物料详情二维码
      loading: true,
      error: false,
      skuId: '',
      safeAreaHeight: 0,
    }
  },
  mounted() {
    const safeAreaHeight = this.$store.state.systemInfo.systemInfo.safeAreaInsets.bottom
    this.safeAreaHeight = safeAreaHeight < 12 ? 12 : safeAreaHeight
    this.get();
  },
  computed: {
    scroll() {
      return !this.$store.state.dialog.show
    },
    total() {
      if (this.skuDetail.imgResults || '') {
        return this.skuDetail.imgResults.length
      }
      return 1
    }
  },
  watch: {
    showSkuDetail(show) {
      this.$store.commit('dialog/openChange', show)
    },
    showOperationRecord(show) {
      this.$store.commit('dialog/openChange', show)
    }
  },
  methods: {
    SkuResultSkuJsons,
    async get() {

      this.loading = true

      const skuId = getLocalParmas().search.skuId
      this.skuId = skuId
      const skuDetail = await Sku.detail(skuId).catch(() => {
        this.error = true
      });

      const data = skuDetail.data || {}
      const spuResult = data.spuResult || {}
      const positionsResult = data.positionsResult || []
      const spuClassificationResult = spuResult.spuClassificationResult || {}
      const response = await  Sku.skuFormLayout(spuClassificationResult.spuClassificationId).catch(() => {
        this.error = true
      })

      const typeSetting = JSON.parse(response?.data?.typeSetting || '[]') || []

      this.typeSettings = typeSetting.filter(item => !['images', 'drawing', 'fileId'].includes(item.key) && item.show)

      const publicInfo = this.$store.state.userInfo.publicInfo || {}

      this.skuDetail = {
        ...data,
        imgResults: isArray(data.imgResults).length > 0 ? data.images.split(',').map((item) => {
          return data.imgResults.find(img => img.mediaId === item)
        }) : [{url: publicInfo.imgLogo}],
        spuName: spuResult.name,
        positionsName: positionsResult[0] ? positionsResult[0].name : '',
        storehouseName: positionsResult[0] ? positionsResult[0].storehouseResult?.name : '',
      }
      this.loading = false
    },
    format(key) {

      const data = this.skuDetail || {}
      const spuResult = data.spuResult || {}
      const spuClassificationResult = spuResult.spuClassificationResult || {}
      const materialResult = data.materialResult || {}
      const unit = data.unit || {}

      switch (key) {
        case 'spuClass':
          return spuClassificationResult.name;
        case 'standard':
          return data.standard;
        case 'spu':
          return spuResult.name;
        case 'spuCoding':
          return spuResult.coding;
        case 'batch':
          return data.batch ? '一批一码' : '一物一码';
        case 'unitId':
          return unit.unitName;
        case 'weight':
          return `${data[key] || 0} kg`;
        case 'maintenancePeriod':
          return `${data[key] || 0} 天`;
        case 'sku':
          return SkuResultSkuJsons({
            skuResult: data,
            describe: true,
            emptyText: '无',
          });
        case 'materialId':
          return materialResult.name;
        case 'brandIds':
          return isArray(data.brandResults).map(item => item.brandName).join('、');
        case 'skuSize':
          return data.skuSize && data.skuSize.split(',').filter(item => parseInt(item)).join('×');
        default:
          return data[key];
      }
    },
    more() {
      this.show = true
    },
    showList() {
      this.showSkuDetail = true
    },
    showRecord() {
      this.showOperationRecord = true
    },
    cancel() {
      this.show = false
    },
    many() {
      this.hidden = !this.hidden
    },
    img(current) {
      const _this = this;
      const imgResults = _this.skuDetail.imgResults

      const urls = imgResults.map(item => {
        return item.url || item.thumbUrl
      })

      uni.previewImage({
        current,
        urls
      })
    },
    change(event) {
      const {current} = event.detail;
      this.customIndicator = current + 1;
    },
    auto() {
      const qr = new UQRCode;
      // 设置二维码内容
      qr.data = this.skuId;
      // 设置二维码大小，必须与canvas设置的宽高一致
      qr.size = 187;
      // 调用制作二维码方法
      qr.make();
      // 获取canvas上下文
      // 如果是组件，this必须传入
      // 设置uQRCode实例的canvas上下文
      qr.canvasContext = uni.createCanvasContext('firstCanvas', this);
      // 调用绘制方法将二维码图案绘制到canvas上
      qr.drawCanvas();
      this.showErWeiMa = !this.showErWeiMa;
    },
    showStoreList() {
      this.inkindItemHidden = !this.inkindItemHidden
    },
    overlay() {
      this.showSkuDetail = !this.showSkuDetail
    },
    custom() {
      this.show = !this.show
    },
    operation() {
      this.showOperationRecord = !this.showOperationRecord
    },
    edit() {
      const _this = this
      uni.navigateTo({
        url: `/Sku/SkuImgs/index?skuId=${this.skuId}`,
        events: {
          // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
          refresh: function () {
            _this.get()
          }
        },
        success: function (res) {
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('skuImgs', _this.skuDetail.imgResults)
        }
      })
    }
  }

}
</script>

<style lang="scss">
.skuDetail {
  height: 100%;
  overflow: auto;
  background-color: #E1EBF6;

  .customIndicator {
    position: absolute;
    bottom: 12px;
    right: 12px;
    border-radius: 50px;
    font-size: 12px;
    background-color: rgba(0, 0, 0, 0.5);
    padding: 4px 8px;
    color: #FFFFFF;
    user-select: none;
  }

  .edit {
    position: absolute;
    top: 12px;
    right: 12px;
    border-radius: 50px;
    background: rgba(0, 0, 0, 0.5);
    height: 30px;
    text-align: center;
    line-height: 30px;
    width: 30px;
    color: #FFFFFF;
    -moz-user-select: none;
    -ms-user-select: none;
  }

  .imgS {
    position: relative;
    width: 100vw;
    height: 100vw;
  }

  .uni-margin-wrap, swiper, image {
    width: 100%;
    height: 100%;
    border-bottom: 1px solid #fff;
  }

  .header {
    margin: 8px;
    padding: 0 12px;
    background-color: #FFFFFF;
    border-radius: 6px;

    .otherData {
      display: flex;
      padding-top: 8px;
      margin-top: 8px;
      justify-content: space-between;
      border-top: 1px solid #F5F5F5;

      .number {
        display: flex;
        align-items: flex-end;
        flex-direction: column;
        justify-content: space-between;

        .span {
          font-size: 24px;
          color: #FA8F2B;
        }

        .otherNumber {
          font-size: 24px;
          color: rgba(0, 0, 0, 0.5);
        }
      }
    }

    .sku {
      padding-top: 12px;
      align-items: stretch;

      .standard {
        font-weight: bold;
        font-size: 20px;
        color: #FA8F2B;
      }

      .spuName {
        font-weight: bold;
        font-size: 20px;
        margin: 8px 0;
      }
    }

    .skuName {
      font-size: 14px;
    }

    .bindPosition {
      font-size: 14px;
      padding-top: 8px;
      display: flex;
    }

    .actions {
      font-size: 12px;
      padding: 8px 0 12px 0;
      border-top: 1px solid #F5F5F5;
      margin-top: 12px;

      .action {
        font-size: 12px;
        color: #3D3D3D;
        text-align: center;
      }
    }
  }

  .skuData {
    margin: 0 8px;
    padding: 12px;
    background: #FFFFFF;
    border-radius: 6px;
    font-size: 14px;

    .lable {
      min-width: 80px;
      width: 80px;
      color: #9A9A9A;
      margin-right: 12px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }

    .value {
      flex-grow: 1;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }

  .supply {
    margin: 8px;
    padding: 12px;
    background: #FFFFFF;
    border-radius: 6px;

    .title {
      font-weight: bold;
      padding-bottom: 8px;
      font-size: 13px;
    }
  }
}

.flexCenter {
  display: flex;
  align-items: center;
  height: 100%;

  .flexGrow {
    flex-grow: 1;
  }
}

.list uni-icons {
  margin-right: 4px;
}

.adm-space > .adm-space-item {
  margin-bottom: 8px;
}

.show .adm-space-item {
  margin-bottom: 8px;
}

.adm-space-item {
  flex: none;
}

.codeTitle {
  font-size: 18px;
  color: #000000;
  border-bottom: solid 1px #EEEEEE;
  padding-bottom: 12px;
}

.dialogContent {
  padding: 0 12px 20px;
  max-height: 70vh;
  overflow-x: hidden;
  overflow-y: auto;
  font-size: 15px;
  line-height: 1.4;
  color: #333333;
}

.numberDes {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.5);
}

.numberMonDes {
  font-size: 16px;
  color: rgba(0, 0, 0, 0.5);
  margin-top: -3px;
}
</style>
