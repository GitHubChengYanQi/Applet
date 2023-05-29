<template>
  <view class="divider" :style="style">
    <view class="divider-left" :style="{backgroundColor:color}" />
    <view class="divider-content">
      <slot></slot>
    </view>
    <view class="divider-right" :style="{backgroundColor:color}" />
  </view>
</template>

<script>
export default {
  name: 'Divider',
  props: ['style', 'color']
}
</script>

<style lang="scss">
.divider {
  display: flex;
  align-items: center;
  gap: 8px;

  .divider-left, .divider-right {
    height: 1px;
    background-color: #dcdfe6;
    flex-grow: 1;
  }
}
</style>
