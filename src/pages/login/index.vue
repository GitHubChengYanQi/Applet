<template>
	<view>
		
		<!-- <view>
			<view class="uni-form-item uni-column">
				<view class="title">姓名</view>
				<input class="uni-input" name="nickname" placeholder="请输入姓名" />
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">密码</view>
				<input class="uni-input" name="password" placeholder="请输入密码" type="password"/>
			</view>
			<view class="uni-btn-v">
				<button  @tap="login">登录</button>
			</view>
		</view> -->
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
</template>
<script>
	import graceChecker from "../../common/graceChecker.js"
	export default {
		data() {
			return {
				username:'',
				password:'',
				
			}
		},
		methods: {
			formSubmit: function(e) {
				console.log('form发生了submit事件，携带数据为：' + JSON.stringify(e.detail.value))
				//定义表单规则
				var rule = [{
						name: "username",
						checkType: "string",
						checkRule: "1,3",
						errorMsg: "姓名应为1-3个字符"
					},
					{
						name: "password",
						checkType: "string",
						checkRule: "4,6",
						errorMsg: "密码应为4-6个字符"
					}
				];
				//进行表单检查
				var formData = e.detail.value;
				var checkRes = graceChecker.check(formData, rule);
				if (checkRes) {
					this._requestPromise();
				} else {
					uni.showToast({
						title: graceChecker.error,
						icon: "none"
					});
				}
			},
			formReset: function(e) {
				console.log('清空数据')
			},

			_requestPromise() {
				uni.request({
					url: 'http://192.168.0.144/rest/login',
					method: 'POST',
					data: {
						username: this.username,
						password: this.password
					},
					success: (res) => {
						if(res.statusCode !==200){
							uni.showToast({
								title: '失败',
							});
						}else{
							uni.redirectTo({
								url:'index/index'
							})
						}
						console.log(1, res);
						// this.text = 'request success';
					},
					fail: (res) => {
						console.log(2, res);
						// this.text = 'request success';
					}
				});
			}
		},
	}
</script>

<style>
	.uni-form-item .title {
		padding: 20rpx 0;
	}
</style>
