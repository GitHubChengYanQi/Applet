<template>
  <view>
    <Loading v-if="loading" :skeleton="true" skeleton-type="page" />
    <Error v-else-if="error" />
    <slot v-else></slot>
  </view>
</template>

<script>
import Loading from "../Loading";
import Error from "../../pages/Error";
import GetUserInfo from "../../util/GetUserInfo";
import {Login} from "MES-Apis/lib/Login/promise";
import {getLocalParmas} from "../../util/Tools";
import MyButton from "../MyButton";
import LinkButton from "../LinkButton";

export default {
  name: 'Auth',
  props: {
    tenantAuth: {
      type: Boolean,
      default() {
        return true
      }
    }
  },
  components: {LinkButton, MyButton, Error, Loading},
  data() {
    return {
      loading: true,
      error: false,
    }
  },
  mounted() {
    this.authInfo()
  },
  methods: {
    async authInfo() {
      this.loading = true
      try {
        await this.$store.dispatch('userInfo/getPublicInfo')
        await this.$store.dispatch('systemInfo/getSystemInfo')

        const token = GetUserInfo().token;
        if (token) {
          this.tokenAuth()
        } else {
          const _this = this
          uni.login({
            success: function (loginRes) {
              if (loginRes.errMsg === 'login:ok') {
                Login.codeToSession({code: loginRes.code}, {
                  onSuccess: (token) => {
                    getApp().globalData.token = token
                    _this.tokenAuth()
                  },
                  onError: () => {
                    _this.authError()
                  }
                })
              } else {
                _this.authError()
              }
            },
            fail(res) {
              _this.authError()
            }
          });
        }
      } catch (e) {
        this.authError()
      }
    },
    async tokenAuth() {
      const userInfo = GetUserInfo().userInfo || {};
      console.log(userInfo)
      const tenantId = userInfo.tenantId
      const userId = !!userInfo.userId;
      if (tenantId || !this.tenantAuth) { // 有租户直接进入 或 不需要验证租户的页面
        try {
          if (userId) {
            await this.getSystemInfo()
          }
          this.authSuccess()
        } catch (e) {
          this.authError()
        }
      } else if (tenantId === -1 && userId) {     // 有其他租户
        this.authSuccess()
        uni.reLaunch({
          url: `/Tenant/SwitchTenant/index?backUrl=${getLocalParmas().stringRoute}`,
        })
      } else { // 没租户
        uni.reLaunch({
          url: `/Tenant/InitTenant/index?backUrl=${getLocalParmas().stringRoute}`,
        })
      }
    },
    authSuccess() {
      this.$store.commit('userInfo/authStatus', true)
      this.$store.commit('userInfo/refresh', false)
      this.loading = false
    },
    authError() {
      this.$store.commit('userInfo/authStatus', false)
      this.$store.commit('userInfo/refresh', false)
      this.loading = false
      this.error = true
    },
    async getSystemInfo() {
      await this.$store.dispatch('userInfo/getUserInfo')
      await this.$store.dispatch('userInfo/getHomeMenus')
    }
  }
}
</script>
