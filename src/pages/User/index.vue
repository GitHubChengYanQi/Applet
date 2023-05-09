<template>
  <Auth>
    <Page v-if="auth" />
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
