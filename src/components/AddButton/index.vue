<template>
  <view class="add" :style="addStyle">
    <u-button :type="warning ?'warning': 'primary'"
              icon="plus"
              :disabled="disable"
              @click="$emit('click')"
              :plain="plain">
      {{ title }}
    </u-button>
  </view>
</template>

<script>
export default {
  name: "AddButton",
  props: [
    'warning',
    'disable',
    'onClick',
    'width',
    'height',
    'className',
    'addStyle',
    'title',
    'plain'
  ]
}
</script>

<style lang="scss">

.add {
  width: 100%;
  height: 100%;
  padding: 0
}

</style>