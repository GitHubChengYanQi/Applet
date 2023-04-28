<template>
	<view class="">
		<view class="tab">
			<view class="tabCheck2" :class="curr==0 ? 'tabCheck' : ''" data-index="0" @tap="setCurr">基本信息</view>
			<view class="tabCheck2" :class="curr==1 ? 'tabCheck' : ''" data-index="1" @tap="setCurr">动态日志</view>
			<view class="tabCheck2" :class="curr==2 ? 'tabCheck' : ''" data-index="2" @tap="setCurr">关联单据</view>
		</view>
		<scroll-view v-if="curr==0">
			<uni-section title="物料明细" type="line" style="margin-bottom: 3px;">
					<view class="details0">
						<view class="details">
							<view class="headPortrait3">
								<img src="/static/images/tenant/logo.png" alt="" >
								<view class="quantity">306台</view>
							</view>
							<view class="describe">
								<view class="">
									电缆
								</view>
								<view class="describe2">
									BVR-1-蓝
								</view>
								<view class="describe3">
									天地银行
								</view>
								<view class="describe3">
									无品牌
								</view>
							</view>
							<view class="">
								<view class="number">
									× 1
								</view>
								<view class="state">
									·  处理中
								</view>
								<view class="button">
									处理
								</view>
							</view>
						</view>

						<view class="details1">
							<view class="describe1">
								申请总数：1
							</view>
							<view class="">
								其他异常：<span style="color: #ff8f1f;">1</span>
							</view>
						</view>
					</view>
				</uni-section>
			<view class="space"></view>

			<uni-section title="来源" type="line" style="margin-bottom: 3px;">
				<view class="source">
					<uni-link showUnderLine="false" href="https://uniapp.dcloud.io/" text="程彦祺发起的入库异常 / 221119001" color="#007BFF"></uni-link>
				</view>
			</uni-section>
			<view class="space"></view>

			<uni-section title="审批流程" type="line" style="margin-bottom: 3px;">
					<view class="remarks">
						<UniSetpsD :options="list2" active-icon="checkbox" :active="active" direction="column" />
					</view>
				</uni-section>
			<view class="space"></view>

			<view class="comment">
				<uni-icons type="compose" size="20"></uni-icons>
				添加评论
			</view>
		</scroll-view>
		<scroll-view v-if="curr==1">

		</scroll-view>
		<scroll-view v-if="curr==2">
			789
		</scroll-view>
	</view>
</template>

<script>
	import UniSetpsD from "@/components/uni-steps-d/uni-steps-d.vue"
	export default{
		components:{
			UniSetpsD
		},
		data() {
			return {
				curr:1,
				list2: [{
					title: '发起人',
					desc: '雷敏',
					time:'2022-11-12'
				}, {
					title: '卖家发货',
					desc: '雷敏',
					time: '2018-11-12'
				}],
			}
		},
		methods:{
			setCurr(e) {
				// console.log(e.detail.current)
				let thisCurr = e.detail.current || e.currentTarget.dataset.index || 0;
				// console.log(thisCurr)
				this.curr = thisCurr;
			}
		}
	}
</script>

<style lang="scss">
	.space{
		height: 2px;
	}
	.tab{
		background-color: #e1ebf6;
		padding-top: 8px;
		display: flex;
		position: sticky;
		top: 0;
		z-index: 1;
	}
	.tabCheck{
		padding-bottom: 8px;
		color: #2680eb;
		margin:0 auto;
		text-align: center;
		font-size: 14px;
		border-bottom: 2px solid #2680eb;
	}
	.tabCheck2{
		padding-bottom: 8px;
		margin: auto;
		text-align: center;
		font-size: 14px;
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
	.details{
		display: flex;
		padding: 10px 15px;
	}
	.details1{
		display: flex;
		padding: 0 0 10px 15px;
		border-bottom: 1px solid #f5f5f5;
	}
	.details0{
		padding-bottom: 20px;
	}
	.describe{
		padding-left: 12px;

		flex-grow: 1;
		font-size: 14px;
		.describe2{
			color: #808080;
			padding-bottom: 2px;
		}
		.describe3{
			color: #808080;
			font-size: 12px;
			padding-bottom: 2px;
		}
	}
	.describe1{
		width: 50%;
	}
	.number{
		text-align: center;
	}
	.state{
		font-size: 12px;
		padding: 10px 0;
		text-align: center;
		color: #2680eb;
	}
	.button{
		height: 22px;
		font-size: 12px;
		text-align: center;
		padding:0 20px;
		line-height: 22px;
		border-radius: 11px;
		border: 1px solid #ececec;
	}
	.source{
		padding: 0 0 20px 15px;
	}
	.remarks{
		padding: 0 0 20px 20px;
	}
	.comment{
		background-color: #fff;
		padding: 20px 0;
		text-align: center;
		font-size: 14px;
	}
</style>
