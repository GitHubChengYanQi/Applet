<template>
  <view>
    <Loading :skeleton="true" v-if="loading" />
    <view
        v-else
        v-for="(skuItem, skuIndex) in list"
        :key="skuIndex"
    >
      <view class="uni-list4" @click="itemClick(skuItem)">
        <view class="uni-list6">
          <view class="check">
            <Check
                :disabled="itemData(skuItem).skuDisabled"
                :value="itemData(skuItem).skuChecked"
            />
          </view>
          <view class="skuItem">
            <SkuItem no-view :sku-result="itemData(skuItem).skuResult" />
          </view>
          <view class="uni-list5" v-if="itemData(skuItem).disabled">
            <view class="warn">无工艺</view>
          </view>
        </view>
      </view>
      <view
          v-for="(rowItem, rowIndex) in itemData(skuItem).details"
          class="detailItem"
          :key="rowIndex"
          @click="detailClick(rowItem, skuItem)"
      >
        <view class="check">
          <Check
              :disabled="detailItemData(rowItem, skuItem).detailDisabled"
              :value="detailItemData(rowItem, skuItem).checked"
          />
        </view>
        <view class="content2">
          <view class="information">
            <view class="title">订单号</view>
            <view class="substance">：{{ detailItemData(rowItem, skuItem).coding }}</view>
          </view>
          <view class="information">
            <view class="title">客户</view>
            <view class="substance">：{{ detailItemData(rowItem, skuItem).customerName }}</view>
          </view>
        </view>
        <view class="center">
          <view class="number">×{{ rowItem.purchaseNumber }}</view>
        </view>
      </view>
      <view class="space"></view>
    </view>
  </view>
</template>

<script>
import SkuItem from "../../../../components/SkuItem";
import {Production} from "MES-Apis/lib/Production/promise";
import Check from "../../../../components/Check";
import Loading from "../../../../components/Loading";

export default {
  name: 'ByPlan',
  components: {Loading, Check, SkuItem},
  props: ['checkedSkus'],
  data() {
    return {
      list: [],
      skuKeys: [],
      loading: false,
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      Production.preProductionByPlan({
        data: {}
      }).then((res) => {
        this.list = res.data || []
      }).finally(() => {
        this.loading = false
      })
    },
    itemData(skuItem) {
      const details = skuItem.children;
      const skuResult = skuItem.skuResult || {};
      const disabled = !skuResult.processResult;
      const skuChecked = this.skuKeys.includes(skuItem.skuId);
      const skuDisabled = disabled;
      return {
        details,
        skuResult,
        disabled,
        skuChecked,
        skuDisabled
      }
    },
    detailItemData(rowItem, skuItem) {
      if (!rowItem) {
        return {}
      }
      const order = rowItem.orderResult || {};
      const checked = this.checkedSkus.map(item => item.detailId).includes(rowItem.detailId);
      const detailDisabled = this.itemData(skuItem).disabled;
      return {
        order,
        checked,
        detailDisabled,
        coding: order.coding,
        customerName: order.acustomer?.customerName
      }
    },
    itemClick(skuItem) {
      const item = this.itemData(skuItem)
      if (item.skuDisabled) {
        return;
      }
      if (!item.skuChecked) {
        this.skuKeys = [...this.skuKeys, skuItem.skuId]
        this.$emit('setCheckedSkus', [...this.checkedSkus, ...skuItem.children])
      } else {
        const array = this.skuKeys.filter((item) => {
          return item !== skuItem.skuId;
        });
        this.skuKeys = array
        const skus = this.checkedSkus.filter((item) => {
          return array.includes(item.skuId);
        });
        this.$emit('setCheckedSkus', skus)
      }
    },
    detailClick(rowItem, skuItem) {
      const detail = this.detailItemData(rowItem, skuItem)
      if (detail.detailDisabled) {
        return;
      }
      this.onChecked(!detail.checked, rowItem, skuItem);
    },
    onChecked(checked, rowItem, skuRecord) {
      if (checked) {
        const skuDetails = this.checkedSkus.filter((item) => {
          return item.skuId === rowItem.skuId;
        });
        if (skuDetails.length + 1 === skuRecord.children.length) {
          this.skuKeys = [...this.skuKeys, skuRecord.skuId]
        }
        this.$emit('setCheckedSkus', [...this.checkedSkus, rowItem])
      } else {
        const array = this.checkedSkus.filter((item) => {
          return item.detailId !== rowItem.detailId;
        });
        this.$emit('setCheckedSkus', array)
        this.skuKeys = this.skuKeys.filter((item) => {
          return item !== skuRecord.skuId;
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


.detailItem {
  display: flex;
  padding: 8px;
  margin-left: 12px;
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
