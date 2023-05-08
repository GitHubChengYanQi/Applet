<template>
  <view class="empty" :style="style">
    <u-empty
        :mode="mode()"
        :text="description || '暂无数据'"
    />
  </view>
</template>

<script>
export default {
  name: 'Empty',
  props: ['type', 'description','style'],
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
