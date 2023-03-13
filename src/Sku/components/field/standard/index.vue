<template>
	<view>
		<view>
			<uni-data-select :localdata="range" v-model="show"></uni-data-select>
		</view>
		<view v-if="!show" class="custom">
			<uni-easyinput @input="onInput" :placeholder="'请输入'+placeholder"></uni-easyinput>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show:0,
				range: [{
						value: 0,
						text: "自定义"
					},
					{
						value: 1,
						text: "自动生成"
					}
				]
			}
		},
		behaviors: ['uni://form-field'],
		props:{
			placeholder:String,
		},
		methods: {
			showPopup() {
				this.show = true;
			},
			onInput(value) {
				this.$emit('input', value)
			},
			
		}
	}
</script>

<style>
	.custom{
		margin-top: 10px;
	}
</style>
