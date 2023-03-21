<template>
  <view class="supply">
    <view class="title">
      供应商{{ supplyItem.length > 1 ? `(${supplyItem.length})` : '' }}
      <LinkButton style="padding-bottom: 8px;float: right;" color="#2680eb" @click="more">
        查看更多
        <uni-icons type="right" color="#2680eb"></uni-icons>
      </LinkButton>
    </view>
    <view class="flexCenter supplyItem" v-for="(supply,index) in supplyItem" :key="supply.supplyId" v-if="index < 2">
      <view class="flexGrow">{{ supply.customerName }}</view>
    </view>

    <Popup :show="show" position="bottom" @close="custom" close-on-click-overlay="true" title="供应商">
      <SupplyCard></SupplyCard>
    </Popup>
  </view>
</template>

<script>
import LinkButton from "@/components/LinkButton/index.vue";
import Popup from "@/components/Popup/index.vue";
import Card from "@/components/Card/index.vue";
import SupplyCard from "@/Sku/components/Supply/components/SupplyCard/index.vue";

export default {
  name: "supply",
  components: {SupplyCard, Card, Popup, LinkButton},
  props: [],
  data() {
    return {
      supplyItem: [
        {
          supplyId: 1,
          customerName: '沈阳英德尔电子有限公司',
        },
        {
          supplyId: 2,
          customerName: '貊mo1986电线电缆批发（淘宝网店）',
        }, {
          supplyId: 3,
          customerName: '测试默认开户行',
        },
        {
          supplyId: 4,
          customerName: '成都信华光电技术有限公司',
        }
      ],
      show: false,
    }
  },
  methods: {
    more() {
      this.show = true
    },
    custom() {
      this.show = !this.show
    },
  }
}</script>

<style lang="scss">

.supply {
  margin: 8px;
  padding: 12px;
  background-color: #FFFFFF;
  border-radius: 6px;
  font-size: 14px;

  .title {
    font-weight: bold;
    padding-bottom: 8px;
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

.supplyItem {
  margin: 8px 0;
}

</style>