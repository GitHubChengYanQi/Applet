<template>
  <view>
    <van-popup
        :show="show"
        :z-index="zIndex ||  100"
        @close="$emit('close')"
        position="bottom"
    >
      <view v-if="title && !noTitle" class='header'>
        <span v-if="leftText" class='left' @click="$emit('onLeft')">{{ leftText }}</span>
        {{ title }}
        <span class='right' @click="$emit('close');$emit('onRight')">
          <span v-if="rightText"></span>
          <van-icon v-else name="cross" />
        </span>
      </view>
      <slot></slot>
    </van-popup>
  </view>
</template>

<script>
export default {
  name: 'Popup',
  props: [
    'zIndex',
    'show',
    'title',
    'destroyOnClose',
    'className',
    'leftText',
    'rightText',
    'getContainer',
    'position',
    'noTitle',
  ]
}
</script>

<style lang="scss">
.header {
  height: 45px;
  line-height: 45px;
  text-align: center;
  font-size: 18px;
  border-bottom: 1px solid #EEEEEE;
  position: relative;

  .right {
    top: 0;
    position: absolute;
    right: 0;
    padding: 0 12px;
  }

  .left {
    top: 0;
    position: absolute;
    left: 0;
    padding: 0 12px;
  }
}

</style>
