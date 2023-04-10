<template>
  <view>
    <scroll-view
        show-scrollbar
        id="scrollView"
        scroll-y="true"
        :style="{maxHeight}"
        @scrolltolower="scrolltolower"
        refresher-enabled="true"
        :refresher-triggered="triggered"
        @refresherpulling="onPulling"
        @refresherrefresh="onRefresh"
        @refresherrestore="onRestore"
        @refresherabort="onAbort"
    >
      <slot></slot>
      <Empty v-if="isArray(list).length === 0 && moreStatus !== 'loading'" :description="description || '暂无数据'" />
      <view v-else @click="scrolltolower">
        <uni-load-more :status="hasMore ? moreStatus : 'noMore'"></uni-load-more>
      </view>
    </scroll-view>
  </view>
</template>

<script>

import Empty from "../Empty";
import {Message} from "../Message";
import {isArray} from "../../util/Tools";

export default {
  name: 'List',
  components: {Empty},
  props: [
    'list',
    'defaultParams',
    'topBottom',
    'defaultSorter',
    'noEmpty',
    'options',
    'noTips',
    'pullDisabled',
    'maxHeight',
    'description'
  ],
  mounted() {
    this.sorter = this.defaultSorter
    this.params = this.defaultParams
    this.getList()
  },
  data() {
    return {
      isArray,
      triggered: false,
      hasMore: true,
      moreStatus: 'loading',
      loading: false,
      sorter: {},
      params: {},
      limit: 10,
      page: 1,
      data: [],
      requestList: () => {
      }
    }
  },
  methods: {
    async getList() {
      this.moreStatus = 'loading'
      await this.$emit('request', {
        params: {
          limit: this.limit,
          page: this.page,
          sorter: this.sorter,
        },
        data: {
          ...this.params,
        },
      }, {
        onSuccess: (res) => {

          const resData = res.data || [];
          this.$emit('response', res);
          if (resData.length > 0) {
            const array = [...this.data];
            resData.map((items) => {
              return array.push(items);
            });
            this.data = [...array]
            this.$emit('listSource', array, resData);
            this.page = this.page + 1
            this.hasMore = resData.length === 10
          } else {
            this.hasMore = false
            if (this.page === 1) {
              this.$emit('listSource', [], []);
            }
          }
          this.$emit('onLoading', false)
          this.moreStatus = 'more'
          this.triggered = false
        },
        onError: () => {
          this.hasMore = false
          this.$emit('onLoading', false)
          this.moreStatus = 'more'
          this.triggered = false
        },
      })
    },
    async submit(value, sorter, pull) {
      this.hasMore = true
      this.page = 1
      this.data = []
      this.params = value
      this.sorter = sorter
      !pull && this.$emit('listSource', [], []);
      this.$emit('onLoading', true)
      await this.getList();
    },
    scrolltolower() {
      if (!this.hasMore || this.moreStatus === 'loading') {
        return
      }
      this.getList()
    },
    onPulling(e) {

    },
    onRefresh() {
      this.triggered = true;
      this.submit(this.params, this.sorter, true)
    },
    onRestore() {
      // this.triggered = false; // 需要重置
      Message.successToast('刷新完成！')
    },
    onAbort() {

    }
  }
}
</script>
