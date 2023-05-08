<template>
  <Auth :tenant-auth="false">
    <Page v-if="auth && tenantId" :tenantId="tenantId" :deptId="deptId" />
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
    let deptId = ''
    if (option.scene) {
      tenantId = option.scene.split('deptId')[0]
      deptId = option.scene.split('deptId')[1] || 0
    } else if (option.tenantId) {
      tenantId = option.tenantId
      deptId = option.deptId || 0
    }
    this.tenantId = tenantId
    this.deptId = deptId
  },
  components: {Empty, Page, Auth},
  data() {
    return {
      tenantId: '',
      deptId: 0
    }
  },
  computed: {
    auth() {
      return this.$store.state.userInfo.auth
    }
  }
}
</script>
