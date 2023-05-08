<template>
  <view>
    <Loading :skeleton="true" v-if="loading" />
    <view class="supply" v-else-if="supplys.length > 0">
      <view class="title">
        供应商{{ supplys.length > 1 ? `(${supplys.length})` : '' }}
        <LinkButton style="padding-bottom: 8px;float: right;" color="#2680eb" @click="more">
          查看更多
          <uni-icons type="right" color="#2680eb"></uni-icons>
        </LinkButton>
      </view>
      <view class="flexCenter supplyItem" v-for="(supply,index) in supplys" :key="supply.customerId" v-if="index < 2">
        <view class="flexGrow">{{ isObject(supply.customerResult).customerName }}</view>
      </view>

      <Popup :show="show" position="bottom" @close="custom" close-on-click-overlay="true" title="供应商">
        <SupplyCard :supplys="supplys" />
      </Popup>
    </view>
  </view>
</template>

<script>
import LinkButton from "@/components/LinkButton/index";
import Popup from "@/components/Popup/index";
import Card from "@/components/Card/index";
import SupplyCard from "@/Sku/components/Supply/components/SupplyCard/index";
import {Sku} from "MES-Apis/lib/Sku/promise";
import Loading from "../../../components/Loading";
import {isArray, isObject} from "../../../util/Tools";

export default {
  name: "supply",
  components: {Loading, SupplyCard, Card, Popup, LinkButton},
  props: ['skuId'],
  data() {
    return {
      loading: false,
      supplys: [],
      show: false,
      isObject
    }
  },
  watch: {
    show(show) {
      this.$store.commit('dialog/openChange', show)
    }
  },
  mounted() {
    this.getSupplyList()
  },
  methods: {
    getSupplyList() {
      this.loading = true
      Sku.supplyList({data: {skuId: this.skuId}}).then((res) => {
        const newData = [];
        isArray(res.data).forEach(item => {
          const customerIds = newData.map(item => item.customerId);
          const customerIndex = customerIds.indexOf(item.customerId);
          const brandResult = item.brandResult || {};
          if (customerIndex === -1) {
            newData.push({...item, brandNames: [brandResult.brandName]});
          } else {
            const customer = newData[customerIndex];
            newData[customerIndex] = {...customer, brandNames: [...customer.brandNames, brandResult.brandName]};
          }
        });
        this.supplys = newData
      }).finally(() => {
        this.loading = false
      })
    },
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
