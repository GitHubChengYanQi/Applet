<template>
	<view class="">
		<button class="mini-btn" type="default" size="mini" @click="showDrawer">{{title}}</button>
		<uni-drawer ref="showRight" mode="right" :width="320" @change="change">
					<uni-search-bar bgColor="#EEEEEE" @input="search" :focus="true" v-model="searchValue" @cancel='closeDrawer'></uni-search-bar>
			<view class="brand">
				<uni-data-checkbox v-model="checked" mode="tag" multiple :localdata="localdata"></uni-data-checkbox>
			</view>
		</uni-drawer>
	</view>

</template>

<script>
	///brand/list?limit=20&page=1&sorter=%7B%7D
	import {
		request
	} from 'MES-Apis/uitl/Service/request';
	export default {
		name: "brand-ids",
		data() {
			return {
				searchValue: "",
				localdata: [],
				time: null,
				checked:[],
				checkedList:[],
				tmpList:[]
			}
		},
		computed:{
			title(){
				if(this.checkedList.length>0){
					const list = this.checkedList.map(item=>item.text);
					return list.join(",");
				}else{
					return "选择"
				}
				
			}
		},
		mounted() {

		},
		watch:{
			checked(val){
				const tmpVal = [...this.tmpList,...val];
				let tmpList= this.localdata.filter(item => {
					return tmpVal.findIndex(i=>{						
						return i==item.value
						})>=0;
				});
				this.checkedList  = [...this.checkedList ,...tmpList];
				console.log(this.checkedList)
				console.log(val);
				tmpList = [];
				this.checkedList = this.checkedList.filter(item => {
					const is = tmpVal.findIndex(i=>i==item.value)>=0;
					const it = tmpList.findIndex(i => item.value==i.value)==-1;
					if(is){
						tmpList.push(item);
					}
					// console.log(is,it);
					return is && it;
				})
			}
		},
		methods: {
			change(value){
				if(value){
					console.log(111,this.checkedList)
					this.checked = this.checkedList.map(item=>item.value);
				}
			},
			search(value) {
				clearTimeout(this.time);
				this.time = setTimeout(() => {
					this.get(value);
				}, 500);

			},
			async get(brandName) {
				const _this = this;
				_this.tmpList = [...this.checked];
				
				
				const response = await request({
					url: "/brand/list",
					method: "POST",
					data: {
						brandName
					}
				});
				const {
					data
				} = response;
				_this.localdata = data.map(item => {
					return {
						value: item.brandId,
						text: item.brandName
					};
				});
			},
			showDrawer() {
				this.get();
				this.$refs.showRight.open();
			},
			closeDrawer() {
				this.$refs.showRight.close();
			}
		}
	}
</script>

<style>
	.seek{
		display: flex;
	}
	.brand{
		padding: 8px 14px;
	}
</style>
