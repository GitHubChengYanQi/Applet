<template>
  <view>
    <van-swipe-cell :disabled="disabled" :id="swipeId" :right-width="width" :left-width="width" @open="open">
      <view slot="left"></view>
      <slot></slot>
      <view slot="right"></view>
    </van-swipe-cell>
  </view>
</template>

<script>
export default {
  name: 'Slide',
  props: ['swipeId', 'disabled'],
  data() {
    return {
      width: 0
    }
  },
  mounted() {
    this.width = uni.getWindowInfo().screenWidth
  },
  methods: {
    open(event) {
      if (event.detail.position === 'right') {
        this.$emit('onRight')
      } else {
        this.$emit('onLeft')
      }
      this.selectComponent('#' + this.swipeId).close()
    },
  }
}
</script>

<style lang="scss">

</style>
