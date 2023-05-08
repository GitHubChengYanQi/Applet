<template>
  <view>
    <button
        class="loginByPhone"
        :disabled="disabled"
        :loading="loading"
        size="mini"
        :open-type="isLogin ? '' : 'getPhoneNumber'"
        @click="click"
        @getphonenumber="getphonenumber"
    >
      <slot>登录</slot>
    </button>

    <Modal ref="modal" />

    <Loading :loading="loginLoading" />
  </view>
</template>

<script>
import GetUserInfo from "../../util/GetUserInfo";
import {Login} from "MES-Apis/lib/Login/promise";
import Modal from "../Modal";
import Loading from "../Loading";

export default {
  name: 'LoginByPhone',
  components: {Loading, Modal},
  props: ['loading', 'disabled'],
  data() {
    return {
      isLogin: false,
      loginLoading: false
    }
  },
  mounted() {
    const userInfo = GetUserInfo().userInfo || {};
    this.isLogin = !!userInfo.userId
  },
  methods: {
    click() {
      if (this.isLogin) {
        this.$emit('click')
      }
    },
    getphonenumber(res) {
      const userInfo = GetUserInfo().userInfo || {};
      if(!!userInfo.userId){
        _this.isLogin = true
        _this.$emit('click')
        return
      }
      const _this = this
      if (res.detail.errMsg === "getPhoneNumber:ok") {
        this.loginLoading = true
        uni.checkSession({
          success: () => {
            Login.loginByPhone({encryptedData: res.detail.encryptedData, iv: res.detail.iv}, {
              onSuccess: (res) => {
                getApp().globalData.token = res
                // _this.$store.commit('userInfo/clear')
                _this.loginLoading = false
                _this.isLogin = true
                _this.$emit('click')
              },
              onError: () => {
                _this.loginError()
              }
            })
          },
          fail: () => {
            uni.login({
              success: function (loginRes) {
                if (loginRes.errMsg === 'login:ok') {
                  Login.codeToSession({code: loginRes.code}, {
                    onSuccess: (token) => {
                      getApp().globalData.token = token
                      _this.getphonenumber()
                    },
                    onError: () => {
                      _this.loginError()
                    }
                  })
                } else {
                  _this.loginError()
                }
              },
              fail: () => {
                _this.loginError()
              }
            });
          },
        })
      }
    },
    loginError() {
      this.loginLoading = false
      this.$refs.modal.dialog({
        title: '登录失败！'
      })
    },
  }
}
</script>
