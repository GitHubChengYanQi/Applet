<template>
	<view>
		<!-- 第一部分 -->
		<view class="overview">
			<view class="headPortrait">
				<img src="/static/logo.png" alt="" >
			</view>
			<view class="overviewText">
				<view class="boldTitle">雷敏的出库申请</view>
				<view class="batch">CK20230118001</view>
			</view>
			<view class="overviewInfo">
				<view class="state">•&nbsp;&nbsp;执行中</view>
				<view class="time">01月18日 19:53</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		name:'ApprovalHeader',
	}
</script>

<style lang="scss">
	body{
		background-color: #e1ebf6;
	}
	image{
		width: 100%;
		height: 100%;
	}
	
	.overview{
		background-color: #fff;
		border-top: 1px solid #ccc;
		display: flex;
		padding: 12px;
		.overviewText{
			padding:8px 10px 0 10px;
			flex-grow: 1;
		}
		.boldTitle{
			font-size: 14px;
			font-weight: bold;
		}
		.batch{
			font-size: 14px;
			padding-top: 8px;
		}
		.overviewInfo{
			text-align: right;
			padding:8px 0;
		}
		.state{
			font-size: 14px;
			color: #2680eb;
		}
		.time{
			color: #808080;
			font-size: 14px;
			padding-top: 8px;
		}
	}
	.headPortrait{
		width: 55px;
		height: 55px;
		border-radius: 50%;
		overflow: hidden;
	}
</style>