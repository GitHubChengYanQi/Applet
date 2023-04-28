<template>
  <Auth>
    <Page v-if="auth" />
  </Auth>
</template>
<script>
import Auth from '../../components/Auth/index'
import Page from "./page";

export default {
  onShow() {
    // uni.navigateTo({
    //   url: '/User/UserList/index'
    // })
    // uni.showModal({
    //   title: '提示',
    //   content: '当前页面有未保存的数据，您确定要取消吗？',
    //   success: function (res) {
    //     if (res.confirm) {
    //       uni.setStorageSync('product', '');
    //     } else if (res.cancel) {
    //
    //     }
    //   }
    // });
  },
  components: {Page, Auth},
  data() {
    return {}
  },
  onShareAppMessage(res) {
    if (res.from === 'button') {
      const userInfo = this.$store.state.userInfo.userInfo || {}
      const tenant = this.$store.state.userInfo.tenant || {}
      return {
        title: userInfo.name + '邀请您加入团队：' + tenant.name,
        path: `/Tenant/JoinTenant/index?tenantId=${tenant.tenantId}`,
        imageUrl: '../../static/images/tenant/logo.png'
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
