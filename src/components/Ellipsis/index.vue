<template>
  <view
      class='ellipsis'
      @click="$emit('onClick')"
      :style="{maxWidth,width: width || '90%',style:viewStyle}"
  >
    <slot>{{ value }}</slot>
  </view>
</template>

<script>
export default {
  name: 'elliptsis',
  props: [
    'value',
    'width',
    'viewStyle',
    'maxWidth',
  ]
}
</script>

<style lang="scss">
.ellipsis {
  display: inline-block;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>
