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

export default {
  name: 'Auth',
  props: {
    auth: {
      type: Boolean,
      default() {
        return true
      }
    }
  },
  components: {Error, Loading},
  data() {
    return {
      loading: false,
      error: false,
      height: 0
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

        if (!this.auth) {
          this.authSuccess()
          return
        }

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
        uni.reLaunch({
          url: `/pages/login/index?backUrl=${getLocalParmas().route}`,
        })
      } else {
        await this.getSystemInfo()
        this.authSuccess()
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
    }
  }
}
</script>
