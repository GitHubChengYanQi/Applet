<template>
  <view style="background-color: #fff">
    <Search
        @onChange='(value)=>searchValue = value'
        :value='searchValue'
        @onSearch='getList'
    />
    <Loading v-if="loading" :skeleton="true" />
    <Empty v-else-if="list.length === 0" description='暂无出库记录' />
    <view v-else>
      <view
          v-for="(item,index) in list"
          :key='index'
      >
        <view class='skuItem'>
          <view class='sku'>
            <view class='item'>
              <SkuItem
                  :skuResult="item.skuResult"
                  extraWidth='90px'
                  :otherData="[item.brandResult && item.brandResult.brandName || '任意品牌']"
              />
            </view>
            <view class='errorData'>
              <ShopNumber show :value='item.number' />
            </view>
          </view>

          <view class='log'>
            <view class='data'>
              <view class='left'>库位：{{ item.storehousePositionsResult && item.storehousePositionsResult.name || '无' }}</view>
              <view>{{ item.user && item.user.name }} / {{ MyDate.Show(item.createTime) }}</view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import Search from "../../../components/Search";
import {OutStock} from "MES-Apis/lib/OutStock/promise";
import Empty from "../../../components/Empty";
import Loading from "../../../components/Loading";
import ShopNumber from "../../../components/ShopNumber";
import {MyDate} from "../../../util/Tools";
import SkuItem from "../../../components/SkuItem";

export default {
  name: 'OutStockLog',
  props: ['outstockOrderId'],
  components: {SkuItem, ShopNumber, Loading, Empty, Search},
  data() {
    return {
      searchValue: '',
      loading: false,
      list: [],
      MyDate
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList(skuName) {
      this.loading = true
      OutStock.outStockLog({
        sourceId: this.outstockOrderId,
        skuName
      }, {
        onSuccess: (res) => {
          this.list = res.data || []
        }
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss">
.skuItem {
  padding: 12px;
  background-color: #fff;
  margin-bottom: 8px;

  .sku {
    display: flex;
    align-items: center;

    .item {
      flex-grow: 1;
    }

    .errorData {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }

    .error {
      color: var(--adm-color-danger);
      margin-bottom: 16px;
    }
  }

  .log {
    margin-top: 8px;
    border-top: 1px solid #D8D8D8;

    .data {
      display: flex;
      align-items: center;
      padding: 8px;

      .left {
        flex-grow: 1;
      }
    }
  }
}
</style>
