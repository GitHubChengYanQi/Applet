<template>
	<view class="">
		<Card title="执行时间">
			<template v-slot:extra>
				<uni-icons custom-prefix="iconfont" type="icon-rili" size="20" color="#007AFF" @click="date"></uni-icons>
			</template>
			<van-popup :show="show" position="bottom" custom-style="height: 30%" round closeable @close="onClose">
				 <van-datetime-picker
				        type="datetime"
				        v-model="currentDate"
				        title="选择出生日期"
				        :min-date="minDate"
				        :max-date="maxDate"
				      />
			</van-popup>

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
				minDate: new Date().getTime(),
				maxDate: new Date(2019, 10, 1).getTime(),
				currentDate: new Date().getTime(),
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
</style>