<template>
  <view class="audit">
    <u-tabs :list="tabs" @click="change" :scrollable="false"></u-tabs>
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
      tabs: [{
        name: '执行中',
        key: 7
      }, {
        name: '已完成',
        key: 5
      }, {
        name: '已撤销',
        key: 6
      }],
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
    change({key}) {
      this.searchData.status =key
      this.$refs.listRef.submit({...this.searchData, status: key})
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
