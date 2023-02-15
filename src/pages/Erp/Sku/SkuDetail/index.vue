<template>
	<view>
		<view class="choice">
			<view class="symbol">*</view>
			<view class="text">物料分类：</view>
			<view class="input">
<!-- 				<uni-card>
					<text>这是一个基础卡片示例，内容较少，此示例展示了一个没有任何属性不带阴影的卡片。</text>
				</uni-card> -->
				<van-button type="default">默认按钮</van-button>
				<van-button type="default">默认按钮</van-button>
				<van-button type="primary">主要按钮</van-button>
				<van-button type="info">信息按钮</van-button>
				<van-button type="warning">警告按钮</van-button>
				<van-button type="danger">危险按钮</van-button>
				<uni-data-select></uni-data-select>
				<van-cascader
    title="请选择所在地区"
    :options="candidates"
    bind:close="onClose"
    bind:finish="onFinish"
  />
				<!-- <uni-combox :candidates="candidates" placeholder="请选择所属分类" v-model="classification"></uni-combox> -->
			</view>
		</view>
		<view class="choice">
			<view class="text">物料编码：</view>
			
		</view>
	</view>
</template>

<script>
	import {UniDataSelect} from '@dcloudio/uni-ui'
	export default {
		components:{
			UniDataSelect
		},
			data() {
				return {
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
					classification: ''
				}
			}
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