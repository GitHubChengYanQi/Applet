<template>
  <view>
    <van-toast id="van-toast" />
    <van-dialog id="van-dialog" />
    <view v-if="loading">
      <Loading :skeleton="true" />
    </view>
    <van-tabs :active="1" v-else color="#007aff" border line-width="30%">
      <van-tab title="一键备料" >
        <BatchPrepare
            :shopRef='shopRef'
            :ref='batchPrepareRef'
            :detail='detail'
            :taskId='query.taskId'
            :action="query.action === 'true'"
            :pickListsId='query.pickListsId'
            :theme='query.theme'
        />
      </van-tab>
      <van-tab title="单独备料">
        <OnePrepare
            :shopRef='shopRef'
            :ref='onePrepareRef'
            :positionIds='detail.positionIds'
            :taskId='query.taskId'
            :action="query.action === 'true'"
            :pickListsId='query.pickListsId'
            :theme='query.theme'
        />
      </van-tab>
    </van-tabs>
  </view>
</template>

<script>
import BatchPrepare from './components/BatchPrepare'
import OnePrepare from './components/OnePrepare'
import {getLocalParmas} from "../../../../util/Tools";
import {OutStock} from "MES-Apis/src/OutStock/promise";
import Loading from "../../../../components/Loading";

export default {
  components: {Loading, BatchPrepare, OnePrepare},
  data() {
    return {
      query: {},
      detail: {},
      batchPrepareRef: null,
      onePrepareRef: null,
      shopRef: null,
      loading: false,
    }
  },
  mounted() {
    this.query = getLocalParmas().search
    this.getDetail()
  },
  methods: {
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
