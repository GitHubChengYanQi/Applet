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
			<view class="product">
				<u-button type="primary" :plain="true" text="+"></u-button>
			</view>
		</Card>
	</view>
</template>

<script>
	import Card from '../../components/Card/index.vue'
	export default{
		components:{
			Card
		},
		data() {
			return{
				show:false,
				columns: ['订单', '生产'],
			}
		},
		methods:{
			date(){
				this.show = true;
				
			},
			onClose() {
			    this.show=false;
			  },
		}
	}
</script>

<style lang="scss">
	.product{
		width: 25%;
		font-size: 16px;
		height: 30px;
	}
	
</style>