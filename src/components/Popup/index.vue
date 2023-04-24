<template>
  <view>
    <u-popup
        :show="show"
        @close="$emit('close')"
        @open="$emit('showBefore')"
    >
      <view v-if="!noTitle" class='popupHeader'>
        <span v-if="leftText" class='popupLeft'><LinkButton @click="$emit('onLeft')">{{ leftText }}</LinkButton></span>
        {{ title || '' }}
        <span class='popupRight' @click="!rightText && $emit('close')">
          <span v-if="rightText"><LinkButton @click="$emit('onRight')">{{ rightText }}</LinkButton></span>
          <u-icon v-else name="close" />
        </span>
      </view>
      <slot></slot>
    </u-popup>
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
    'noTitle',
  ],
  watch: {
    show(value) {
      if (!value) {
        setTimeout(() => {
          this.$emit('closeAfter')
        }, 500)
      }
    }
  }
}
</script>

<style lang="scss">
.popupHeader {
  height: 45px;
  line-height: 45px;
  text-align: center;
  font-size: 18px;
  border-bottom: 1px solid #EEEEEE;
  position: relative;

  .popupRight {
    top: 0;
    position: absolute;
    right: 0;
    padding: 0 12px;
    height: 100%;
    display: flex;
    align-items: center;
  }

  .popupLeft {
    top: 0;
    position: absolute;
    left: 0;
    padding: 0 12px;
  }
}

</style>
