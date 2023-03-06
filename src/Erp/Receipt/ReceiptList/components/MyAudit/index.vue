<template>
  <view class="audit">
    <van-tabs color="#007aff" border line-width="30%" @change="change">
      <van-tab :name="7" title="执行中">
      </van-tab>
      <van-tab :name="5" title="已完成">
      </van-tab>
      <van-tab :name="6" title="已撤销">
      </van-tab>
    </van-tabs>
    <view class="search">
      <Search
          :value="searchData.skuName"
          placeholder='请输入单据相关信息'
          @onChange="(value)=>searchData.skuName = value"
          @onSearch="onSearch"
      />
    </view>
    <view>
      <ProcessList
          v-if="type"
          :type="type"
          ref="listRef"
          :noProgress="createUser"
      />
    </view>
  </view>
</template>

<script>
import Search from "../../../../../components/Search";
import ProcessList from "./components/ProcessList";

export default {
  name: 'MyAudit',
  components: {ProcessList, Search},
  props: [
    'skuName',
    'type',
    'noType',
    'createUser',
    'ReceiptDom',
    'taskSkuId',
    'extraIcon',
    'pickUserId',
    'task',
    'defaultScreen',
  ],
  data() {
    return {
      searchData: {
        skuName: '',
        status: 7
      }
    }
  },
  methods: {
    onSearch(value) {
      this.searchData.skuName = value
      this.$refs.listRef.submit(this.searchData)
    },
    change({detail}) {
      this.searchData.status = detail.name
      this.$refs.listRef.submit({...this.searchData, status: detail.name})
    }
  }
}
</script>

<style lang="scss">
.audit {
  background-color: #fff;

  .search {
    padding: 0 12px;
  }
}

</style>
