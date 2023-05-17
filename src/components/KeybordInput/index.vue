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
            :focus="!noAutoFocus"
            :adjustPosition="false"
            autoHeight
            :round="10"
            @confirm="$emit('close')"
            :placeholder="placeholder || '请输入'"
            :value="value"
            @input="(val)=>$emit('input',val)"
        />
        <LinkButton @click="$emit('close')">确认</LinkButton>
      </view>
      <view
          class="selectList"
          v-if="isArray(selectList).length > 0"
      >
        <view
            class="selectListItem"
            v-for="(item,index) in isArray(selectList)"
            :key="index"
            @click="$emit('select',item)"
        >
          <view class="selectListTitle">
            {{ item.title }}
          </view>
          <view class="selectListDescribe">
            {{ item.describe }}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>

import LinkButton from "../LinkButton";
import {isArray} from "../../util/Tools";

export default {
  components: {LinkButton},
  options: {
    styleIsolation: 'shared'
  },
  name: 'KeybordInput',
  props: ['show', 'placeholder', 'value', 'title', 'selectList', 'noAutoFocus'],
  data() {
    return {
      isArray
    }
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
  z-index: 1;

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

  .selectList {
    padding-top: 8px;

    .selectListItem {
      padding: 8px 0;
      border-bottom: 1px solid #EDEDED;

      .selectListTitle {
        font-size: 14px;
      }

      .selectListDescribe {
        color: #999999;
        font-size: 12px;
      }
    }
  }


}
</style>
