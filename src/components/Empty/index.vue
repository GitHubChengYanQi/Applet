<template>
  <view class="empty">
    <van-empty :image="type || 'default'" :description="description" />
  </view>
</template>

<script>
export default {
  name: 'Empty',
  props: ['type', 'description']
}
</script>

<style lang="scss">

.empty {
  background-color: #fff;
}

</style>
