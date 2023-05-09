<template>
  <Auth>
    <Page v-if="auth" />
    <Loading :loading="loading" />
  </Auth>
</template>
<script>
import Auth from '../../components/Auth/index'
import Page from "./page";
import {Tenant} from "MES-Apis/lib/Tenant/promise";
import Loading from "../../components/Loading";

export default {
  components: {Loading, Page, Auth},
  data() {
    return {
      loading: false
    }
  },
  async onShareAppMessage(res) {
    const tenant = this.$store.state.userInfo.tenant || {}
    if (res.from === 'button') {
      const userInfo = this.$store.state.userInfo.userInfo || {}
      this.loading = true
      const invite = await Tenant.invite({
        data: {
          inviterUser: userInfo.id,
          type: '邀请',
          tenantId: tenant.tenantId,
        }
      }).finally(() => {
        this.loading = false
      })
      return {
        title: userInfo.name + '邀请您加入团队：' + tenant.name,
        path: `/Tenant/JoinTenant/index?inviteId=${invite.data}`,
        imageUrl: tenant.imgLogo
      }
    }
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
