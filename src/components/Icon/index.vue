<template>
  <view class="icon">
    <view v-if="!color" :class="['t-icon','t-'+icon]" :style="{width:`${size}px`,height:`${size}px`}" />
    <uni-icons v-else custom-prefix="iconfont" :type="icon" :size="size" :color="color"></uni-icons>
  </view>
</template>

<script>
export default {
  name: 'Icon',
  props: ['icon', 'size', 'color'],
}
</script>

<style lang="scss">
.icon {
  display: inline-block;
}
</style>
