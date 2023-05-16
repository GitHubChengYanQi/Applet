<template>
  <view>
    <view
        v-if="show"
        class="KeybordInput"
        :style="{bottom:`${keyboardHeight}px`}"
    >
      <view class="KeybordInput-title">
        {{ title }}
      </view>
      <view class="KeybordInput-input">
        <u--textarea
            :selectionStart="value ? value.length : -1"
            :showConfirmBar="false"
            focus
            :adjustPosition="false"
            autoHeight
            :round="10"
            @confirm="$emit('close')"
            @blur="$emit('close')"
            :placeholder="placeholder || '请输入'"
            :value="value"
            @input="(val)=>$emit('input',val)"
        />
        <LinkButton @click="$emit('close')">确认</LinkButton>
      </view>

    </view>
  </view>
</template>

<script>

import LinkButton from "../LinkButton";
import {safeAreaHeight} from "../../util/Tools";

export default {
  components: {LinkButton},
  options: {
    styleIsolation: 'shared'
  },
  name: 'KeybordInput',
  props: ['show', 'placeholder', 'value', 'title'],
  data() {
    return {}
  },
  computed: {
    keyboardHeight() {
      const safeAreaHeight = this.$store.state.systemInfo.systemInfo?.safeAreaInsets?.bottom || 0
      const keyboardHeight = this.$store.state.keyboard.keyboardHeight
      return keyboardHeight < safeAreaHeight ? safeAreaHeight : keyboardHeight
    }
  },
  mounted() {


  },
}
</script>

<style lang="scss">
.KeybordInput {
  position: fixed;
  padding: 12px;
  width: calc(100% - 24px);
  background-color: #FFFFFF;

  .KeybordInput-title {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 12px;
  }

  .KeybordInput-input {
    display: flex;
    align-items: center;

    .u-textarea {
      margin-right: 12px;
      flex-grow: 1;
      background-color: #fafafa !important
    }
  }


}
</style>
