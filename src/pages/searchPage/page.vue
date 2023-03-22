<template>
  <view class="body">
    <view class="search">
      <Search
          history
          :value="value"
          @onChange="onChange"
          placeholder="请输入搜索内容"
          @onSearch="search"
      />
    </view>

    <view v-if="searchLoading">
      <Loading :skeleton="true" />
    </view>
    <view v-else-if="value" class="historyList">
      <view
          v-for="(item,index) in historyList"
          :key="index"
          class="historyItem"
          @click="search(item.record)"
      >
        <u-icon name="search" size="24"></u-icon>
        <view style="height: 21px">
          <Elliptsis max-width="80vw" width="80vw"> {{ item.record }}</Elliptsis>
        </view>
      </view>
    </view>
    <view v-else class="chronicle">
      <view class="history">
        <view class="notes">历史记录</view>
        <view @click="delet">
          <uni-icons type="trash-filled" size="18" color="#ff3141"></uni-icons>
        </view>
      </view>
      <view v-if="loading">
        <Loading :skeleton="true" />
      </view>
      <view v-if="searchLogs.length === 0">
        <Empty description="暂无历史记录" />
      </view>
      <view class="content">
        <view
            v-for="(item,index) in searchLogs"
            class="searchItem"
            :key="index"
            @click="search(item.record)"
        >
          {{ item.record }}
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import Search from "../../components/Search";
import {SearchLog} from "MES-Apis/lib/SearchLog/promise";
import Loading from "../../components/Loading";
import Elliptsis from "../../components/Ellipsis";
import Empty from "../../components/Empty";
import {Message} from "../../components/Message";

export default {
  name: "SearchPage",
  props: ['formType', 'searchValue'],
  components: {Empty, Elliptsis, Loading, Search},
  data() {
    return {
      value: '',
      searchLogs: [],
      historyList: [],
      loading: false,
      searchLoading: false
    }
  },
  mounted() {
    this.getSearchLogs()
    this.onChange(this.searchValue)
  },
  methods: {
    getSearchLogs() {
      this.loading = true
      SearchLog.list({
        data: {
          formType: this.formType
        }
      }).then((res) => {
        this.searchLogs = res.data
      }).finally(() => {
        this.loading = false
      })
    },
    delet() {
      const _this = this
      Message.dialog({
        title: '确定要删除全部历史记录吗？',
        content: '注意：删除之后不可恢复！',
        only: false,
        onConfirm() {
          return new Promise((resolve) => {
            SearchLog.deleteBatch(_this.formType).then(() => {
              resolve(true)
              _this.getSearchLogs()
            }).catch(() => {
              resolve(false)
            })
          })
        }
      })
    },
    search(value) {
      SearchLog.add({value, formType: this.formType})
      uni.$emit(this.formType, {searchValue: value});
      uni.navigateBack();
    },
    onChange(value) {
      this.value = value
      if (value) {
        this.searchLoading = true
        SearchLog.list({
          data: {
            record: value,
            formType: this.formType
          }
        }).then((res) => {
          this.historyList = res.data
        }).finally(() => {
          this.searchLoading = false
        })
      }

    }
  }
}
</script>

<style lang="scss">
.body {
  background-color: #FFFFFF;
  height: 100vh;

  .chronicle {
    padding: 12px;
  }

  .search {
    padding: 0 12px;
  }

  .history {
    display: flex;
  }

  .notes {
    font-size: 14px;
    font-weight: bold;
    flex-grow: 1;
  }

  .content {
    padding: 12px;
    font-size: 12px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    row-gap: 24px;
    column-gap: 12px;

    .searchItem {
      border-radius: 50px;
      background-color: #f8f8f8;
      padding: 4px 12px;
    }
  }

  .historyList {
    max-height: calc(100vh - 100px);
    overflow: auto;

    .historyItem {
      padding: 10px 15px;
      border-bottom: 1px #eee solid;
      display: flex;
      align-items: center;
    }
  }
}

</style>
