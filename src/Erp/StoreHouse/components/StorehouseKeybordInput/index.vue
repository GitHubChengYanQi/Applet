<template>
  <view
      class="KeybordInput"
      :style="{bottom:`${keyboardHeight}px`}"
  >
    <view
        @touchstart="$emit('onTouchstart',true)"
        @touchend="$emit('onTouchend',true)"
    >
      <view class="KeybordInput-title">
        {{ title }}
      </view>
      <view class="KeybordInput-input">
        <u--input
            :selectionStart="value ? value.length : -1"
            :focus="!noAutoFocus"
            :adjustPosition="false"
            :round="10"
            :placeholder="placeholder || '请输入'"
            :value="value"
            @input="(val)=>$emit('input',val)"
        />
      </view>
    </view>

    <Loading skeleton v-if="searchPlaccesLoading" />
    <scroll-view
        v-else
        class="selectList"
        :scroll-y="moveY === 0"
        :style="{
          maxHeight: `calc(${100 - top}vh - 33px - 103px - ${safeAreaHeight(this,8)}px)`,
        }"
        @scroll="(scroll)=>$emit('onScroll',scroll)"
        @touchstart="$emit('onTouchstart')"
        @touchend="$emit('onTouchend')"
    >
      <view
          class="selectListItem"
          v-for="(item,index) in isArray(selectList)"
          :key="index"
          @click="onSelect(index)"
      >
        <view class="selectListItemContent">
          <view class="selectListTitle">
            {{ item.title }}
          </view>
          <view class="selectListDescribe">
            {{ item.describe }}
          </view>
        </view>
        <u-icon v-if="index === select" name="checkbox-mark" color="#19be6b" />
      </view>
    </scroll-view>
  </view>
</template>

<script>

import LinkButton from "../../../../components/LinkButton";
import {isArray, safeAreaHeight} from "../../../../util/Tools";
import MyButton from "../../../../components/MyButton";
import Loading from "../../../../components/Loading";

export default {
  components: {Loading, MyButton, LinkButton},
  options: {
    styleIsolation: 'shared'
  },
  name: 'StorehouseKeybordInput',
  props: ['show', 'placeholder', 'value', 'title', 'selectList', 'noAutoFocus', 'moveY', 'top', 'searchPlaccesLoading'],
  data() {
    return {
      safeAreaHeight,
      isArray,
      select: null
    }
  },
  watch: {
    value() {
      this.select = null
    },
    selectList() {
      this.select = null
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
  methods: {
    disabled() {
      return typeof this.select !== "number"
    },
    ok() {
      this.$emit('selectAddress', this.select === null ? null : this.selectList[this.select])
    },
    onSelect(index) {
      this.$emit('select', this.selectList[index])
      this.select = index
    }
  }
}
</script>

<style lang="scss">
.KeybordInput {
  //position: fixed;
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
    padding-bottom: 8px;

    .u-input {
      //margin-right: 12px;
      flex-grow: 1;
      background-color: #fafafa !important
    }
  }

  .selectList {

    .selectListItem {
      padding: 8px 0;
      border-bottom: 1px solid #EDEDED;
      display: flex;
      align-items: center;

      .selectListItemContent {
        flex-grow: 1;

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
}
</style>
