<template>
  <view class="search" @click="$emit('click')">
    <view class="input">
      <van-search
          custom-class="searchCustomClass"
          use-action-slot
          :value="value"
          :readonly="readonly"
          :placeholder="placeholder || '请输入搜索关键词'"
          @cancel="onCancel"
          @clear="onClear"
          @focus="onFocus"
          @blur="onBlur"
          @change="onChange"
          @search="onSearch"
      />
    </view>
    <view v-if="!readonly">
      <view
          class="action"
          :style="{width}"
          v-if="history || ((focus || value) && !noSearchButton)"
          @click="onSearch({detail:value})"
      >
        搜索
      </view>
      <view v-else-if="$slots.extraIcon" class='icon'>
        <slot name="extraIcon"></slot>
      </view>
    </view>
  </view>
</template>

<script>

export default {
  name: 'Search',
  props: [
    'readonly',
    'customClass',
    'placeholder',
    'searchStyle',
    'searchBarStyle',
    'searchIcon',
    'extraIcon',
    'className',
    'noSearchButton',
    'value',
    'history',
    'width'
  ],
  data() {
    return {
      focus: false
    }
  },
  mounted() {

  },
  methods: {
    onClear() {
      if (!this.history) {
        this.$emit('onSearch', '')
      }
      this.$emit('onChange', '')
      this.$emit('onClear', '')
    },
    onFocus() {
      this.focus = true
    },
    onBlur() {
      setTimeout(() => {
        this.focus = false
      }, 100)
    },
    onSearch(value) {
      this.$emit('onSearch', value.detail)
    },
    onChange(value) {
      this.$emit('onChange', value.detail)
    },
  }
}
</script>

<style lang="scss">

.search {
  display: flex;
  align-items: center;

  .input {
    flex-grow: 1;
  }

}

.action {
  color: $primary-color;
  padding: 0 12px;
  font-size: 14px;
}

.icon {
  min-width: 30px;
  margin-left: 12px;
  text-align: center;
}

.searchCustomClass {
  padding: 12px 0 !important;
}
</style>
