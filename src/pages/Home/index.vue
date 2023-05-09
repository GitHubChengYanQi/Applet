<template>
  <Auth>
    <Page v-if="auth" />
  </Auth>
</template>
<script>
import Page from "./page";
import Auth from "../../components/Auth";

export default {
  components: {Auth, Page},
  onPullDownRefresh() {
    setTimeout(function () {
      uni.stopPullDownRefresh();
    }, 1000);
  },
  data() {
    return {}
  },
  onShareAppMessage() {
    const tenant = this.$store.state.userInfo.tenant || {}
    return {
      title: tenant.name || '道昕云',
      path: '/pages/Home/index?shareTenantId=' + tenant.tenantId,
      imageUrl: tenant.imgLogo
    }
  },
  computed: {
    auth() {
      return this.$store.state.userInfo.auth
    }
  }
}
</script>
