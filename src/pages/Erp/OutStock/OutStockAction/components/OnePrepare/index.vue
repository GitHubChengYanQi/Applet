<template>
  <view>
    <view v-if="loading">
      <Loading skeleton="" />
    </view>
    <view class="onePrepare" v-else>
      <view
          v-for="(item,index) in data"
          :key="index"
      >
        <OutStockItem
            :item="itemFormat(item)"
            :index='index'
            :dataLength='data.length - 1'
            :key={index}
            :received='item.received || 0'
            :collectable='item.collectable || 0'
            :notPrepared='item.notPrepared || 0'
            :success-percent="Number((((item.received || 0) / item.number)).toFixed(2)) * 100"
            :percent="Number((((item.collectable || 0) / item.number)).toFixed(2)) * 100"
        />
      </view>
    </view>
  </view>
</template>

<script>
import Search from "../../../../../../components/Search";
import {OutStock} from "MES-Apis/src/OutStock/promise";
import {outPickListFormatSort} from "../../index";
import {isArray, queryString} from "../../../../../../util/Tools";
import {Sku} from "MES-Apis/src/Sku/promise";
import OutStockItem from "../../../components/OutStockItem";
import {SkuResultSkuJsons} from "../../../../Sku/sku";
import Loading from "../../../../../../components/Loading";

export default {
  components: {Loading, OutStockItem, Search},
  props: [
    'action',
    'pickListsId',
    'taskId',
    'positionIds',
    'shopRef',
  ],
  data() {
    return {
      loading: false,
      showCount: 0,
      data: [],
      defaultData: [],
      hasMore: false,
      seacrchValue: ''
    }
  },
  mounted() {
    if (!this.pickListsId) {
      return
    }
    this.getDetailList()
  },
  methods: {
    async getDetailList(data) {
      this.loading = true
      const res = await OutStock.outStockDetailList({
        pickListsId: this.pickListsId,
        ...data
      }).finally(() => {
        this.loading = false
      })

      const {array} = outPickListFormatSort(isArray(res.data));
      this.showCount = 10
      const newData = array.filter(item => {
        return this.searchSkuName(this.seacrchValue, item);
      });
      this.data = newData
      this.defaultData = array
      this.getImgs(0, 20, array);
      this.hasMore = newData.length > 10
    },
    searchSkuName(value, item) {
      const itemSku = item.skuResult || {};
      const skuResult = {
        spuResult: {
          name: itemSku.spuName,
        },
        skuName: itemSku.skuName,
        specifications: itemSku.specifications,
        imgResults: item.imgUrl ? [{thumbUrl: item.imgUrl}] : [],
      };
      const sku = SkuResultSkuJsons({skuResult}) || '';
      return queryString(value, sku);
    },
    async getImgs(startIndex, count, skus) {
      const {newSkus} = await Sku.getSkuImgs({
        startIndex,
        count,
        skus,
        mediaIdKey: (item) => item.skuResult?.images?.split(',')[0],
      });
      this.data = newSkus
    },
    itemFormat(item) {
      const sku = item.skuResult || {};
      const skuResult = {
        spuResult: {
          name: sku.spuName,
        },
        skuName: sku.skuName,
        specifications: sku.specifications,
        imgResults: item.imgUrl ? [{thumbUrl: item.imgUrl}] : [],
      };
      return {...item, skuResult}
    }
  },
}
</script>

<style lang="scss">
.onePrepare {
  background-color: #fff;
  padding: 12px 0;
}
</style>
