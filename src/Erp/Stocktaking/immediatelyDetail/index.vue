<template>
  <view class="white">
    <view class="content">
      <uni-icons custom-prefix="iconfont" type="icon-pandiankuwei1" size="20"></uni-icons>
      <view class="text">M1-1-1&nbsp;/&nbsp;南坡</view>
    </view>
    <view class="uni-list">
      <view class="headPortrait3">
        <image src="../../static/3.png" alt=""/>
        <view class="quantity">10件</view>
      </view>
      <view class="describe">
        <view>大孔过渡板</view>
        <view class="grey">t5-76041l / 大孔用</view>
      </view>
      <view class="function">
        <view class="actionStatus">
          <view class="status">•</view>
          <view class="status">进行中</view>
        </view>
        <view class="button">
          <u-button text="盘点" shape="circle" size="small" @click="onClick"></u-button>
        </view>
      </view>
    </view>
    <view class="submit">
      <u-button type="primary" text="提交" shape="circle" size="normal" :customStyle="{width:'100%'}"></u-button>
    </view>
    <u-popup :show="show" @close="close" closeable="true">
      <view class="title">盘点</view>
      <StockCheck></StockCheck>
    </u-popup>
  </view>
</template>

<script>
import StockCheck from '../components/stockCheck/index'

export default {
  components: {
    StockCheck
  },
  data() {
    return {
      show: false
    }
  },
  methods: {
    onClick() {
      this.show = true
    },
    close() {
      this.show = false
    }
  }
}
</script>

<style lang="scss" scoped>
.white {
  background-color: #fff;

  .content {
    padding: 12px;
    border-bottom: 1px solid #f5f5f5;
    display: flex;

    .text {
      font-size: 14px;
      padding-left: 8px;
      margin: auto 0;
    }
  }

  .uni-list {
    display: flex;
    padding: 8px 12px;
    border-bottom: 1px solid #e1ebf6;
    background-color: #fff;

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

    .describe {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      margin-left: 12px;
      justify-content: space-evenly;
      font-size: 14px;

      .grey {
        color: #808080;
      }
    }

    .addButton {
      margin: auto 12px;
    }

    .otherData {
      font-size: 12px;
      color: #3D3D3D;
    }

    .function {
      position: relative;

      .actionStatus {
        display: flex;
        color: rgba(102, 102, 102, 1);

        .status {
          margin-left: 8px;
          font-size: 12px;
        }
      }

      .button {
        position: absolute;
        bottom: 0;
        right: 0;
      }
    }
  }

  .submit {
    background-color: #fff;
    box-shadow: 0 -4px 10px 0 rgba(0, 0, 0, 0.1);
    padding: 12px;
    position: absolute;
    bottom: 0;
    left: 0;
    width: calc(100% - 24px);
  }

  .title {
    font-size: 18px;
    text-align: center;
    padding: 12px;
    border-bottom: 1px solid #EEEEEE;
  }
}
</style>
