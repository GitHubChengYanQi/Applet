<template>
  <Auth>
    <Page
        v-if="auth"
        :checdUsers="checkUsers"
        :type="type"
        :show="show"
    />
  </Auth>
</template>
<script>
import Auth from '../../components/Auth/index'
import Page from "./page";
import {getLocalParmas} from "../../util/Tools";

export default {
  components: {Page, Auth},
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
      return {
        title: userInfo.name + '邀请您加入团队：' + tenant.name,
        path: `/Tenant/JoinTenant/index?tenantId=${tenant.tenantId}&deptId=${res.target.dataset.deptid}`,
        imageUrl: tenant.imgLogo
      }
    }
    return {
      title: tenant.name || '道昕云',
      imageUrl: url
    }
  },
  data() {
    return {
      checkUsers: [],
      type: '',
      show: false,
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
