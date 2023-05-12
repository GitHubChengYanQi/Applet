<template>
  <Auth :tenant-auth="false">
    <template v-if="auth">
      <Loading skeleton-type="page" skeleton v-if="loading" />
      <Page ref="page" v-else-if="tenantId" :inviter="inviter" />
      <Empty v-else description="未选择要加入的企业!" />
    </template>
  </Auth>
</template>
<script>
import Auth from '../../components/Auth/index'
import Page from "./page";
import Empty from "../../components/Empty";
import {Tenant} from "MES-Apis/lib/Tenant/promise";
import Loading from "../../components/Loading";

export default {
  onLoad(option) {
    let inviteId = ''
    if (option.scene) {
      inviteId = option.scene
    } else if (option.inviteId) {
      inviteId = option.inviteId
    }
    if (!inviteId) {
      this.loading = false
      return
    }
    getApp().globalData.shareInviteId = inviteId
    this.loading = true
    Tenant.inviteDetail({
      data: {
        tenantInviteLogId: inviteId
      }
    }).then((res) => {
      const invite = res.data || {}
      getApp().globalData.shareTenantId = invite.tenantId
      this.tenantId = invite.tenantId
      this.inviter = invite
    }).finally(() => {
      this.loading = false
    })
  },
  onPullDownRefresh() {
    this.$refs.page.refresh()
  },
  components: {Loading, Empty, Page, Auth},
  data() {
    return {
      tenantId: '',
      inviter: '',
      loading: true
    }
  },
  computed: {
    auth() {
      return this.$store.state.userInfo.auth
    }
  }
}
</script>
