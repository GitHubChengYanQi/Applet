<template>
  <view>
    <van-button
        custom-class="button"
        :disabled='disabled'
        :size="size || 'small'"
        type='info'
        @click="$emit('click')"
    >
      <slot></slot>
    </van-button>
  </view>
</template>

<script>
export default {
  name:'Button',
  props:['type','disabled','size']
}
</script>

<style lang="scss">

</style>
