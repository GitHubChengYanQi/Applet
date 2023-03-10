<template>
  <view>
    <web-view ref="webview" :src="`${src}Work/Stock`"></web-view>
  </view>
</template>

<script>
export default {
  name: 'Stock',
  data() {
    return {
      src: process.env.VUE_APP_PAGE_URL
    }
  },
  mounted() {
    // this.$refs.webview.evalJs("document.body.style.background ='#00FF00'");
  },
  methods: {}
}
</script>
