<template>
  <u-avatar
      :text="text"
      :src="src"
      :size="size"
      :shape="circular ? 'circle' : 'square'"
      @click="$emit('click')"
  >

  </u-avatar>
</template>

<script>
export default {
  name: 'Avatar',
  props: ['size', 'src', 'circular', 'text'],
}
</script>

<style lang="scss">
</style>
