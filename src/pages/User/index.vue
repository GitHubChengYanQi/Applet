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
  onShareAppMessage() {
    const userInfo = this.$store.state.userInfo.userInfo || {}
    return {
      title: '道昕云',
      path: '/pages/Home/index',
      imageUrl: userInfo.logo
    }
  },
  // async onShareAppMessage(res) {
  //   const tenant = this.$store.state.userInfo.tenant || {}
  //   this.loading = true
  //   const invite = await Tenant.invite({
  //     data: {
  //       tenantId: tenant.tenantId,
  //     }
  //   }).finally(() => {
  //     this.loading = false
  //   })
  //   return {
  //     title: tenant.name || '道昕云',
  //     path: '/pages/Home/index?shareTenantId=' + tenant.tenantId + `&inviteId=${invite.data}`,
  //     imageUrl: tenant.imgLogo
  //   }
  // },
  computed: {
    auth() {
      return this.$store.state.userInfo.auth
    }
  }
}
</script>
