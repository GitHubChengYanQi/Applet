<template>
  <view>
    <web-view ref="webview" :src="`http://192.168.2.111:3000/#/Work/Stock?skuDetailUrl=${skuDetailUrl}`"></web-view>
  </view>
</template>

<script>
export default {
  name: 'Stock',
  data() {
    return {
        skuDetailUrl:'/Erp/Sku?id=123'
    }
  },
  mounted() {
    // this.$refs.webview.evalJs("document.body.style.background ='#00FF00'");
  },
  methods: {}
}
</script>
