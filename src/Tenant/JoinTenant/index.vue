<template>
  <Auth :tenant-auth="false">
    <Page ref="page" v-if="auth && tenantId" :tenantId="tenantId" :deptId="deptId" />
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
      deptId = option.scene.split('deptId')[1]
    } else if (option.tenantId) {
      tenantId = option.tenantId
      deptId = option.deptId
    }
    getApp().globalData.shareTenantId = tenantId
    getApp().globalData.shareTenantDeptId = deptId
    this.tenantId = tenantId
    this.deptId = deptId
  },
  onPullDownRefresh() {
    this.$refs.page.refresh()
  },
  components: {Empty, Page, Auth},
  data() {
    return {
      tenantId: '',
      deptId: ''
    }
  },
  computed: {
    auth() {
      return this.$store.state.userInfo.auth
    }
  }
}
</script>
