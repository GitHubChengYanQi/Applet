<template>
  <view>
    <scroll-view
        show-scrollbar
        id="scrollView"
        scroll-y="true"
        :style="{maxHeight}"
        @scrolltolower="scrolltolower"
    >
      <slot></slot>
      <view @click="scrolltolower">
        <uni-load-more :status="hasMore ? moreStatus : 'noMore'"></uni-load-more>
      </view>
    </scroll-view>
  </view>
</template>

<script>

export default {
  name: 'List',
  props: [
    'list',
    'defaultParams',
    'topBottom',
    'defaultSorter',
    'noEmpty',
    'manual',
    'options',
    'noTips',
    'pullDisabled',
    'maxHeight'
  ],
  mounted() {
    this.sorter = this.defaultSorter
    this.params = this.defaultParams
    this.getList()
  },
  data() {
    return {
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
            this.$emit('listSource', array);
            this.page = this.page + 1
            this.hasMore = resData.length === 10
          } else {
            this.hasMore = false
            if (this.page === 1) {
              this.$emit('listSource', []);
            }
          }
          this.$emit('onLoading', false)
          this.moreStatus = 'more'
        },
        onError: () => {
          this.hasMore = false
          this.$emit('onLoading', false)
          this.moreStatus = 'more'
        },
      })
    },
    submit(value, sorter, pull) {
      this.hasMore = false
      this.page = 1
      this.data = []
      this.params = value
      this.sorter = sorter
      !pull && this.$emit('listSource', []);
      this.$emit('onLoading', true)
      this.getList();
    },
    scrolltolower() {
      if (!this.hasMore || this.moreStatus === 'loading') {
        return
      }
      this.moreStatus = 'loading'
      this.getList()
    }
  }
}
</script>
