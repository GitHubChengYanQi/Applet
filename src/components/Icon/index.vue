<template>
  <view
      :class="['icon','t-icon','t-'+icon]"
      :style="{width:`${size}px`,height:`${size}px`}"
      @click="$emit('click')"
  />
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
