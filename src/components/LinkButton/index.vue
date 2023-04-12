<template>
  <view class="linkButton">
    <van-button :disabled="disabled" type="info" custom-class="button" plain @click="$emit('click')">
      <slot>{{ title }}</slot>
    </van-button>
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

  .button {
    padding: 0;
    border: none;
    height: fit-content;
    background: transparent;
  }

}
</style>
