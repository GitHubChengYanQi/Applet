<template>
  <Auth>
    <van-dialog id="van-dialog" />
    <Page v-if="auth && order" :order="order" />
  </Auth>
</template>
<script>
import Auth from '../../../components/Auth/index'
import Page from "./page";

export default {
  components: {Page, Auth},
  onLoad() {
    const current = this
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('selectOrder', function (order) {
      current.order = order
    })
  },
  data() {
    return {
      order: null
    }
  },
  computed: {
    auth() {
      return this.$store.state.userInfo.auth
    }
  }
}
</script>
