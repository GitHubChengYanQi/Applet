<template>
  <Auth>
    <Page ref="page" v-if="auth" />
  </Auth>
</template>
<script>
import Auth from '../../components/Auth'
import Page from "./page";

export default {
  components: {Page, Auth},
  onPullDownRefresh() {
    this.$refs.page.refresh()
  },
  data() {
    return {}
  },
  methods: {
  },
  computed: {
    auth() {
      return this.$store.state.userInfo.auth
    }
  }
}
</script>
