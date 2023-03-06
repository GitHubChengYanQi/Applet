<template>
		<uni-easyinput type="textarea" autoHeight @input="onInput" :placeholder="'请输入'+placeholder"></uni-easyinput>
</template>

<script>
	export default{
		behaviors: ['uni://form-field'],
		props:{
			placeholder:String,
		},
		methods: {
			onInput(value) {
				this.$emit('input', value)
			}
		}
	}
</script>

<style>
</style>