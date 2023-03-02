<template>
  <u-avatar :src="src" :size="size" :shape="circular ? 'circle' : 'square'"></u-avatar>
</template>

<script>
export default {
  name: 'Avatar',
  props: ['size', 'src', 'circular'],
}
</script>

<style lang="scss">
</style>
