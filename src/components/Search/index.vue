<template>
  <view class="search">
    <view class="input">
      <van-search
          use-action-slot
          :value="value"
          :placeholder="placeholder || '请输入搜索关键词'"
          @cancel="onCancel"
          @clear="onClear"
          @focus="onFocus"
          @blur="onBlur"
          @change="onChange"
          @search="onSearch"
      />
    </view>
    <view>
      <view
          class="action"
          v-if="!historyType && (focus || value) && !noSearchButton"
          @click="onSearch({detail:value})"
      >
        搜索
      </view>
      <view v-else class='icon'>
        <slot name="extraIcon"></slot>
      </view>
    </view>
  </view>
</template>

<script>

export default {
  name: 'Search',
  props: [
    'placeholder',
    'searchStyle',
    'searchBarStyle',
    'searchIcon',
    'extraIcon',
    'className',
    'noSearchButton',
    'value',
    'historyType',
    'value',
  ],
  data() {
    return {
      focus: false
    }
  },
  methods: {
    onClear() {
      this.$emit('onSearch', '')
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
  padding: 0 12px;
}

.icon {
  min-width: 30px;
  margin-left: 12px;
  text-align: center;
}
</style>
