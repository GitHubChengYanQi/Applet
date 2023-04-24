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
import {User} from "MES-Apis/lib/User/promise";
import MyButton from "../MyButton";
import LinkButton from "../LinkButton";

export default {
  name: 'Auth',
  props: {
    loginAuth: {
      type: Boolean,
      default() {
        return true
      }
    },
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
      height: 0,
    }
  },
  mounted() {
    this.authInfo()
  },
  // watch: {
  // '$store.state.userInfo.refresh': {
  //   handler(value) {
  //     if (value) {
  //       this.authInfo()
  //     }
  //   },
  //   deep: true
  // }
  // },
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
      const userId = !!userInfo.userId;
      if (!userId) {
        if (!this.loginAuth) {
          this.notLogin()
        } else {
          uni.reLaunch({
            url: `/pages/login/index?backUrl=${getLocalParmas().stringRoute}`,
          })
        }
      } else {
        try {
          const userInfo = this.$store.state.userInfo.userInfo || {}
          let tenantId = userInfo.tenantId
          if (Object.keys(userInfo).length === 0) {
            const userRes = await User.getUserInfo()
            const user = userRes.data || {}
            this.$store.commit('userInfo/setUserInfo', user)
            tenantId = user.tenantId
            this.$store.commit('userInfo/setTenant', {tenantId: user.tenantId, name: user.tenantName})
          }


          if (tenantId || !this.tenantAuth) {
            await this.getSystemInfo()
            this.authSuccess()
          } else {
            uni.reLaunch({
              url: `/Tenant/CreateTenant/index?backUrl=${getLocalParmas().stringRoute}`
            })
          }
        } catch (e) {
          this.authError()
        }

      }
    },
    authSuccess() {
      this.$store.commit('userInfo/authStatus', true)
      this.$store.commit('userInfo/refresh', false)
      this.loading = false
    },
    notLogin() {
      this.$store.commit('userInfo/authStatus', false)
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

    }
  }
}
</script>
