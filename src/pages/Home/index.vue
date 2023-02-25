<template>
  <view>
  </view>
</template>

<script>
export default {
  name: 'Home',
  components: {},
  mounted() {
    uni.redirectTo({
      url: '/Erp/Receipt/ReceiptList/index'
    })
  }
}
</script>
