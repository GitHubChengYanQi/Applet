<template>
  <view>
    <view class="login">
      <view class="logo">
        <img src="../../static/images/logo.png" alt="">
      </view>
      <view class="login2">
        <view class="text">欢迎使用浑河云</view>
        <view>
          <button :loading="loading" type="default" open-type="getPhoneNumber" @getphonenumber="getphonenumber">
            手机号授权登录
          </button>
        </view>
        <view class="technology">本小程序为沈阳浑河工业有限责任公司内部办公终端，请登录后使用。</view>
      </view>
    </view>

    <Modal ref="modal" />


  </view>
</template>
<script>
import {getLocalParmas, routeReplace} from "../../util/Tools";
import {Login} from "MES-Apis/lib/Login/promise";
import GetUserInfo from "../../util/GetUserInfo";
import {Message} from "../../components/Message";
import Icon from "../../components/Icon";
import Modal from "../../components/Modal";


export default {
  components: {Modal, Icon},
  data() {
    return {
      username: '',
      password: '',
      loading: false,
      isLogin: false,
    }
  },
  created() {
    const userInfo = GetUserInfo().userInfo || {};
    if (userInfo.userId) {

    }
  },
  mounted() {

  },
  methods: {
    getphonenumber(res) {
      const _this = this
      if (res.detail.errMsg === "getPhoneNumber:ok") {
        uni.checkSession({
          success: (checkRes) => {
            this.loading = true
            Login.loginByPhone({encryptedData: res.detail.encryptedData, iv: res.detail.iv}, {
              onSuccess: (res) => {
                getApp().globalData.token = res
                _this.$store.commit('userInfo/clear')
                _this.goBack()
              },
              onError: () => {
                _this.loginError()
              }
            }).finally(() => {
              this.loading = false
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
      this.$refs.modal.dialog({
        title: '登录失败！'
      })
    },
    goBack() {
      const backUrl = getLocalParmas().search.backUrl
      uni.reLaunch({
        url: backUrl ? routeReplace(backUrl) : '/pages/Home/index'
      })
    }
  },
}
</script>

<style lang="scss">

.title {
  margin-right: 5px;
}

body {
  background-image: url('@/static/images/login.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
}


.login {
  padding: 53px 20px;
  height: 100vh;

  image {
    width: 100%;
    height: 100%;
  }

  .logo {
    width: 87px;
    height: 87px;
    margin: auto;
  }

  .login2 {
    padding: 0 28px;
    border-radius: 8px;
    background-color: rgba(255, 255, 255, 0.9);

    .uni-input {
      width: 100%;
      font-size: 14px;
      background-color: #e1ebf6;
    }

    .text {
      padding: 33px 0 16px;
      text-align: center;
      font-size: 16px;
    }

    button {
      padding: 5px 0;
      font-size: 14px;
      color: #fff;
      background-color: #2680eb;
      //margin: 27px 0 52px 0;
    }


    .technology {
      text-align: center;
      font-size: 12px;
      color: #999999;
      margin-top: 39px;
      padding-bottom: 23px;
    }
  }
}

</style>
