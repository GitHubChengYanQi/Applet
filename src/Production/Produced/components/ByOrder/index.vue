<template>
  <view>
    <Loading :skeleton="true" v-if="loading" />
    <view
        v-else
        v-for="(orderItem,index) in list"
        :key="index"
    >
      <view class="uni-list">
        <view class="uni-list2" @click="orderClick(orderItem)">
          <view class="uni-list3">
            <Check :disabled="itemData(orderItem).orderDisabled" :value="itemData(orderItem).orderChecked" />
            <view class="number">
              {{ orderItem.coding }} / {{ orderItem.acustomer && orderItem.acustomer.customerName }}
            </view>
          </view>
          <view class="time">{{ orderItem.createTime }}</view>
        </view>
        <view
            v-for="(rowItem, rowIndex) in itemData(orderItem).details"
            :key="rowIndex"
            class="uni-list4"
            @click="detailClick(rowItem,orderItem)"
        >
          <view class="check">
            <Check
                :disabled="detailItemData(rowItem,orderItem).detailDisabled"
                :value="detailItemData(rowItem,orderItem).checked"
            />
          </view>
          <view class="skuItem">
            <SkuItem
                noView
                extraWidth='120px'
                :skuResult="detailItemData(rowItem,orderItem).skuResult"
            />
          </view>

          <view class="uni-list5">
            <view class="warn">{{ !detailItemData(rowItem, orderItem).skuResult.processResult ? '无工艺' : '' }}</view>
            <view class="number">X{{ rowItem.purchaseNumber }}</view>
          </view>
        </view>
      </view>

      <view class="space"></view>
    </view>
  </view>
</template>

<script>
import {Production} from "MES-Apis/src/Production/promise";
import Check from "../../../../components/Check";
import SkuItem from "../../../../components/SkuItem";
import {isArray} from "../../../../util/Tools";
import Loading from "../../../../components/Loading";

export default {
  name: 'ByOrder',
  components: {Loading, SkuItem, Check},
  props: ['checkedSkus'],
  data() {
    return {
      list: [],
      orderKeys: [],
      loading: false
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      Production.preProductionByOrder({data: {}}).then((res) => {
        this.list = res.data || []
      }).finally(() => {
        this.loading = false
      })
    },
    itemData(orderItem) {
      const details = isArray(orderItem.detailResults).map(item => ({
        ...item,
        orderResult: {...orderItem, detailResults: undefined},
      }));
      const disabled = false;
      const orderChecked = this.orderKeys.includes(orderItem.orderId);
      const orderDisabled = details.filter(item => !(item.skuResult?.processResult)).length === details.length || disabled;
      return {
        details,
        disabled,
        orderChecked,
        orderDisabled,
      }
    },
    detailItemData(rowItem, orderItem) {
      const skuResult = rowItem.skuResult || {};
      const checked = isArray(this.checkedSkus).map(item => item.detailId).includes(rowItem.detailId);
      const detailDisabled = !skuResult.processResult || this.itemData(orderItem).disabled;
      return {
        skuResult,
        checked,
        detailDisabled
      }
    },
    orderClick(orderItem) {
      const order = this.itemData(orderItem)
      if (order.orderDisabled) {
        return;
      }
      if (!order.orderChecked) {
        this.orderKeys = [...this.orderKeys, orderItem.orderId]
        const newDetails = order.details.filter(item => item.skuResult?.processResult);
        this.$emit('setCheckedSkus', [...this.checkedSkus, ...newDetails])
      } else {
        const array = this.orderKeys.filter((item) => {
          return item !== orderItem.orderId;
        });
        this.orderKeys = array
        const skus = this.checkedSkus.filter((item) => {
          return array.includes(item.orderId);
        });
        this.$emit('setCheckedSkus', skus)
      }
    },
    detailClick(rowItem, orderItem) {
      const detail = this.detailItemData(rowItem, orderItem)
      if (detail.detailDisabled) {
        return;
      }
      this.onChecked(!detail.checked, rowItem, orderItem);
    },
    onChecked(checked, rowItem, orderItem) {
      if (checked) {
        const orderDetails = this.checkedSkus.filter((item) => {
          return item.orderId === rowItem.orderId;
        });
        const details = orderItem.detailResults && orderItem.detailResults.filter(item => item.skuResult && item.skuResult.processResult);
        if (orderDetails.length + 1 === details.length) {
          this.orderKeys = [...this.orderKeys, rowItem.orderId]
        }
        this.$emit('setCheckedSkus', [...this.checkedSkus, rowItem])
      } else {
        const array = this.checkedSkus.filter((item) => {
          return item.detailId !== rowItem.detailId;
        });
        this.$emit('setCheckedSkus', array)
        this.orderKeys = this.orderKeys.filter((item) => {
          return item !== rowItem.orderId;
        })
      }
    }

  }
}
</script>

<style lang="scss">
body {
  background-color: #e1ebf6;
}

image {
  width: 100%;
  height: 100%;
}

.space {
  height: 3px;
  background-color: #e1ebf6;
}

.tab {
  background-color: #fff;
  border-bottom: 1px solid #eeeeee;
}

.border {
  height: 1px;
  background-color: #e1ebf6;
}

.content {
  background-color: #fff;
}

.uni-list {
  padding: 5px 12px 0 12px;
}

.uni-list2 {
  display: flex;
  align-items: center;
  padding-bottom: 5px;
  border-bottom: 1px solid #e1ebf6;
}

.uni-list3 {
  display: flex;
  align-items: center;
  flex-grow: 1;
  padding: 4px 0;
}

.uni-list4 {
  display: flex;
  padding: 8px;
}

.uni-list5 {
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  gap: 8px;
}

.uni-list6 {
  display: flex;
  width: 100%;
  padding-bottom: 8px;
  border-bottom: 1px solid #e1ebf6;
}

.check {
  margin: auto 0;
}

.warn {
  color: #ff3141;
  font-size: 12px;
}

.number {
  font-size: 14px;
  padding: 2px 10px 0 0;
}

.time {
  font-size: 12px;
  color: #9d9d9d;
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

.button {
  width: 90%;
  margin: 0 auto;

}

.bottom {
  width: 100%;
  background-color: #fff;
  padding: 10px 0;
  position: absolute;
  bottom: 0;
}

.information {
  display: flex;
}

.title {
  width: 70px;
  color: #9d9d9d;
  font-size: 14px;
  padding: 1px 0;
  text-align-last: justify;
}

.content2 {
  flex-grow: 1;
}

.substance {
  font-size: 14px;
}

.skuItem {
  flex-grow: 1;
}

.center {
  text-align: center;
}
</style>
