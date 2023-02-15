<template>
	<view>
		<view class="choice">
			<view class="symbol">*</view>
			<view class="text">物料分类：</view>
			<view class="input">
				<van-field
				  :value="fieldValue"
				  is-link
				  placeholder="请选择所在地区"
				  @focus='onClick'
				/>
				
				<van-popup :show="show" round position="bottom">
				  <van-cascader
				    title="请选择所在地区"
				    :options="candidates"
				    bind:close="onClose"
				    bind:finish="onFinish"
				  />
				</van-popup>
				
				<!-- <uni-combox :candidates="candidates" placeholder="请选择所属分类" v-model="classification"></uni-combox> -->
			</view>
		</view>
		<view class="choice">
			<view class="text">物料编码：</view>
			
		</view>
	</view>
</template>

<script>
	import Auth from '../../../../components/Auth';
	import {getLocalParmas} from '../../../../util/Tools/index.js'
	export default {
			components:{},
			data() {
				return {
					fieldValue: '',
					show:false,
					candidates: [
						{
							text: '浙江省',
							value: '330000',
							children: [{ text: '杭州市', value: '330100' }],
						  },
						  {
							text: '江苏省',
							value: '320000',
							children: [{ text: '南京市', value: '320100' }],
						  },
					],
					// ['标准件', '产成品', '外购件', '物料MD5验证', '测试物料表单', '零件'],
					
				}
			},
			methods:{
				logined() {
				  // this.getTaskDetail()
				},
				notLogin() {
				  uni.redirectTo({
					url: `/pages/login/index?backUrl=${getLocalParmas().route}`,
				  })
				},
				onClick(){
					console.log(1)
					this.show=true;
				}
			},
		}
</script>

<style lang="scss">
	.choice{
		display: flex;
		justify-content: flex-end;
		padding: 10px;
		.input{
			width: 65%;
		}
		.symbol{
			color: #ff4d4f;
			line-height: 36px;
			margin:2px 5px;
		}
		.text{
			line-height: 36px;
			font-size: 14px;
		}
	}

</style>