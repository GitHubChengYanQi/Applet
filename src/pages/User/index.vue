<template>
  <Auth>
    <Page v-if="auth" />
    <van-dialog id="van-dialog" />
  </Auth>
</template>
<script>
import Auth from '../../components/Auth/index'
import Page from "./page";

export default {
  components: {Page, Auth},
  data() {
    return {}
  },
  onShareAppMessage(res) {
    if (res.from === 'button') {
      return {
        title: '浑河工业',
        path: '/pages/Home/index',
        imageUrl: '../../static/images/logo.png'
      }
    }
  },
  computed: {
    auth() {
      return this.$store.state.userInfo.auth
    }
  }
}
</script>
