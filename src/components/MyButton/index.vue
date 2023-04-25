<template>
  <view class="myButton">
    <u-button
        :color="color"
        :type="type || 'info'"
        :loading="loading"
        :size="size"
        :plain="plain"
        :disabled="disabled"
        @click="$emit('click')"
    >
      <slot>按钮</slot>
    </u-button>
  </view>
</template>

<script>

const Types = ['primary', 'info', 'error', 'warning', 'success']
const Sizes = ['large', 'mini', 'error', 'warning', 'success']

export default {
  options: {
    styleIsolation: 'shared'
  },
  name: 'MyButton',
  props: {
    type: String,
    color: String,
    loading: Boolean,
    plain: Boolean,
    disabled: Boolean,
    size: String,
  }
}
</script>

<style lang="scss">
.myButton {
  display: inline-block;

  > button {
    height: fit-content !important;
    width: fit-content !important;
    padding: 4px 15px;
    font-size: 14px;
  }
}
</style>
