<template>
  <view style="padding: 12px">
    <view class="supplyCard" v-for="supply in supplys" :key="supply.customerId">
      <view class="supplyHeader">
        <view class="titles">{{ isObject(supply.customerResult).customerName }}</view>
      </view>
      <view class="supplyContent content">
        <view class="space" v-for="brandName in isArray(supply.brandNames)" :key="brandName.brandId">
          <view class="space_item">
            <view class="brands">{{ brandName || '无品牌' }}</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import {isArray, isObject} from "../../../../../util/Tools";

export default {
  name: "supplyCard",
  props: ['supplys'],
  data() {
    return {
      isObject,
      isArray
    }
  }
}
</script>

<style lang="scss">

.supplyCard {
  padding: 0;
  margin-bottom: 8px;
  border: 1px solid #E1EBF6;
  font-size: 14px;

  .supplyHeader {
    background-color: #E1EBF6;
    padding: 8px 12px;
  }

  .supplyContent {
    background-color: #FFFFFF;
    padding: 8px;

    .space {
      flex-wrap: wrap;
      margin-bottom: -8px;
      display: inline-flex;
    }

    .brands {
      padding: 4px 8px;
      background-color: #EEEEEE;
    }
  }
}

.space > .space_item {
  margin-right: 8px;
  padding-bottom: 8px;
}

</style>
