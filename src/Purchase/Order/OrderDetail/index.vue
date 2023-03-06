<template>
  <Auth>
    <van-toast id="van-toast" />
    <van-dialog id="van-dialog" />
    <Page v-if="auth && id" :orderId="id" />
  </Auth>
</template>
<script>
import Page from "./page";
import Auth from "../../../components/Auth";

export default {
  components: {Auth, Page},
  onLoad(option) {
    this.id = option.id
  },
  data() {
    return {
      id: ''
    }
  },
  computed: {
    auth() {
      return this.$store.state.userInfo.auth
    }
  }
}
</script>
