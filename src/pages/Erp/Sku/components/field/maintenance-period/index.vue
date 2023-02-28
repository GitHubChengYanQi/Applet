<template>
	<view class="choice">
		<uni-easyinput @input="onInput" :placeholder="'请输入'+placeholder+'(天)'" placeholder-style="color:#ccc" />
	</view>
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
	.choice {
		display: flex;
	}
	.company{
		position: absolute;
		right: 10px;
		line-height: 30px;
	}
</style>