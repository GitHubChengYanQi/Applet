<template>
  <view class="divider" :style="style">
    <view class="left" />
    <view class="content">
      <slot></slot>
    </view>
    <view class="right" />
  </view>
</template>

<script>
export default {
  name: 'Divider',
  props: ['style']
}
</script>

<style lang="scss">
.divider {
  display: flex;
  align-items: center;
  gap: 8px;

  .left, .right {
    height: 1px;
    width: 100%;
    background-color: rgb(220, 223, 230);
    flex-grow: 1;
  }
}
</style>
