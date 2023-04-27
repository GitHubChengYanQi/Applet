<template>
  <Auth :tenant-auth="false">
    <Page v-if="auth && tenantId" :tenantId="tenantId" />
  </Auth>
</template>
<script>
import Auth from '../../components/Auth/index'
import Page from "./page";

export default {
  onLoad(option) {
    let tenantId = ''
    if (option.scene) {
      tenantId = option.scene
    } else if (option.tenantId) {
      tenantId = option.tenantId
    }
    this.tenantId = tenantId
  },
  components: {Page, Auth},
  data() {
    return {
      tenantId: ''
    }
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
