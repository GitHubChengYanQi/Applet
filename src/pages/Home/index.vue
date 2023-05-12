<template>
  <Auth>
    <Page v-if="auth" />
    <Loading :loading="loading" />
  </Auth>
</template>
<script>
import Page from "./page";
import Auth from "../../components/Auth";
import Loading from "../../components/Loading";

export default {
  components: {Loading, Auth, Page},
  onPullDownRefresh() {
    setTimeout(function () {
      uni.stopPullDownRefresh();
    }, 1000);
  },
  data() {
    return {
      loading: false
    }
  },
  // async onShareAppMessage() {
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
  //     imageUrl: userInfo.logo
  //   }
  // },
  onShareAppMessage() {
    const userInfo = this.$store.state.userInfo.userInfo || {}
    return {
      title: '道昕云',
      path: '/pages/Home/index',
      imageUrl: userInfo.logo
    }
  },
  computed: {
    auth() {
      return this.$store.state.userInfo.auth
    }
  }
}
</script>
