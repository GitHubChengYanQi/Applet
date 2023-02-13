<template>
	<view class=""><movable-area>
		<view class="tab">
			<view class="tabCheck2" :class="curr==0 ? 'tabCheck' : ''" data-index="0" @tap="setCurr">一键备料</view>
			<view class="tabCheck2" :class="curr==1 ? 'tabCheck' : ''" data-index="1" @tap="setCurr">单独备料</view>
		</view>
		<scroll-view v-if="curr==0">
			<view class="list">
				
				<view class="list2">
					<view class="text">主题：123</view>
					<view class="text">负责人：程彦祺</view>
					<view class="text">类型：生产任务</view>
					<view class="text">注意事项：无</view>
					<view class="text">备注：无</view>
				</view>
				
				<view class="list2">
					<view class="text">订单编号：23020200005</view>
					<view class="text">申请时间：02月02日 09:44</view>
				</view>
				
				<view class="row">
					<view class="text1">物料</view>
					<view class="text2">申请数量</view>
				</view>
				
				<view class="list2">
					<view class="row">
						<view class="text3">带养护周期的物料 / 母鸡 / 木有</view>
						<view class="number">× 5</view>
					</view>
				</view>
				
				<view class="text4">
					合计：&nbsp;&nbsp;1类&nbsp;&nbsp;5件
				</view>
		
				<view class="goods-carts">
					<uni-goods-nav :fill="true" :options="options" :button-group="customButtonGroup1"  @tap='tips'/>
				</view>
				
			</view>	
		</scroll-view>
		
		<scroll-view v-if="curr==1">
			<view class="list3">
				<view class="">
					搜索
				</view>
					<swiper>
						<swiper-item>
							<view class="list4">
								<view class="material">
									<view class="material2">可备料</view>
								</view>
								<!-- 右 -->
								<view class="a">
									<!-- 右上 -->
										<view class="overview2">
											<view class="headPortrait3">
												<img src="/static/logo.png" alt="" >
												<view class="quantity">306台</view>
											</view>
											<view class="describe">
												<view class="">带养护周期的物料</view>
												<view class="grey">母鸡/木有</view>
												<view class="mini">浑河库存</view>
												<view class="mini">库位</view>
											</view>
											<view class="number">
												×5
											</view>
										</view>
									<view class="">
										<view class="progress-box">
											<view class="grayLine">
												<view class="blueLine" :style="{width:decimalToPercent()}"></view>
											</view>
										</view>
										<view class="progress-box2">
											<view class="progress-box3">
												<view class="colorCard"></view>
												<view class="">可领&nbsp;{{collectable}}</view>
											</view>
											<view class="progress-box3">
												<view class="colorCard2"></view>
												<view class="">未备&nbsp;{{unclaimed}}</view>
											</view>
										</view>
									</view>
								</view>
							</view>
						</swiper-item>
					</swiper>
					
				<view class="none">
					没有更多了
				</view>
			</view>
		</scroll-view>
		
			<movable-view class="suspension" :x="x" :y="y" direction="all" @change="onChange" >
				<uni-badge :text="8" absolute="rightTop" :offset="[0, 0]" size="small">
				<view class="suspension2">
					<img src="../../../static/xuanfu.png" alt="">
				</view>
			</uni-badge>
			</movable-view>
		</movable-area>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				curr:0,
				x: 340,
				y: 680,
				old: {
					x: 0,
					y: 0,
				},
				customButtonGroup1: [{
					text: '一键备料',
					backgroundColor: '#2680eb',
					color: '#fff'
				}],
				collectable:10,
				unclaimed:20
			}
		},
		methods:{
			setCurr(e){
				let thisCurr = e.detail.current || e.currentTarget.dataset.index || 0;
				this.curr = thisCurr;
			},
			decimalToPercent(){
				let data = ((this.collectable/this.unclaimed)*100).toFixed(2)+'%'
				return data
			},
			onChange(e) {
				this.old.x = e.detail.x
				this.old.y = e.detail.y
			},
			tips(e) {
				uni.showModal({
					title: '提示',
					content: '这是一个模态弹窗',
					success: function (res) {
						if (res.confirm) {
								uni.showModal({
									title: "123",
									content: "弹窗内容，告知当前状态、信息和解决方法，描述文字尽量控制在三行内",
									showCancel: false,
									confirmText: "确定"
								})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});

			},
		}
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
	movable-area {
		height: 740px;
		width: 100%;
	}
	movable-view {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 150rpx;
		width: 150rpx;
		background-color: #007AFF;
		color: #fff;
		z-index: 1;
	}
	.a{
		width: 90%;
	}
	.tab{
		background-color: #fff;
		border-top: 1px solid #eee;
		border-bottom: 1px solid #eee;
		padding-top:8px;
		display: flex;
		position: sticky;
		top: 0;
		z-index: 1;
		
		.tabCheck2{
			margin:0 auto;
			text-align: center;
		}
		.tabCheck{
			padding-bottom: 8px;
			color: #2680eb;
			margin:0 auto;
			text-align: center;
			border-bottom: 2px solid #2680eb;
		}
	}
	.list{
		background-color: #fff;
		padding: 0 8px 60px 8px;
		
		.list2{
			border-bottom: 1px dashed #333;
			padding-top: 10px;
			padding-bottom: 2px;
		}
		.text{
			font-size: 14px;
			padding-bottom: 8px;
		}
		.text1{
			font-size: 14px;
			flex-grow: 1;
		}
		.text2{
			font-size: 14px;
		}
		.text3{
			flex-grow: 1;
		}
		.text4{
			text-align: right;
			font-size: 14px;
			padding: 8px 0;
		}
		.row{
			display: flex;
			padding: 12px 0;
			border-bottom: 1px solid #eee;
		}
		.number{
			padding: 0 8px 8px 0;
		}
	}
	.goods-carts {
		box-shadow: 0 0 10px 2px #ccc;
		position: fixed;
		left: 0;
		right: 0;
		padding: 5px 0;
		background-color: #fff;
		bottom: 0;
	}
	.list3{
		background-color: #fff;
		padding: 12px 0;
		
		.list4{
			display: flex;
			
			.material{
				width: 4%;
				padding-left:4px;
				display: flex;
				color: #fff;
				font-size: 12px;
				position: relative;
				background-color: #2680eb;
				.material2{
					position: absolute;
					top: 50%;
					left: 50%;
					transform:translate(-50%,-50%),
				}
			}
		}
	}
	.overview2{
		width: 100%;
		background-color: #fff;
		display: flex;
		padding: 15px 12px 8px 12px;
	}
	.headPortrait3{
		width: 72px;
		height: 72px;
		border-radius: 2px;
		overflow: hidden;
		position: relative;
		.quantity{
			height: 16px;
			width: 100%;
			font-size: 12px;
			text-align: center;
			color: #fff;
			position: absolute;
			bottom: 0;
			border-radius: 0 0 2px 2px;
			background-color: rgba(0, 0, 0, 0.4);
		}
	}
	.describe{
		flex-grow: 1;
		padding: 0 12px;
		font-size: 14px;
	}
	.grey{
		color: #808080;
	}
	.mini{
		font-size: 12px;
		padding:1px 0;
	}
	.number{
		font-size: 14px;
		margin: auto 10px;
		letter-spacing: 2px;
	}
	.none{
		font-size: 14px;
		color: #808080;
		text-align: center;
		padding: 15px;
	}
	.progress-box{
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin:10px 12px 5px 12px;
		width: 100%;
	
	 .grayLine {
		height: 8px;
		width: 100%;
		background: #E8E8E8;
		border-radius: 4px;
		.blueLine {
			border-radius: 4px;
			background: #D3E7FD;
			height: 100%;
		}
	}
	}
	.progress-box2{
		display: flex;
		font-size: 12px;
		margin-bottom: 10px;
		width: 100%;
		.progress-box3{
			display: flex;
			margin: 0 12px;
			.colorCard{
				margin: auto 5px;
				background-color: #D3E7FD;
				width: 8px;
				height: 8px;
				border-radius: 50%;
			}
			.colorCard2{
				margin: auto 5px;
				background-color: #E8E8E8;
				width: 8px;
				height: 8px;
				border-radius: 50%;
			}
		}
		
	}
	.suspension{
		width: 42px;
		height: 42px;
		border-radius: 50%;
		background-color: #e1ebf6;
			
		.suspension2{
			width: 24px;
			height:18px;
		}
	}
		
</style>