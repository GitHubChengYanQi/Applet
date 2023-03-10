<template>
  <view>
    <web-view ref="webview" :src="`${src}Work/Sku/SkuDetail?skuId=${skuId}`"></web-view>
  </view>
</template>


<script>
export default {
  onLoad(options) {
    this.skuId = options.skuId
  },
  data() {
    return {
      skuId: '',
      src: process.env.VUE_APP_PAGE_URL
    }
  },
  mounted() {
    // this.$refs.webview.evalJs("document.body.style.background ='#00FF00'");
  },
  methods: {}
}
</script>
