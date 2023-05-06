<template>
  <view class="linkButton">
    <u-button :disabled="disabled" type="primary" custom-class="button" plain @click="$emit('click')">
      <slot>{{ title }}</slot>
    </u-button>
  </view>
</template>

<script>
export default {
  name: 'LinkButton',
  props: ['title', 'style', 'color', 'disabled', 'className']
}
</script>

<style lang="scss">

.linkButton {

  > button {
    padding: 0 !important;
    border: none !important;
    height: fit-content !important;
    background: transparent !important;
    width: fit-content !important;
    margin: unset;
    font-size: 16px !important;

    &::after, &::before {
      content: none;
    }
  }

}
</style>
