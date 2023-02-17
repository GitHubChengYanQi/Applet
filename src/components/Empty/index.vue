<template>
  <view class="empty">
    <view>
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
