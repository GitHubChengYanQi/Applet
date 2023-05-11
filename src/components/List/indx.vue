<template>
  <view>
    <scroll-view
        show-scrollbar
        id="scrollView"
        class="scrollList"
        :scroll-y="!disabled"
        :style="{maxHeight,height,width}"
        @scrolltolower="scrolltolower"
    >
      <slot></slot>
      <Empty
          v-if="!noEmpty && isArray(list).length === 0 && moreStatus !== 'loading'"
          :description="description || '暂无数据'"
      />
      <view v-else-if="!(isArray(list).length === 0 && moreStatus !== 'loading')" @click="scrolltolower">
        <uni-load-more
            v-if=" noEmpty ? moreStatus !== 'more' : true"
            :status="hasMore ? moreStatus : 'noMore'"
        />
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
    'disabled',
    'noEmpty',
    'list',
    'defaultParams',
    'topBottom',
    'defaultSorter',
    'noEmpty',
    'options',
    'noTips',
    'pullDisabled',
    'maxHeight',
    'description',
    'defaultLimit',
    'height',
    'width',
  ],
  created() {
    this.limit = this.defaultLimit || 10
  },
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
            this.hasMore = resData.length === this.limit
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
    async submit(value, sorter) {
      this.hasMore = true
      this.page = 1
      this.data = []
      this.params = value
      this.sorter = sorter
      this.$emit('listSource', [], []);
      this.$emit('onLoading', true)
      await this.getList();
    },
    scrolltolower() {
      if (!this.hasMore || this.moreStatus === 'loading') {
        return
      }
      this.getList()
    },
  }
}
</script>
