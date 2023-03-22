<template>
  <Auth>

    <van-dialog id="van-dialog" />
    <Page v-if="auth" />
  </Auth>
</template>
<script>
import Page from "./page";
import Auth from "../../../components/Auth";

export default {
  components: {Auth, Page},
  data() {
    return {}
  },
  computed: {
    auth() {
      return this.$store.state.userInfo.auth
    }
  }
}
</script>
