<template>
  <view>
    <view :key='skuIndex' class='skus'>
      <view class='skuItem'>
        <view v-if="action">
          <van-checkbox
              :value="itemFormat().skuChecked" shape="square"
              @change="$emit('dataChange',skuItem.key, { checked: !itemFormat().skuChecked })"
          />
        </view>
        <view class='sku'>
          <SkuItem
              :skuResult="skuItem.skuResult"
              :extraWidth="extraWidth || '100px'"
              :otherData="[skuItem.brandResult ? skuItem.brandResult.brandName : '任意品牌']"
          />
        </view>
        <view class='skuData'>
          <van-stepper
              :max="itemFormat().collectable"
              :min="1"
              :value="skuItem.outNumber"
              @change="({detail:outNumber})=>$emit('dataChange',skuItem.key, { outNumber })"
          />
        </view>
      </view>
      <OutPerogress
          :collectable='itemFormat().collectable'
          :notPrepared='itemFormat().notPrepared'
          :received='itemFormat().received'
          :percent='itemFormat().percent'
          :successPercent='itemFormat().successPercent'
      />
    </view>
  </view>
</template>

<script>
import SkuItem from "../../../../Sku/components/SkuItem";
import OutPerogress from "../../OutProgress";

export default {
  name: 'OutItem',
  components: {OutPerogress, SkuItem},
  props: [
    'skuItem',
    'skuIndex',
    'action',
    'extraWidth',
  ],
  methods: {
    itemFormat() {
      const skuChecked = this.skuItem.checked;

      const received = Number(this.skuItem.receivedNumber) || 0;
      const collectable = Number(this.skuItem.collectable) || 0;
      const notPrepared = Number(this.skuItem.number - collectable - received) || 0;

      const successPercent = Number(((received / this.skuItem.number)).toFixed(2)) * 100;
      const percent = Number(((collectable / this.skuItem.number)).toFixed(2)) * 100;
      return {
        skuChecked,
        received,
        collectable,
        notPrepared,
        successPercent,
        percent,
      }
    }
  }
}
</script>

<style lang="scss">
.skus {
  border-bottom: 1px solid #F5F5F5;
  padding-bottom: 16px;

  .skuItem {
    display: flex;
    align-items: center;
    padding: 12px;

    .storeName {
      padding: 0 8px;
      font-size: 14px;
      font-weight: normal;
      color: #333333;
    }

    .sku {
      flex-grow: 1;
      padding: 0 8px;
    }

    .skuData {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    span {
      //margin: 0 8px;

      svg {
        font-size: 18px;
      }
    }
  }
}
</style>
