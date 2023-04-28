<template>
  <Auth>
    <Page ref="stock" v-if="auth" @refreshDone="refreshDone" />
  </Auth>
</template>
<script>
import Auth from '../../components/Auth'
import Page from "./page";

export default {
  components: {Page, Auth},
  onPullDownRefresh() {
    this.$refs.stock.refresh()
  },
  data() {
    return {}
  },
  methods: {
    refreshDone() {
      uni.stopPullDownRefresh();
    }
  },
  computed: {
    auth() {
      return this.$store.state.userInfo.auth
    }
  }
}
</script>
