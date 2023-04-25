<template>
  <view class="actions">
    <view v-if="loading">
      <Loading :skeleton="true" skeleton-type="page" />
    </view>
    <view v-else>
      <u-tabs :list="tabs" @click="change" :scrollable="false"></u-tabs>
      <BatchPrepare
          v-if="tabKey === 0"
          ref='batchPrepareRef'
          :detail='detail'
          :taskId='query.taskId'
          :action="query.action === 'true'"
          :pickListsId='query.pickListsId'
          :theme='query.theme'
      />
      <OnePrepare
          v-if="tabKey === 1"
          ref='onePrepareRef'
          @closePrepare="prepare=false"
          @openPrepare="prepare=true"
          :positionIds='detail.positionIds'
          :taskId='query.taskId'
          :action="query.action === 'true'"
          :pickListsId='query.pickListsId'
          :theme='query.theme'
      />

      <OutStockShop
          ref="outStockShopRef"
          v-if="query.action === 'true' && !prepare"
          :taskId='query.taskId'
          :outType='query.source'
          :pickListsId='query.pickListsId'
          @refresh="(resh)=>refresh(resh)"
          @confirm="()=>confirm()"
      />
    </view>
  </view>
</template>

<script>
import BatchPrepare from './components/BatchPrepare'
import OnePrepare from './components/OnePrepare'
import {getLocalParmas} from "../../../util/Tools";
import {OutStock} from "MES-Apis/lib/OutStock/promise";
import Loading from "../../../components/Loading";
import OutStockShop from "../components/OutStockShop";

export default {
  components: {OutStockShop, Loading, BatchPrepare, OnePrepare},
  data() {
    return {
      query: {},
      detail: {},
      shopRef: 'shopRef',
      loading: true,
      tabKey: 0,
      prepare: false,
      tabs: [{
        name: '一键备料',
      }, {
        name: '单独备料',
      }],
    }
  },
  mounted() {
    this.query = getLocalParmas().search
    this.getDetail()
  },
  methods: {
    confirm() {
      const current = this
      this.$emit('outStock')
      uni.navigateTo({
        url: '/Erp/OutStock/OutStockConfirm/index',
        events: {
          // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
          outStock: function () {
            // current.$emit('outStock')
            current.$refs.outStockShopRef.refresh()
            current.$refs.batchPrepareRef?.refresh();
            current.$refs.onePrepareRef?.outStockAfter();
          },
        },
      })
    },
    change({index}) {
      this.tabKey = index
    },
    refresh(refresh) {
      this.$refs.batchPrepareRef?.refresh();
      this.$refs.onePrepareRef?.refresh(refresh);
    },
    async getDetail() {
      this.loading = true
      const res = await OutStock.outStockDetail({pickListsId: getLocalParmas().search.pickListsId}).finally(() => {
        this.loading = false
      })
      this.detail = res.data || {}
    }
  }
}
</script>

<style>
.actions {
  height: 100vh;
  background: #fff;
}
</style>
