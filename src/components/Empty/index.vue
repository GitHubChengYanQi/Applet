<template>
  <view>
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
  text-align: center;

  image {
    width: 320px;
    height: 320px;
  }
}

</style>
