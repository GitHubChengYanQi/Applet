<template>
	<view class="">
		<view class="uni-list">
			<view class="headPortrait3">
				<image src="../../static/3.png" alt="" />
				<view class="quantity">10件</view>
			</view>
			<view class="describe">
				<view>大孔过渡板</view>
				<view class="text">t5-76041l / 大孔用</view>
			</view>
		</view>
		<view class="inKindRow">
			<view class="inKindTitle">
				盘点数量
			</view>
			<button @click="">×0</button>
			<Keybord  value="1"></Keybord>
			<view class="">
				
			</view>
		</view>
	</view>
</template>

<script>
	import Keybord from "../../../../components/Keybord/index"
	export default{
		name:'StockCheck',
		components:{
			Keybord
		},
	}
</script>

<style lang="scss" scoped>
	.text{
		font-size: 16px;
		color: #808080;
	}
	.inKindRow{
		display: flex;
		.inKindTitle{
			font-size: 16px;
			width: 70px;
			margin-right: 8px;
			color: #666666;
			text-align:justify;
			text-align-last:justify;
		}
	}
</style>