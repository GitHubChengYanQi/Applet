<template>
  <view class="login">
	  <view class="logo">
	  	<img src="../../static/logo2.png" alt="">
	  </view>
		<view>
			<view class="text">欢迎使用浑河云</view>
		  <form @submit="formSubmit" @reset="formReset">
			<view class="uni-form-item uni-column">
			  <view class="title">姓名</view>
			  <input class="uni-input" name="username" v-model="username" placeholder="请输入姓名" />
			</view>
			<view class="uni-form-item uni-column">
			  <view class="title">密码</view>
			  <input class="uni-input" type="password" name="password" v-model="password" placeholder="请输入密码" />
			</view>
			<view class="uni-btn-v">
			  <button form-type="submit">登录</button>
			  <button type="default" form-type="reset">Reset</button>
			</view>
		  </form>
		</view>
  </view>
</template>
<script>
import graceChecker from "../../common/graceChecker.js"
import {login} from "MES-Apis/src/Login/promise";
import {getLocalParmas} from "../../util/Tools";


export default {
  mounted() {
    this.backUrl = getLocalParmas().search.backUrl
    this.requestPromise(getLocalParmas().search.backUrl)
  },
  data() {
    return {
      username: 'cheng',
      password: '2683941980',
      backUrl: '',
    }
  },
  methods: {
    formSubmit: function (e) {
      //定义表单规则
      // var rule = [{
      //   name: "username",
      //   checkType: "string",
      //   checkRule: "1,3",
      //   errorMsg: "姓名应为1-3个字符"
      // },
      //   {
      //     name: "password",
      //     checkType: "string",
      //     checkRule: "4,6",
      //     errorMsg: "密码应为4-6个字符"
      //   }
      // ];
      //进行表单检查
      var formData = e.detail.value;
      var checkRes = graceChecker.check(formData, []);
      if (checkRes) {
        this.requestPromise();
      } else {
        uni.showToast({
          title: graceChecker.error,
          icon: "none"
        });
      }
    },
    formReset: function (e) {

    },
    requestPromise(url) {
      login({
        username: this.username,
        password: this.password
      }, {
        onSuccess: (res) => {
          getApp().globalData.token = res
          uni.redirectTo({
            url: url || this.backUrl,
          })
        },
        onError: () => {
          uni.showToast({
            title: '失败',
          });
        }
      })
    }
  },
}
</script>

<style lang="scss">
.uni-form-item .title {
  padding: 20px 0;
}
body{
	background-image: url('../../static/login.png');
}
image{
	width: 100%;
	height: 100%;
}
.login{
	padding: 53px 20px;
	.logo{
		width: 87px;
		height: 87px;
		margin: auto;
	}
}

</style>
