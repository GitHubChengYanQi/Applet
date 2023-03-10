<template>
	<uni-data-checkbox :localdata="qcode" @change="change"></uni-data-checkbox>
</template>

<script>
	export default {
		behaviors: ['uni://form-field'],
		data() {
			return {
				qcode: [{
					text: '一批一码',
					value: 1
				}, {
					text: '一物一码',
					value: 0
				}]
			}
		},
		methods:{
			change(value){
				this.$emit('input', value)
			}
		}
		
	}
</script>

<style>
</style>
