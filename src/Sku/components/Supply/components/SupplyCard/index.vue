<template>
  <view style="padding: 12px">
    <view class="supplyCard" v-for="supply in supplyItem" :key="supply.supplyId">
      <view class="supplyHeader">
        <view class="titles">{{ supply.customerName }}</view>
      </view>
      <view class="supplyContent content">
        <view class="space" v-for="brandName in supply.supplyList" :key="brandName.brandId">
          <view class="space_item">
            <view class="brands">{{ brandName.brandName || '无品牌' }}</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "supplyCard",
  data() {
    return {
      supplyItem: [
        {
          supplyId: 1,
          customerName: '沈阳英德尔电子有限公司',
          supplyList: [
            {
              brandId: 1,
              brandName: '浑河库存'
            },
          ]
        },
        {
          supplyId: 2,
          customerName: '貊mo1986电线电缆批发（淘宝网店）',
          supplyList: [
            {
              brandId: 1,
            }
          ]
        },
        {
          supplyId: 3,
          customerName: '测试默认开户行',
          supplyList: [
            {
              brandId: 1,
              brandName: '测试默认开户行'
            },
            {
              brandId: 2,
              brandName: '浑河库存',
            },
            {
              brandId: 3,
              brandName: '道'
            },
            {
              brandId: 4,
              brandName: '超同步'
            }
          ]
        },
        {
          supplyId: 4,
          customerName: '成都信华光电技术有限公司',
          supplyList: [
            {
              brandId: 1,
              brandName: '成都信华'
            }
          ]
        }

      ]
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