<template>
  <view class="login">
	  <view class="logo">
	  	<img src="../../static/logo2.png" alt="">
	  </view>
		<view class="login2">
			<view class="text">欢迎使用浑河云</view>
		  <form @submit="formSubmit">
			<view class="login3">
				
			  <uni-icons  type="person" size="20"></uni-icons>
			  <input class="uni-input" name="username" v-model="username" placeholder="请输入姓名" />
			</view>
			<view class="login3">
			  <view class="title">密</view>
			  <input class="uni-input" name="password" v-model="password" :password="showPassword" placeholder="请输入密码" />
			  <!-- <text class="uni-icon" :class="[!showPassword ? 'uni-eye-active' : '']" @click="changePassword"></text> -->
			</view>
			<view class="uni-btn-v">
			  <button form-type="submit" type="default">立即登录</button>
			</view>
		  </form>
		  <view class="">
		  	<view class="forget" @click="forget">忘记登录密码</view>
		  </view>
			<view class="technology">本系统由<span class='link'>道昕网络</span>提供技术支持</view>
			
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
	  showPassword: true,
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
	changePassword() {
	    this.showPassword = !this.showPassword;
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
    },
	
	forget(){
		uni.showModal({
			content: "请联系管理员",
			showCancel: false,
			confirmText: "确定"
		});
	}
  },
}
</script>

<style lang="scss">
	
.title {
  margin-right: 5px;
}
body{
	background-image: url('@/static/login.png');
	background-repeat: no-repeat;
	background-size: 100% 100%;
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
	.login2{
		padding: 0 28px;
		border-radius: 8px;
		background-color: rgba(255, 255, 255, 0.9);
	
		.uni-input{
			width: 100%;
			font-size: 14px;
			background-color: #e1ebf6;
		}
		.text{
			padding: 33px;
			text-align: center;
			font-size: 16px;
		}
		.login3{
			display: flex;
			padding: 16px 7px;
			border-bottom: 1px solid #D9D9D9;
		}
		button{
			padding: 5px 0;
			font-size: 14px;
			color: #fff;
			background-color: #2680eb;
			margin: 27px 0 52px 0;
		}
		.forget{
			font-size: 12px;
			color: #999999;
			text-align: center;
		}
		.forget::before,.forget::after{
			content: '';
			display: inline-block;
			border-bottom: 1px solid #ACACAC;
			width: 43px;
			margin:4px 16px;
			
		}
		.technology{
			text-align: center;
			font-size: 12px;
			color: #999999;
			margin-top: 39px;
			padding-bottom: 23px;
			.link{
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
