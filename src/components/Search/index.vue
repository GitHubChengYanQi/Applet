<template>
  <view>
    <vantSearch
        :value="value"
        :placeholder="placeholder || '请输入搜索关键词'"
        @cancel="onCancel"
        @clear="onClear"
        @focus="onFocus"
        @blur="onBlur"
    >
      <view slot="action" @tap="onSearch">搜索</view>
    </vantSearch>
  </view>
</template>

<script>

export default {
  name: 'search',
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
    return {}
  },
  methods: {
    onCancel(value) {
      console.log('onCancel', value)
    },
    onClear(value) {
      console.log('onClear', value)
    },
    onFocus(value) {
      console.log('onFocus', value)
    },
    onBlur(value) {
      console.log('onBlur', value)
    },
    onSearch(value) {
      console.log('onSearch', value)
    },
  }
}
</script>

<style lang="scss">

</style>
