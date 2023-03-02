<template>
  <uni-icons custom-prefix="iconfont" :type="icon" :size="size" :color="color"></uni-icons>
</template>

<script>
export default {
  name: 'Icon',
  props:['icon','size','color'],
}
</script>
