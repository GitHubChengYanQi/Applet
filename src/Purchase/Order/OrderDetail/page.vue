<template>
  <view v-if="src">
    <web-view :src="`${src}Work/Order/Detail?id=${orderId}`"></web-view>
  </view>
</template>

<script>
export default {
  name: 'OrderDetail',
  props: ['orderId'],
  data() {
    return {
      src: process.env.VUE_APP_PAGE_URL
    }
  },
  mounted() {

  }

}
</script>
