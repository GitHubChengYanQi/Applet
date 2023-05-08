<template>
  <Auth>
    <Page ref="page" v-if="auth" />
  </Auth>
</template>
<script>
import Auth from '../../../components/Auth/index'
import Page from "./page";

export default {
  components: {Page, Auth},
  data() {
    return {}
  },
  onPullDownRefresh() {
    this.$refs.page.refresh()
  },
  computed: {
    auth() {
      return this.$store.state.userInfo.auth
    }
  }
}
</script>
