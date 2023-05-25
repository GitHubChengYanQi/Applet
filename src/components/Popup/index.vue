<template>
  <view>
    <u-popup
        :round="round"
        :show="show"
        @close="$emit('close')"
        @open="$emit('showBefore')"
    >
      <view v-if="!noTitle" class='popupHeader' :style="{borderBottom:!noHeaderBorder ?'1px solid #EEEEEE' : 'none'}">
        <view v-if="leftText" class='popupLeft'>
          <LinkButton @click="$emit('onLeft')">{{ leftText }}</LinkButton>
        </view>
        <slot name="title">{{ title || '' }}</slot>
        <view class='popupRight' @click="!rightText && $emit('close')">
          <template v-if="rightText">
            <slot name="rightButton">
              <LinkButton @click="$emit('onRight')">{{ rightText }}</LinkButton>
            </slot>
          </template>
          <u-icon v-else name="close" />
        </view>
      </view>
      <view class="popupContent" :style="{maxHeight}">
        <slot></slot>
      </view>
    </u-popup>
  </view>
</template>

<script>
import LinkButton from "../LinkButton";

export default {
  name: 'Popup',
  components: {LinkButton},
  props: [
    'round',
    'zIndex',
    'show',
    'title',
    'destroyOnClose',
    'className',
    'leftText',
    'rightText',
    'getContainer',
    'noTitle',
    'noHeaderBorder',
    'maxHeight'
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

.popupContent {
  max-height: 80vh;
  overflow: auto;
}

</style>
