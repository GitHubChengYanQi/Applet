<template>
  <scroll-view style="height:100vh" :scroll-y="scroll">
    <van-toast id="van-toast" />
    <van-dialog id="van-dialog" />
    <view v-if="loading">
      <Loading :skeleton="true" />
    </view>
    <view v-else>
      <van-tabs color="#007aff" border line-width="30%" @change="change">
        <van-tab title="一键备料">
          <BatchPrepare
              v-if="tabKey === 0"
              ref='batchPrepareRef'
              :detail='detail'
              :taskId='query.taskId'
              :action="query.action === 'true'"
              :pickListsId='query.pickListsId'
              :theme='query.theme'
          />
        </van-tab>
        <van-tab title="单独备料">
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
        </van-tab>
      </van-tabs>

      <OutStockShop
          v-if="query.action === 'true' && !prepare"
          :taskId='query.taskId'
          :outType='query.source'
          :pickListsId='query.pickListsId'
          @refresh="(resh)=>refresh(resh)"
          @confirm="confirm"
      />
    </view>
  </scroll-view>
</template>

<script>
import BatchPrepare from './components/BatchPrepare'
import OnePrepare from './components/OnePrepare'
import {getLocalParmas} from "../../../util/Tools";
import {OutStock} from "MES-Apis/src/OutStock/promise";
import Loading from "../../../components/Loading";
import OutStockShop from "../components/OutStockShop";

export default {
  components: {OutStockShop, Loading, BatchPrepare, OnePrepare},
  data() {
    return {
      query: {},
      detail: {},
      shopRef: 'shopRef',
      loading: false,
      tabKey: 0,
      prepare: false,
    }
  },
  computed: {
    scroll() {
      return !this.$store.state.dialog.show
    }
  },
  mounted() {
    this.query = getLocalParmas().search
    this.getDetail()
  },
  methods: {
    confirm() {
      uni.navigateTo({
        url:'/Erp/OutStock/OutStockConfirm/index',
      })
    },
    change(tab) {
      this.tabKey = tab.detail ? tab.detail.index : tab.index
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

</style>
