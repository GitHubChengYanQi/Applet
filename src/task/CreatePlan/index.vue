<template>
	<view class="">
		<Card title="执行时间">
			<template v-slot:extra>
				<uni-icons custom-prefix="iconfont" type="icon-rili" size="20" color="#007AFF" @click="date"></uni-icons>
			</template>
			<!-- <van-popup :show="show" position="bottom" custom-style="height: 30%" round closeable @close="onClose"> -->
				<!--  <u-datetime-picker
				                :show="show"
				                v-model="value1"
				                mode="datetime"
				        ></u-datetime-picker> -->
			<!-- </van-popup> -->
		</Card>
		<Card title="类型">
			<template v-slot:extra>
				<view class="" @click="date">订单</view>
			</template>
		</Card>
		
		<van-popup :show="show" position="bottom" round @close="onClose">
			<van-picker :columns="columns" bind:change="onChange"  show-toolbar toolbar-class="blue"/>
		</van-popup>
		
		<Card title="产品">
			<view class="product" @click="onclick">
				<u-button type="primary" :plain="true" text="+"></u-button>
			</view>
		</Card>
		<u-popup :show="show2" mode="bottom" round @close="onClose" closeable>
			<view class="add">添加订单</view>
			<view class="search">
				<u-search shape="square" :showAction='false' placeholder='请输入搜索内容'></u-search>
			</view>
			
			<!-- <u-search shape="square" placeholder='请输入搜索内容'></u-search> -->
			<view class="content2">
				<view class="information">
					<view class="title">国家</view>
					<view class="substance">：无</view>
				</view>
				<view class="information">
					<view class="title">订单编号</view>
					<view class="substance">：123</view>
				</view>
				<view class="information">
					<view class="title">产品数量</view>
					<view class="substance">：22</view>
				</view>
				<view class="information">
					<view class="title">交货期</view>
					<view class="substance">：7天</view>
				</view>
			</view>
			<view class="baseline">
				--- 我是有底线的 ---
			</view>
			<view class="navigation">
				<BottomButton></BottomButton>
			</view>
		</u-popup>
		<Card title="执行人">
			<template v-slot:extra>
				<uni-icons type="personadd" size="20" color="#007AFF" @click="date"></uni-icons>
			</template>
		</Card>
		<Card title="添加备注">
			<u--textarea  placeholder="请输入添加备注" border="none"></u--textarea>
		</Card>
		<Card title="添加附件">
			<template v-slot:extra>
				<Uploader>
					<uni-icons type="personadd" size="20" color="#007AFF" @click="date"></uni-icons>
				</Uploader>
			</template>
		</Card>
	</view>
</template>

<script>
	import Card from '../../components/Card/index.vue'
	import BottomButton from '../../components/BottomButton/index.vue'
	import Uploader from '../../components/Uploader/index.vue'
	export default{
		components:{
			Card,
			BottomButton,
			Uploader
		},
		data() {
			return{
				show:false,
				show2:false,
				columns: ['订单', '生产'],
			}
		},
		methods:{
			date(){
				this.show = true;
			},
			onClose() {
			    this.show=false;
				this.show2=false;
			  },
			onclick(){
				this.show2=true;
			}
		}
	}
</script>

<style lang="scss">
	.product{
		width: 23%;
		font-size: 16px;
		margin: auto;
	}
	.add{
		height: 45px;
		line-height: 45px;
		text-align: center;
		border-bottom: 1px solid #EEEEEE;
	}
	.search{
		padding: 10px;
	}
	.information{
		display: flex;
	}
	.title{
		width: 70px;
		color: #9d9d9d;
		font-size: 14px;
		padding: 1px 0;
		text-align-last: justify;
	}
	.content2{
		padding: 12px 12px;
		border-bottom: 1px solid #EEEEEE;
		border-top: 1px solid #EEEEEE;
	}
	.substance{
		font-size: 14px;
	}
	.baseline{
		color: #999999;
		padding: 18px;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 14px;
	}
	.navigation{
		display: flex;
	}
	.custom-style{
		border-radius: 0px;
	}
</style>