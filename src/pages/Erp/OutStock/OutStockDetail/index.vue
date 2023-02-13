<template>
	<view>
		<!-- 第一部分 -->
		<ApprovalHeader/>
		<!-- 选项卡 -->
		<view class="tab">
			<view class="tabCheck2" :class="curr==0 ? 'tabCheck' : ''" data-index="0" @tap="setCurr">基本信息</view>
			<view class="tabCheck2" :class="curr==1 ? 'tabCheck' : ''" data-index="1" @tap="setCurr">出库记录</view>
			<view class="tabCheck2" :class="curr==2 ? 'tabCheck' : ''" data-index="2" @tap="setCurr">动态日志</view>
			<view class="tabCheck2" :class="curr==3 ? 'tabCheck' : ''" data-index="3" @tap="setCurr">关联单据</view>
		</view>
		<!-- 内容 -->
		<!-- 基本信息 -->
		<scroll-view v-if="curr==0">
				<!-- 出库明细 -->
					<uni-section title="出库明细" type="line" style="margin-bottom: 3px;">
					<template v-slot:right>
						<view class="state" @tap="more">更多</view>
					</template>
					</uni-section>
				<!-- 间隔 -->
				<view class="space"></view>
				<!-- 主题 -->
					<uni-section title="主题" type="line" style="margin-bottom: 3px;">
					<template v-slot:right>
						128-台湾展
					</template>
					</uni-section>
				<view class="space"></view>
				<!-- 领料负责人 -->
					<uni-section title="领料负责人" type="line" style="margin-bottom: 3px;">
						<template v-slot:right>
							<view class="picker">
								<view class="headPortrait2">
									<img src="../../../../static/logo.png" alt="">
								</view>
								<view class="pickerInfo">
									<view>雷敏</view>
									<view class="position">-&nbsp;总经理</view>
								</view>
							</view>
						</template>
					</uni-section>
				<view class="space"></view>

					<uni-section title="出库类型" type="line" style="margin-bottom: 3px;">
					<template v-slot:right>
						生产任务
					</template>
					</uni-section>
				<view class="space"></view>

					<uni-section title="注意事项" type="line" style="margin-bottom: 3px;">
						<view class="remarks">
							注意轻拿轻放
						</view>
					</uni-section>
				<view class="space"></view>

					<uni-section title="备注" type="line" style="margin-bottom: 3px;">
						<view class="remarks">
							无
						</view>
					</uni-section>
				<view class="space"></view>

					<uni-section title="附件" type="line" style="margin-bottom: 3px;">
						<view class="remarks">
							无
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
					<view class="addComment" @click="toggle('bottom')">
						<uni-icons type="compose" size="20"></uni-icons>
						添加评论
					</view>
					<view>
						<!-- 普通弹窗 -->
						<!-- 	<uni-popup ref="popup" background-color="#fff" @change="change">
								<view class="popup-content" :class="{ 'popup-height': type === 'left' || type === 'right' }"><text
										class="text">popup 内容</text></view>
							</uni-popup> -->
					</view>
			</view>
		</scroll-view>
		<!-- 出库记录 -->
		<scroll-view v-else-if="curr==1">
			<view class="">
				<view class="outbound">
					<uni-search-bar
						v-model="searchVal"
						cancel-text="搜索"
						placeholder="请输入搜索内容"
						bgColor="#f1f1f1"
						clearButton="auto"
						cancelButton="auto">
					</uni-search-bar>
				</view>
				<view class="outbound">
					<view class="overview2">
						<view class="headPortrait3">
							<img src="/static/logo.png" alt="" >
							<view class="quantity">306台</view>
						</view>
						<view class="describe">
							<view class="describe1">
								数控车床
							</view>
							<view class="describe2">
								t5&nbsp;/&nbsp;0213
							</view>
							<view class="describe3">
								无品牌
							</view>
						</view>
						<view class="number">
							×6
						</view>
					</view>
					<view class="overview3">
						<view class="describe">
							库位：东3
						</view>
						<view class="describe4">
							程彦祺&nbsp;/&nbsp;01月31日 11:51
						</view>
					</view>
				</view>
				<view class="outbound">
					<view class="overview2">
						<view class="headPortrait3">
							<img src="/static/logo.png" alt="" >
							<view class="quantity">306台</view>
						</view>
						<view class="describe">
							<view class="describe1">
								数控车床
							</view>
							<view class="describe2">
								t5&nbsp;/&nbsp;0213
							</view>
							<view class="describe3">
								无品牌
							</view>
						</view>
						<view class="number">
							×6
						</view>
					</view>
					<view class="overview3">
						<view class="describe">
							库位：东3
						</view>
						<view class="describe4">
							程彦祺&nbsp;/&nbsp;01月31日 11:51
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<!-- 动态日志 -->
		<scroll-view v-else-if="curr==2">
				<view class="overview4">
					<view class="headPortrait2">
						<img src="/static/logo.png" alt="" >
					</view>
					<view>
						<view class="blueBold">
							程彦祺
						</view>
						<view class="describe">
							数控车床
						</view>
						<view class="time2">
							01月31日&nbsp;11:52
						</view>
					</view>
				</view>
				<view class="overview4">
					<view class="headPortrait2">
						<img src="/static/logo.png" alt="" >
					</view>
					<view>
						<view class="blueBold">
							程彦祺
						</view>
						<view class="describe">
							数控车床
						</view>
						<view class="time2">
							01月31日&nbsp;11:52
						</view>
					</view>
				</view>
				<view class="overview4">
					<view class="baseline">
						---我是有底线的---
					</view>
				</view>
		</scroll-view>
		<!-- 关联单据 -->
		<scroll-view v-else-if="curr==3">
			<view class="overview5">
				<view class="headPortrait4">
					<img src="/static/logo.png" alt="" >
				</view>
				<view class="bill">
					程彦祺发起的入库异常 / 230207001
				</view>
				<view class="bill1" @click="error">
					• 核实异常
					<uni-icons type="forward"></uni-icons>
				</view>
			</view>
		</scroll-view>

		<view class="space2"></view>
		<view class="goods-carts">
			<view class="points" @tap="again">
				<view>更多</view>
				<uni-icons type="more-filled" size="20" color="#2680eb"></uni-icons>
			</view>
			<view class="picking">
				领料
			</view>
		</view>
		<!-- <view class="goods-carts">
			<uni-goods-nav :fill="true" :options="options" :button-group="customButtonGroup1"  />
		</view> -->

	</view>
</template>

<script>
	import UniSetpsD from "@/components/uni-steps-d/uni-steps-d.vue"
	import ApprovalHeader from '@/pages/Erp/OutStock/OutStockDetail/components/ApprovalHeader/ApprovalHeader.vue'
	export default {
		components: {
			ApprovalHeader,
			UniSetpsD
		},
		data() {
			return {
				curr:0,
				type: 'center',
				options:[{
					text:'更多',
					icon:"more-filled",
					color:'blue'
				}],
				customButtonGroup1: [{
					text: '领料',
					backgroundColor: '#2680eb',
					color: '#fff'
				}],

				list2: [{
					title: '买家下单',
					desc: '雷敏',
					time:'2022-11-12'
				}, {
					title: '卖家发货',
					desc: '雷敏',
					time: '2018-11-12'
				},{
					title: '交易完成',
					desc: '雷敏',
					time: '2018-11-12'
				}],
			}
		},
		methods: {
			setCurr(e) {
			// console.log(e.detail.current)
			let thisCurr = e.detail.current || e.currentTarget.dataset.index || 0;
			// console.log(thisCurr)
			this.curr = thisCurr;
		},
		more() {
			uni.navigateTo({
				url: 'Detailed/index'
			});
		},
		again(){
			uni.showActionSheet({
			    itemList: ['再次提交', '撤销'],
			    success (res) {
			       // 选择其中任意一项后，获取其索引（res.tapIndex），从0开始
			       console.log(res.tapIndex)
			    },
			    fail (res) {
			       // 取消后的操作
			    }
			})
		},
		error(){
			uni.navigateTo({
				url: '../Error/index'
			});
		},
		toggle(type) {
			this.type = type
			// open 方法传入参数 等同在 uni-popup 组件上绑定 type属性
			this.$refs.popup.open(type)
		},
	},
	}
</script>

<style lang="scss">
	body{
		background-color: #e1ebf6;
	}
	.space{
		height: 2px;
	}
	.space2{
		height: 64px;
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
	}
	.overview2{
		background-color: #fff;
		display: flex;
		padding: 12px 12px 8px 12px;
	}
	.overview3{
		border-top: 1px solid #ccc;
		background-color: #fff;
		display: flex;
		padding: 4px 0 10px 0;
		margin: 0 12px 8px 12px;
	}
	.overview4{
		background-color: #fff;
		display: flex;
		padding: 12px 12px 8px 12px;
		border-bottom: 1px solid #f5f5f5;

		.blueBold{
			font-size: 14px;
			font-weight: bold;
			padding:0 0 8px 12px;
			color: #2680eb;
		}
	}
	.overview5{
		background-color: #fff;
		display: flex;
		padding: 8px 12px;
	}
	.headPortrait{
		width: 55px;
		height: 55px;
		border-radius: 50%;
		overflow: hidden;
	}
	.headPortrait2{
		width: 35px;
		height: 35px;
		border-radius: 5px;
		overflow: hidden;
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
	.headPortrait4{
		width: 20px;
		height: 20px;
		border-radius: 5px;
		overflow: hidden;
	}
	image{
		width: 100%;
		height: 100%;
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
	.time2{
		font-size: 12px;
		color: #ACACAC;
		padding:10px 0 5px 12px;
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
	.picker{
		display: flex;
	}
	.pickerInfo{
		padding-left: 10px;
	}
	.position{
		font-size: 12px;
		color: #b5b5b5;
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
	.goods-carts {
		display: flex;
		box-shadow: 0 0 10px 2px #ccc;
		position: fixed;
		left: 0;
		right: 0;
		padding: 10px 12px;
		background-color: #fff;
		bottom: 0;
		z-index: 2;
	}
	.outbound{
		background-color: #fff;
		padding: 0 2px;
	}
	.details{
		display: flex;
	}

	.describe{
		flex: 1;
		padding: 4px 12px;
		font-size: 14px;
	}
	.describe2{
		padding: 5px 0;
		color: #808080;
	}
	.describe3{
		font-size: 12px;
	}
	.describe4{
		padding: 4px 12px;
		font-size: 14px;
	}
	.number{
		font-size: 14px;
		margin: auto 10px;
		letter-spacing: 2px;
	}
	.bill{
		font-size: 14px;
		padding-left: 8px;
		flex: 1;
	}
	.bill1{
		font-size: 14px;
	}
	.baseline{
		font-size: 14px;
		color: #ACACAC;
		margin: 15px auto;
	}
	.points{
		padding-right: 12px;
		font-size: 14px;
		color: #808080;
		text-align: center;
	}
	.picking{
		font-size: 14px;
		max-width: 640px;
		flex-grow: 1;
		background-color: #2680eb;
		border-radius: 50px;
		text-align: center;
		line-height: 40px;
		color: #fff;
	}
</style>
