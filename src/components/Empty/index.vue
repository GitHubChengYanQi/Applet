<template>
  <view class="empty">
    <view>
      <van-empty v-if="brands.length === 0" description="暂无库存" />
      <image
          :src="`../../static/empty-image-${type || 'default'}.png`"
          class="image"
      />
    </view>
    {{ description || '' }}
  </view>
</template>

<script>
export default {
  name: 'empty',
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
