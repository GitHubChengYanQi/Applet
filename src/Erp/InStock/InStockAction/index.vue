<template>
  <Auth>
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
    if (typeof eventChannel.on === "function"){
      eventChannel.on('selectOrder', function (order) {
        current.order = order
      })
    }
  },
  data() {
    return {
      order: {}
    }
  },
  computed: {
    auth() {
      return this.$store.state.userInfo.auth
    }
  }
}
</script>
