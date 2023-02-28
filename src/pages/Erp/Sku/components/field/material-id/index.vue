<template>
	<uni-data-select :localdata="localdata" :placeholder="'请输入'+placeholder" placeholder-style="color:#ccc"></uni-data-select>
</template>

<script>
	///material/listSelect
	import {
		request
	} from 'MES-Apis/uitl/Service/request';
	export default {
		data() {
			return {
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
					url: "/material/listSelect",
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

			}			
		}
	}
</script>

<style>
</style>