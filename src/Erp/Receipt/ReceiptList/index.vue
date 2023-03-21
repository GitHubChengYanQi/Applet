<template>
  <Auth>
    <van-notify id="van-notify" />

    <van-dialog id="van-dialog" />
    <Page v-if="auth && type" :receiptType="type" />
  </Auth>
</template>
<script>
import Auth from "../../../components/Auth";
import Page from "./page";

export default {
  components: {Page, Auth},
  data() {
    return {
      type: ''
    }
  },
  onLoad(options) {
    this.type = options.type
  },
  computed: {
    auth() {
      return this.$store.state.userInfo.auth
    }
  }
}
</script>
