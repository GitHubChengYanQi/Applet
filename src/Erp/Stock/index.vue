<template>
  <view>
    <web-view ref="webview" :src="`${src}Work/Stock?skuDetailUrl=${skuDetailUrl}`"></web-view>
  </view>
</template>

<script>
export default {
  name: 'Stock',
  data() {
    return {
      src: process.env.VUE_APP_PAGE_URL,
      skuDetailUrl: '/Erp/Sku/SkuDetail/index'
    }
  },
  mounted() {
    // this.$refs.webview.evalJs("document.body.style.background ='#00FF00'");
  },
  methods: {}
}
</script>
