<template>
  <view>
    <view :class="['bottomButton',className]" :style="{paddingBottom:`${safeAreaHeight(this,12)}px`}">
      <view class='button' v-if="only">
        <u-button
            :loading='loading'
            :disabled='disabled'
            :type="type || 'primary'"
            @click="$emit('onClick')"
        >{{ text || '确定' }}
        </u-button>
      </view>
      <view v-else>
        <view class="left">
          <u-button
              :loading='leftLoading'
              type='primary'
              plain
              :disabled='leftDisabled'
              @click="$emit('leftOnClick')"
          >
            {{ leftText || '取消' }}
          </u-button>
        </view>
        <view class="right">
          <u-button
              :loading='rightLoading'
              :disabled="rightDisabled"
              type='primary'
              @click="$emit('rightOnClick')"
          >
            {{ rightText || '确认' }}
          </u-button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>

import {safeAreaHeight} from "../../util/Tools";

export default {
  name: 'BottomButton',
  components: {},
  options: {
    styleIsolation: 'shared'
  },
  data() {
    return {
      safeAreaHeight
    }
  },
  props: [
    'only',
    'leftLoading',
    'rightLoading',
    'loading',
    'type',
    'leftText',
    'leftDisabled',
    'rightText',
    'rightDisabled',
    'only',
    'disabled',
    'text',
    'className'
  ],
  mounted() {
    this.$emit('afertShow')
  }
}
</script>

<style lang="scss">

.bottomButton {
  padding: 12px;
  //height: 60px;
  z-index: 5;
  width: calc(100% - 24px);
  max-width: 640px;
  position: fixed;
  bottom: 0;
  left: auto;
  right: auto;
  background-color: #fff;
  box-shadow: 0 -4px 10px 0 rgba(0, 0, 0, 0.1);

  .button {
    button {
      border-radius: 50px;
      width: 100%;
      height: 40px;
    }
  }

  .left {
    width: 50%;
    display: inline-block;

    button {
      height: 40px;
      padding: 0;
      font-size: 14px;
      width: 100%;
      border-radius: 50px 0 0 50px;
      border-right: none;
    }

  }

  .right {
    width: 50%;
    display: inline-block;

    button {
      height: 40px;
      border-left: none;
      padding: 0;
      font-size: 14px;
      width: 100%;
      border-radius: 0 50px 50px 0;
    }
  }
}


</style>
