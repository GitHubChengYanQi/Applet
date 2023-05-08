<template>
  <Auth :tenant-auth="false">
    <Page v-if="auth && tenantId" :tenantId="tenantId" />
    <Empty v-else description="未选择要加入的企业!" />
  </Auth>
</template>
<script>
import Auth from '../../components/Auth/index'
import Page from "./page";
import Empty from "../../components/Empty";

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
  components: {Empty, Page, Auth},
  data() {
    return {
      tenantId: ''
    }
  },
  computed: {
    auth() {
      return this.$store.state.userInfo.auth
    }
  }
}
</script>
