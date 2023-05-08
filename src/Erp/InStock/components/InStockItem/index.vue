<template>
  <view>
    <view class='sku' style="margin: 0">
      <view :style="{ alignItems: inStockItemData().complete && 'flex-start' }" class="skuItem inStockSkuItem">
        <view
            v-if="inStockItemData().complete"
            :class="['logo', inStockItemData().error ? 'errLogo' : 'infoLogo']"
            :style="{background: `url(${inStockItemData().error ? erp_error : erp_info})`}"
        >
          <span>{{ moment(detail ? item.createTime : item.updateTime).format('YYYY-MM-DD') }}</span>
        </view>
        <view class='item'>
          <SkuItem
              :imgId="`skuImg${index}`"
              :skuResult="item.skuResult"
              extraWidth='110px'
              :otherData="[item.brandResult && item.brandResult.brandName || '无品牌']"
          />
        </view>
        <view class='skuNumber'>
          <view :class="[inStockItemData().error ? 'error' : 'success']">
            {{ inStockItemData().text }}
          </view>
          <ShopNumber :value="inStockItemData().number" show textAlign='right' />
        </view>
      </view>

      <view v-if="!detail && !ask && !other" style="margin-bottom: 12px">
        <MyProgress
            :percent="parseInt((item.instockNumber / item.number) * 100)"
        />
      </view>
    </view>
    <view v-if="index !== dataLength" class='space' />
  </view>
</template>

<script>
import moment from "util/Common/moment";
import SkuItem from "../../../../components/SkuItem";
import ShopNumber from "../../../../components/ShopNumber";
import {erp_error} from "../../../../images/erp/error";
import {erp_info} from "../../../../images/erp/info";

export default {
  name: 'InStockItem',
  components: {ShopNumber, SkuItem},
  props: [
    'item',
    'dataLength',
    'index',
    'detail',
    'ask',
    'other',
  ],
  data() {
    return {
      erp_error,
      erp_info,
      moment
    }
  },
  methods: {
    inStockItemData() {

      let complete;
      let error = false;
      let text = '';
      let number = this.item.number;

      if (this.detail) {
        complete = true;
        switch (this.item.type) {
          case 'inStock':
            text = '已入';
            break;
          case 'ErrorCanInstock':
            text = '允许入库';
            error = true;
            break;
          case 'ErrorStopInstock':
            text = '终止入库';
            error = true;
            break;
          case 'ErrorNumber':
            text = '异常数量';
            error = true;
            break;
          default:
            break;
        }
      } else if (this.ask || this.other) {
        complete = this.item.realNumber === 0 && this.item.status !== 0;
        number = this.other ? this.item.number : this.item.realNumber;
        switch (this.item.status) {
          case 1:
            text = '待入';
            error = false;
            break;
          case -1:
            text = this.item.anomalyHandle === 'canInStock' ? '异常待入' : '异常';
            error = true;
            break;
          case 50:
            error = true;
            break;
          default:
            break;
        }

        if (complete) {
          text = '';
        }
      }

      return {
        complete,
        error,
        text,
        number,
      }
    }
  }
}
</script>

<style lang="scss">
.sku {
  position: relative;
  margin: 2px 0;
  overflow: hidden;
  border-bottom: none;

  .mask {
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    position: absolute;
    background: linear-gradient(to right, rgba(250, 250, 250, 0.8), rgba(210, 210, 210, 0.8));
  }

  .errLogo {
    color: $uni-color-error;
  }

  .infoLogo {
    color: $primary-color;
  }

  .logo {
    position: absolute;
    z-index: 1;
    right: -12px;
    bottom: -12px;
    height: 70px;
    width: 70px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: Impact, serif;
    background-repeat: no-repeat;
    background-position-y: 8px;
    transform: rotate(-45deg);

    span {
      font-size: 20px;
      transform: scale(0.5);
      min-width: 140px;
      display: block;
      text-align: center
    }
  }

  .outLogo {
    position: absolute;
    z-index: 1;
    right: 16vw;
    height: 100%;
    display: flex;
    align-items: center;

    img {
      width: 70px;
      height: 70px;
    }
  }
}

.skuItem {
  display: flex;
  align-items: center;
  padding: 12px;

  .inLibrary {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .item {
    flex-grow: 1;
  }

  .skuNumber {
    text-align: right;
    width: 80px;
    padding-right: 14px;

    .shopNumber {
      background-color: $body-color;
    }

    .error {
      color: $uni-color-error;
    }

    .success {
      color: $primary-color;
    }
  }

  .action {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    font-size: 14px;
    gap: 24px;
  }

  .number {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 8px;
  }

  .outStockNumber {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 12px;
  }
}

.inStockSkuItem {
  padding: 4px 0;
}

.space {
  height: 1px;
  background-color: $body-color;
}

</style>
