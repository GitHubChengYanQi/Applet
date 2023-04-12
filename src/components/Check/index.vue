<template>
  <view>
    <van-checkbox
        :value="value"
        :disabled="disabled"
        shape="square"
        :checked-color="color"
        @change="$emit('change')"
    >
      <slot></slot>
    </van-checkbox>
  </view>
</template>

<script>
export default {
  name: 'Check',
  props: ['value','disabled','color']
}
</script>
