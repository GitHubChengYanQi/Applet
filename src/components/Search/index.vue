<template>
  <view :style="style" class="search" @click="$emit('click')">
    <view class="input">
      <u-search
          :value="value"
          :disabled="readonly"
          :placeholder="placeholder || '请输入搜索关键词'"
          @clear="onClear"
          @focus="onFocus"
          @blur="onBlur"
          @change="onChange"
          @search="onSearch"
          :showAction="false"
      />
    </view>
    <view v-if="!readonly">
      <view
          class="action"
          :style="{width}"
          v-if="history || ((focus || value) && !noSearchButton)"
          @click="onSearch(value)"
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
    'width',
    'style'
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
      this.$emit('onSearch', value)
    },
    onChange(value) {
      this.$emit('onChange', value)
      this.$emit('input', value)
    },
  }
}
</script>

<style lang="scss">

.search {
  display: flex;
  align-items: center;
  padding: 12px 0;

  .input {
    flex-grow: 1;
  }

}

.action {
  color: $primary-color;
  padding-left: 12px;
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
