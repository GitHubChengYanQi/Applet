<template>
  <view class="login">
    <van-toast id="van-toast" />
    <van-dialog id="van-dialog" />
    <view class="logo">
      <img src="../../static/logo2.png" alt="">
    </view>
    <view class="login2">
      <view class="text">欢迎使用浑河云</view>
      <view v-if="!mobile">
        <form @submit="()=>submit()">
          <view class="login3">

            <uni-icons type="person" size="20"></uni-icons>
            <input class="uni-input" name="username" v-model="username" placeholder="请输入姓名" />
          </view>
          <view class="login3">
            <view class="title">密</view>
            <input class="uni-input" name="password" v-model="password" :password="showPassword" placeholder="请输入密码" />
            <!-- <text class="uni-icon" :class="[!showPassword ? 'uni-eye-active' : '']" @click="changePassword"></text> -->
          </view>
          <view class="uni-btn-v">
            <button :loading="loading" form-type="submit" type="default">立即登录</button>
          </view>
        </form>
        <view class="">
          <view class="forget" @click="forget">忘记登录密码</view>
        </view>
      </view>
      <view v-else>
        <button :loading="loading" type="default" open-type="getPhoneNumber" @getphonenumber="getphonenumber">手机号授权登录
        </button>
      </view>
      <view class="technology">本小程序为沈阳浑河工业有限责任公司内部办公终端，请登录后使用。</view>
    </view>
  </view>
</template>
<script>
import {getLocalParmas} from "../../util/Tools";
import {Login} from "MES-Apis/src/Login/promise";
import GetUserInfo from "../../util/GetUserInfo";
import {Message} from "../../components/Message";


export default {
  data() {
    return {
      username: 'cheng',
      password: '2683941980',
      backUrl: '',
      mobile: true,
      loading: false
    }
  },
  mounted() {
    this.backUrl = getLocalParmas().search.backUrl
    const userInfo = GetUserInfo().userInfo || {};
    this.mobile = !userInfo.mobile;
    // this.submit(getLocalParmas().search.backUrl)
  },
  methods: {
    getphonenumber(res) {
      this.loading = true
      Login.loginByPhone({encryptedData: res.detail.encryptedData, iv: res.detail.iv}, {
        onSuccess: (res) => {
          getApp().globalData.token = res
          this.mobile = false
        }
      }).finally(() => {
        this.loading = false
      })
    },
    submit(url) {
      if (!this.username) {
        return Message.errorToast('账号不能为空');
      } else if (!this.password) {
        return Message.errorToast('密码不能为空');
      }
      this.loading = true
      Login.wxCpLogin({
        username: this.username,
        password: this.password
      }, {
        onSuccess: (res) => {
          getApp().globalData.token = res
          console.log('backUrl', url)
          uni.redirectTo({
            url: (url || this.backUrl).replaceAll("%3A", ":").replaceAll("%2F", "/").replaceAll("%3F", "?").replaceAll("%3D", "=").replaceAll("%26", "&")
          })
        }
      }).finally(() => {
        this.loading = false
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
  background-image: url('@/static/login.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

image {
  width: 100%;
  height: 100%;
}

.login {
  padding: 53px 20px;

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
      padding: 33px;
      text-align: center;
      font-size: 16px;
    }

    .login3 {
      display: flex;
      padding: 16px 7px;
      border-bottom: 1px solid #D9D9D9;
    }

    button {
      padding: 5px 0;
      font-size: 14px;
      color: #fff;
      background-color: #2680eb;
      margin: 27px 0 52px 0;
    }

    .forget {
      font-size: 12px;
      color: #999999;
      text-align: center;
    }

    .forget::before, .forget::after {
      content: '';
      display: inline-block;
      border-bottom: 1px solid #ACACAC;
      width: 43px;
      margin: 4px 16px;

    }

    .technology {
      text-align: center;
      font-size: 12px;
      color: #999999;
      margin-top: 39px;
      padding-bottom: 23px;

      .link {
        font-size: 12px;
        color: #2680eb;
      }
    }

    .uni-eye-active {
      color: #007AFF;
    }

    .uni-icon {
      font-family: uniicons;
      font-size: 24px;
      font-weight: normal;
      font-style: normal;
      width: 24px;
      height: 24px;
      line-height: 24px;
      color: #999999;
    }
  }
}

</style>
