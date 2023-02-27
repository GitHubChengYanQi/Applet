<template>
  <view class="audit">
    <view class="search">
      <Search
          :value="searchValue"
          placeholder='请输入单据相关信息'
          @onChange="(value)=>searchValue = value"
          @onSearch="onSearch"
      />
    </view>
    <view>
      <ProcessList
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
      searchValue: ''
    }
  },
  methods: {
    onSearch(value) {
      this.$refs.listRef.submit({skuName: value})
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
