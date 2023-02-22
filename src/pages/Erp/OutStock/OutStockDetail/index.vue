<template>
  <view>
    <Card title="来源" v-if="origin">
      <template v-slot:extra>
        <view class="state">
          {{ origin.title || '' }} / {{ origin.coding || '' }}
        </view>
      </template>
    </Card>
    <Card title="出库明细">
      <template v-slot:extra>
        <view class="state" @click="goToDetail">更多</view>
      </template>
    </Card>
    <Card title="主题" :extra="taskDetail.theme || '无'" />
    <Card title="领料负责人">
      <template v-slot:extra>
        <UserName :user='data.userResult' />
      </template>
    </Card>
    <Card title="出库类型" :extra="getOutType(data.type)" />
    <Card title="注意事项">
      {{
        isArray(data.announcementsResults).length === 0 ? '无' : isArray(data.announcementsResults).map(item => item.content).join('、')
      }}
    </Card>
    <Card title="备注">
      {{ data.note }}
    </Card>
    <Card title="附件">
      <view class="remarks">
        无
      </view>
    </Card>

    <ActionButtons
        v-if="actionNode"
        :taskDetail='taskDetail'
        :statusName='data.statusName'
        @afertShow="$emit('afertShow')"
        :taskId='taskId'
        :logIds='logIds'
        :createUser='taskDetail.createUser'
        :permissions="true"
        :actions="nodeActions"
        @onClick="onAction"
    />

    <Popup
        title='领料'
        @close='picking = false'
        :show="picking"
    >
      <MyPicking
          v-if="picking"
          :pickListsId='pickListsId'
          @onSuccess="openCode"
      />
    </Popup>

    <van-dialog
        use-slot
        :show="code"
        :show-confirm-button="false"
        @close="onClose"
        @cancel="onCancel"
        show-cancel-button
        cancel-button-text="关闭"
        cancel-button-color="#007aff"
        custom-class="codeDialog"
    >
      <view style='text-align: center;padding-top: 12px'>
        <view class='codeTitle'>领料码</view>
        <view style="position: relative;padding-top: 19px">
          <view class='code'>{{ code }}</view>
          <view class='time' v-if="code && !success">
            失效剩余时间：
            <Clock :seconds='600' />
          </view>
          <canvas id="qrcode" canvas-id="qrcode" style="width: 200px;height: 200px;display: inline-block"></canvas>
          <view v-if="success" class='getCodeSuccess'>
            <van-icon name="passed" size="64px" />
            领取成功！
          </view>
        </view>
      </view>
    </van-dialog>

    <!-- 出库记录 -->
    <scroll-view v-if="false">
      <view class="">
        <view class="outbound">
          <uni-search-bar
              v-model="searchVal"
              cancel-text="搜索"
              placeholder="请输入搜索内容"
              bgColor="#f1f1f1"
              clearButton="auto"
              cancelButton="auto">
          </uni-search-bar>
        </view>
        <view class="outbound">
          <view class="overview2">
            <view class="headPortrait3">
              <img src="/static/logo.png" alt="">
              <view class="quantity">306台</view>
            </view>
            <view class="describe">
              <view class="describe1">
                数控车床
              </view>
              <view class="describe2">
                t5&nbsp;/&nbsp;0213
              </view>
              <view class="describe3">
                无品牌
              </view>
            </view>
            <view class="number">
              ×6
            </view>
          </view>
          <view class="overview3">
            <view class="describe">
              库位：东3
            </view>
            <view class="describe4">
              程彦祺&nbsp;/&nbsp;01月31日 11:51
            </view>
          </view>
        </view>
        <view class="outbound">
          <view class="overview2">
            <view class="headPortrait3">
              <img src="/static/logo.png" alt="">
              <view class="quantity">306台</view>
            </view>
            <view class="describe">
              <view class="describe1">
                数控车床
              </view>
              <view class="describe2">
                t5&nbsp;/&nbsp;0213
              </view>
              <view class="describe3">
                无品牌
              </view>
            </view>
            <view class="number">
              ×6
            </view>
          </view>
          <view class="overview3">
            <view class="describe">
              库位：东3
            </view>
            <view class="describe4">
              程彦祺&nbsp;/&nbsp;01月31日 11:51
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
    <!-- 动态日志 -->
    <scroll-view v-if="false">
      <view class="overview4">
        <view class="headPortrait2">
          <img src="/static/logo.png" alt="">
        </view>
        <view>
          <view class="blueBold">
            程彦祺
          </view>
          <view class="describe">
            数控车床
          </view>
          <view class="time2">
            01月31日&nbsp;11:52
          </view>
        </view>
      </view>
      <view class="overview4">
        <view class="headPortrait2">
          <img src="/static/logo.png" alt="">
        </view>
        <view>
          <view class="blueBold">
            程彦祺
          </view>
          <view class="describe">
            数控车床
          </view>
          <view class="time2">
            01月31日&nbsp;11:52
          </view>
        </view>
      </view>
      <view class="overview4">
        <view class="baseline">
          ---我是有底线的---
        </view>
      </view>
    </scroll-view>
    <!-- 关联单据 -->
    <scroll-view v-if="false">
      <view class="overview5">
        <view class="headPortrait4">
          <img src="/static/logo.png" alt="">
        </view>
        <view class="bill">
          程彦祺发起的入库异常 / 230207001
        </view>
        <view class="bill1" @click="error">
          • 核实异常
          <uni-icons type="forward"></uni-icons>
        </view>
      </view>
    </scroll-view>

    <view class="space2"></view>
    <view class="goods-carts" v-if="false">
      <view class="points" @tap="again">
        <view>更多</view>
        <uni-icons type="more-filled" size="20" color="#2680eb"></uni-icons>
      </view>
      <view class="picking">
        领料
      </view>
    </view>

  </view>
</template>

<script>

import {isArray} from "../../../../util/Tools";
import UserName from '../../../../components/UserName/index'
import {getOutType} from "../outStock";
import Card from '../../../../components/Card/index'
import ActionButtons from "../../../Receipt/ReceiptDetail/components/ActionButtons";
import Popup from "../../../../components/Popup";
import MyPicking from "../components/MyPicking";
import Clock from "../../../../components/Clock";
import {OutStock} from "MES-Apis/src/OutStock/promise";
import UQRCode from 'uqrcodejs';

export default {
  props: [
    'actionNode',
    'taskDetail',
    'loading',
    'data',
    'permissions',
    'logIds',
    'taskId',
    'actions',
    'action',
    'pickListsId',
  ],
  components: {Clock, MyPicking, Popup, UserName, Card, ActionButtons},
  data() {
    return {
      origin: null,
      getOutType,
      isArray,
      nodeActions: [],
      picking: false,
      success: false,
      code: '',
      codeUrl: ''
    }
  },
  watch: {
    loading(loading) {
      if (!loading) {
        this.refreshData()
      }
    }
  },
  mounted() {
    this.refreshData()
    // this.goToDetail()
  },
  methods: {
    refreshData() {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      this.origin = isArray(this.taskDetail?.themeAndOrigin?.parent)[0]?.ret
      const userInfo = getApp().globalData.userInfo || {}
      this.nodeActions = isArray(this.actions).map(item => ({
        ...item,
        name: item.action === 'outStock' ? '领料' : item.name
      })).filter((item) => item.action === 'outStock' ? userInfo.id === this.data.userId : true)
    },
    goToDetail() {
      uni.redirectTo({
        url: `/pages/Erp/OutStock/OutStockAction/index?pickListsId=${this.data.pickListsId}&taskId=${this.taskId}&theme=${this.taskDetail.theme}&action=${(this.action || false) + ''}&source=${this.data.source}`,
      })
    },
    onAction(action) {
      switch (action) {
        case 'outStock':
          this.picking = true
          // setPicking(true);
          break;
        case 'revokeAndAsk':
          // OutStockRevoke(taskDetail);
          break;
        default:
          break;
      }
    },
    onClose() {
    },
    onCancel() {
      if (this.success) {
        this.$emit('refresh')
      }
      this.code = ''
    },
    openCode(res) {
      this.picking = false
      this.code = res
      this.success = false

      // 获取uQRCode实例
      var qr = new UQRCode();
      // 设置二维码内容
      qr.data = "https://uqrcode.cn/doc";
      // 设置二维码大小，必须与canvas设置的宽高一致
      qr.size = 200;
      // 调用制作二维码方法
      qr.make();
      // 获取canvas上下文
      // 如果是组件，this必须传入
      // 设置uQRCode实例的canvas上下文
      qr.canvasContext = uni.createCanvasContext('qrcode', this);
      // 调用绘制方法将二维码图案绘制到canvas上
      qr.drawCanvas();

      this.checkCode()
    },
    checkCode() {
      OutStock.checkCode(this.code, {
        onSuccess: (res) => {
          if (res.data === false) {
            this.success = true
          } else {
            setTimeout(() => {
              this.checkCode()
            }, 1000)
          }
        }
      })
    }
  }
}
</script>

<style lang="scss">

.space {
  height: 3px;
}

.overview {
  background-color: #fff;
  border-top: 1px solid #ccc;
  display: flex;
  padding: 12px;

  .overviewText {
    padding: 8px 10px 0 10px;
    flex-grow: 1;
  }

  .boldTitle {
    font-size: 14px;
    font-weight: bold;
  }

  .batch {
    font-size: 14px;
    padding-top: 8px;
  }

  .overviewInfo {
    text-align: right;
    padding: 8px 0;
  }
}

.overview2 {
  background-color: #fff;
  display: flex;
  padding: 12px 12px 8px 12px;
}

.overview3 {
  border-top: 1px solid #ccc;
  background-color: #fff;
  display: flex;
  padding: 4px 0 10px 0;
  margin: 0 12px 8px 12px;
}

.overview4 {
  background-color: #fff;
  display: flex;
  padding: 12px 12px 8px 12px;
  border-bottom: 1px solid #f5f5f5;

  .blueBold {
    font-size: 14px;
    font-weight: bold;
    padding: 0 0 8px 12px;
    color: #2680eb;
  }
}

.overview5 {
  background-color: #fff;
  display: flex;
  padding: 8px 12px;
}

.headPortrait {
  width: 55px;
  height: 55px;
  border-radius: 50%;
  overflow: hidden;
}

.headPortrait2 {
  width: 35px;
  height: 35px;
  border-radius: 5px;
  overflow: hidden;
}

.headPortrait3 {
  width: 72px;
  height: 72px;
  border-radius: 2px;
  overflow: hidden;
  position: relative;

  .quantity {
    height: 16px;
    width: 100%;
    font-size: 12px;
    text-align: center;
    color: #fff;
    position: absolute;
    bottom: 0;
    border-radius: 0 0 2px 2px;
    background-color: rgba(0, 0, 0, 0.4);
  }
}

.headPortrait4 {
  width: 20px;
  height: 20px;
  border-radius: 5px;
  overflow: hidden;
}

image {
  width: 100%;
  height: 100%;
}

.state {
  font-size: 14px;
  color: #2680eb;
}

.time {
  color: #808080;
  font-size: 14px;
  padding-top: 8px;
}

.time2 {
  font-size: 12px;
  color: #ACACAC;
  padding: 10px 0 5px 12px;
}

.tab {
  padding-top: 8px;
  display: flex;
  position: sticky;
  top: 0;
  z-index: 1;
}

.tabCheck {
  padding-bottom: 8px;
  color: #2680eb;
  margin: 0 auto;
  text-align: center;
  font-size: 14px;
  border-bottom: 2px solid #2680eb;
}

.tabCheck2 {
  padding-bottom: 8px;
  margin: auto;
  text-align: center;
  font-size: 14px;
}


.position {
  font-size: 12px;
  color: #b5b5b5;
}


.goods-carts {
  display: flex;
  box-shadow: 0 0 10px 2px #ccc;
  position: fixed;
  left: 0;
  right: 0;
  padding: 10px 12px;
  background-color: #fff;
  bottom: 0;
  z-index: 2;
}

.outbound {
  background-color: #fff;
  padding: 0 2px;
}

.details {
  display: flex;
}

.describe {
  flex: 1;
  padding: 4px 12px;
  font-size: 14px;
}

.describe2 {
  padding: 5px 0;
  color: #808080;
}

.describe3 {
  font-size: 12px;
}

.describe4 {
  padding: 4px 12px;
  font-size: 14px;
}

.number {
  font-size: 14px;
  margin: auto 10px;
  letter-spacing: 2px;
}

.bill {
  font-size: 14px;
  padding-left: 8px;
  flex: 1;
}

.bill1 {
  font-size: 14px;
}

.baseline {
  font-size: 14px;
  color: #ACACAC;
  margin: 15px auto;
}

.points {
  padding-right: 12px;
  font-size: 14px;
  color: #808080;
  text-align: center;
}

.picking {
  font-size: 14px;
  max-width: 640px;
  flex-grow: 1;
  background-color: #2680eb;
  border-radius: 50px;
  text-align: center;
  line-height: 40px;
  color: #fff;
}

.codeDialog {
  :global .adm-dialog-body {
    padding-top: 12px;
  }

  .codeTitle {
    font-size: 18px;
    color: #000000;
    border-bottom: solid 1px #EEEEEE;
    padding-bottom: 12px;
  }

  .time {
    padding: 10px 0;
    color: #888888;
  }

  .code {
    width: 184px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 26px;
    font-weight: bold;
    color: #257BDE;
    background: $body-color;
    margin: auto;
  }


  .getCodeSuccess {
    position: absolute;
    top: 0;
    display: flex;
    flex-direction: column;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    align-items: center;
    justify-content: center;
    color: #fff;

    svg {
      font-size: 64px;
    }
  }
}
</style>
