<template>
  <view class="icon">
    <view :class="['t-icon','t-'+icon]" :style="{width:`${size}px`,height:`${size}px`}" />
  </view>
</template>

<script>
export default {
  name: 'Icon',
  props: ['icon', 'size'],
}
</script>

<style lang="scss">
.icon {
  display: inline-block;
}
</style>
