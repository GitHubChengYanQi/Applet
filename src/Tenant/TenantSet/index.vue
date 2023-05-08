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
    if (res.from === 'button') {
      const userInfo = this.$store.state.userInfo.userInfo || {}
      return {
        title: userInfo.name + '邀请您加入团队：' + tenant.name,
        path: `/Tenant/JoinTenant/index?tenantId=${tenant.tenantId}`,
        imageUrl: tenant.imgLogo
      }
    }
    return {
      title: tenant.name || '道昕云',
      imageUrl: url
    }
  },
  computed: {
    auth() {
      return this.$store.state.userInfo.auth
    }
  }
}
</script>
