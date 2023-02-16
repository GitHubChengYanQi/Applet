<template>
  <view>
    <view :class="['bottom',className]">
      <van-button
          v-if="only"
          :loading='loading'
          :disabled='disabled'
          custom-class='button'
          :type="type || 'info'"
          @click="$emit('onClick')"
      >{{ text || '确定' }}
      </van-button>
      <view v-else>
        <van-button
            :loading='leftLoading'
            type='info'
            plain
            :disabled='leftDisabled'
            custom-class="left"
            @click="$emit('leftOnClick')"
        >
          {{ leftText || '取消' }}
        </van-button>
        <van-button
            :loading='rightLoading'
            :disabled="rightDisabled"
            custom-class="right"
            type='info'
            @click="$emit('rightOnClick')"
        >
          {{ rightText || '确认' }}
        </van-button>
      </view>
    </view>
  </view>
</template>

<script>

export default {
  name: 'BottomButton',
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

.bottom {
  padding: 12px;
  height: 60px;
  z-index: 999;
  width: calc(100% - 24px);
  max-width: 640px;
  position: fixed;
  bottom: 0;
  left: auto;
  right: auto;
  background-color: #fff;
  box-shadow: 0 -4px 10px 0 rgba(0, 0, 0, 0.1);

  .button {
    border-radius: 50px;
    width: 100%;
    height: 40px;
  }

  .left {
    height: 40px;
    padding: 0;
    font-size: 14px;
    width: 50%;
    border-radius: 50px 0 0 50px;
    border-right: none;
  }

  .right {
    height: 40px;
    border-left: none;
    padding: 0;
    font-size: 14px;
    width: 50%;
    border-radius: 0 50px 50px 0;

    .leftCorner {
      bottom: 0;
      width: 20px;
      height: 20px;
      position: absolute;
      z-index: 100;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      pointer-events: none;
      left: -20px;
      transform: rotate(0deg);

      path {
        fill: var(--adm-color-primary);
      }
    }
  }
}

.square {
  height: 47px;
  padding: 0;

  .left, .right {
    height: 100%;
    border-radius: 0;
    border: none;
    border-top: solid 1px #EEEEEE;
  }
}


</style>
