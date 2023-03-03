<template>
		<uni-easyinput class="uni-input" @input="onInput" :placeholder="'请输入'+placeholder" placeholder-style="color:#ccc" />

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