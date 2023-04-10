<template>
  <view>
    <van-popup
        :show="show"
        :z-index="zIndex ||  100"
        @close="$emit('close')"
        position="bottom"
        @after-leave="$emit('closeAfter')"
        @before-enter="$emit('showBefore')"
    >
      <view v-if="!noTitle" class='header'>
        <span v-if="leftText" class='left'><LinkButton @click="$emit('onLeft')">{{ leftText }}</LinkButton></span>
        {{ title || '' }}
        <span class='right' @click="!rightText && $emit('close')">
          <span v-if="rightText"><LinkButton @click="$emit('onRight')">{{ rightText }}</LinkButton></span>
          <van-icon v-else name="cross" />
        </span>
      </view>
      <slot></slot>
    </van-popup>
  </view>
</template>

<script>
import LinkButton from "../LinkButton";

export default {
  name: 'Popup',
  components: {LinkButton},
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
