<template>
  <view>
    <web-view ref="webview" :src="`${base}${src}`"></web-view>
  </view>
</template>

<script>
export default {
  name: 'WebView',
  props: ['src'],
  data() {
    return {
      base: process.env.VUE_APP_PAGE_URL
    }
  }
}
</script>
