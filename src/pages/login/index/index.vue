<template>
	<view class="box">
		<view class="box1">
			<!-- <uni-section class="mb-10" title="竖线装饰" type="line"></uni-section> -->
			<view class="box3">待选字段</view>
			<view class="">
				<uni-search-bar radius="5" placeholder="搜索" clearButton="auto" cancelButton="none" @confirm="search"  bgColor="#ffff7f"/>
				<uni-card>
					<text>123456</text>
				</uni-card>
			</view>
		</view>
		<view class="box2">
			<view class="box4">
				<view class="ctrl">pc端</view>
				<view class="ctrl">移动端</view>
				<view class="box5">
					页面宽：<input class="kuang" type="number"  value="100"/>
					 <uni-data-select
						v-model="value"
						:localdata="range"
						@change="change"
						:clear="false"
					  ></uni-data-select>
				</view>
				<view class="box5">
					间距：<input class="kuang" type="number"  value="16"/>
					<view class="box6">px</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				 value: 0,
				        range: [
				          { value: 0, text: "%" },
				          { value: 1, text: "vw" },
				          { value: 2, text: "px" },
				        ],
			}
		},
		onLoad() {

		},
		methods: {
			search(res) {
					uni.showToast({
						title: '搜索：' + res.value,
						icon: 'none'
					})
				},
		}
	}
</script>

<style>
	.box{
		display: flex;
	}
	.box1{
		border-left: 1px solid #333;
		padding:10px 24px ;
		width: 25%;
		background-color:#ffaaff
	}
	.box2{
		width: 100%;
		background-color: aquamarine;
	}
	.box3{
		padding:8px 16px ;
		border-left-style: solid;
		border-left-color: #55ff7f;
		border-left-width: 2px;
	}
	.kuang{
		border:1px solid #f0f0f0;
		border-right: 0 ;
		height: 32px;
		padding: 0 5px;
	}
	.uni-stat__select{
		width: 50px;
		height: 35px;
		padding: auto;
	}
	.box4{
		display: flex;
		padding:10px 24px 0 24px;
		border: 1px solid #333;
	}
	.ctrl{
		padding: 12px 0;
		margin-right: 32px;
		border-bottom: 1px solid #ffaaff;
	}
	.box5{
		padding: 8px 0;
		display: flex;
		align-items: center;
	}
	.box6{
		border:1px solid #f0f0f0;
		padding: 5px 11px;
	}
</style>
