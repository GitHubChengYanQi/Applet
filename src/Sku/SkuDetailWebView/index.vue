<template>
  <view>
    <WebView :src=`Work/Sku/SkuDetail?skuId=${skuId}` />
  </view>
</template>


<script>
import WebView from "../../components/WebView";
export default {
  components: {WebView},
  onLoad(options) {
    this.skuId = options.skuId
  },
  data() {
    return {
      skuId: ''
    }
  },
  mounted() {
    // this.$refs.webview.evalJs("document.body.style.background ='#00FF00'");
  },
  methods: {}
}
</script>
