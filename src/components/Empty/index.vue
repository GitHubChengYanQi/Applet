<template>
  <view class="empty">
    <u-empty
        :mode="mode()"
        :text="description || '暂无数据'"
    />
  </view>
</template>

<script>
export default {
  name: 'Empty',
  props: ['type', 'description'],
  methods: {
    mode() {
      switch (this.type) {
        case 'error':
          return 'data'
        default:
          return 'list'
      }
    }
  }
}
</script>

<style lang="scss">

.empty {
  background-color: #fff;
  padding: 24px;
}

</style>
