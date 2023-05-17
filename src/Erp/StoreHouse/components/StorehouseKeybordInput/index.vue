<template>
  <view>
    <view v-if="show" class="selectPlace">
      <MyButton @click="$emit('close')">取消</MyButton>
      <MyButton v-if="select !== null" color="#19be6b" @click="$emit('selectAddress',selectList[select])">确定</MyButton>
    </view>
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
      </view>
    </view>
  </view>
</template>

<script>

import LinkButton from "../../../../components/LinkButton";
import {isArray} from "../../../../util/Tools";
import MyButton from "../../../../components/MyButton";

export default {
  components: {MyButton, LinkButton},
  options: {
    styleIsolation: 'shared'
  },
  name: 'StorehouseKeybordInput',
  props: ['show', 'placeholder', 'value', 'title', 'selectList', 'noAutoFocus'],
  data() {
    return {
      isArray,
      select: null
    }
  },
  watch: {
    value() {
      this.select = null
    },
    selectList(list) {
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
    onSelect(index) {
      this.$emit('select', this.selectList[index])
      this.select = index
    }
  }
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

.selectPlace {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  top: 8px;
  width: calc(100vw - 24px);
  z-index: 1;
  padding: 12px;
}
</style>
