<template>
	<uni-data-select :localdata="localdata" v-model="value" :placeholder="'请输入'+placeholder" placeholder-style="color:#ccc"></uni-data-select>
</template>

<script>
	///unit/listSelect
	import {
		request
	} from 'MES-Apis/lib/uitl/Service/request';
	export default {
		data() {
			return {
				value:0,
				localdata: []
			}
		},
		props:{
			placeholder:String,
		},
		mounted() {
			this.get();
		},
		methods: {
			async get() {
				const response = await request({
					url: "/unit/listSelect",
					method:"POST",
					data: {
						// fieldName: "heatTreatment"
					}
				});
				const {data} = response;
				console.log(data);
				this.localdata = data.map(item=>{
					return {
						value: item.value, text: item.label
					}
				});
			},

		}
	}
</script>

<style>

</style>
