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
    const userInfo = this.$store.state.userInfo.userInfo || {}
    if (res.from === 'button') {
      this.loading = true
      const invite = await Tenant.invite({
        data: {
          tenantId: tenant.tenantId,
          deptId: res.target.dataset.deptid || 0
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
      title: '道昕云',
      path: '/pages/Home/index',
      imageUrl: userInfo.logo
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
