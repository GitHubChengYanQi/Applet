<template>
  <Auth>
    <Page
        v-if="auth"
        :checdUsers="checkUsers"
        :type="type"
        :show="show"
    />
    <Loading :loading="loading" />
  </Auth>
</template>
<script>
import Auth from '../../components/Auth/index'
import Page from "./page";
import {getLocalParmas} from "../../util/Tools";
import {Tenant} from "MES-Apis/lib/Tenant/promise";
import Loading from "../../components/Loading";

export default {
  components: {Loading, Page, Auth},
  onLoad(option) {
    // uni.enableAlertBeforeUnload({
    //   message: '请您填写数据',
    //   success:()=>{}
    // })
    this.type = option.type // 选择用户
    this.show = !option.type // 查看用户列表
    const curren = this
    const eventChannel = curren.getOpenerEventChannel();
    if (typeof eventChannel.on === "function") {
      eventChannel.on('checkUsers', function (data) {
        curren.checkUsers = data.checkUsers || []
      })
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
          deptId: res.target.dataset.deptid
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
  data() {
    return {
      checkUsers: [],
      type: '',
      show: false,
      loading: false
    }
  },
  computed: {
    auth() {
      return this.$store.state.userInfo.auth
    }
  },
  methods: {}
}
</script>
