<template>
	<view class="choice">
		<view>
			<uni-easyinput class="uni-input" @input="onInput" v-model="length" placeholder="长(mm)" placeholder-style="color:#ccc" />
		</view>
		<span class='symbol'>×</span>
		<view>
			<uni-easyinput class="uni-input" @input="onInput" v-model="width" placeholder="宽(mm)" placeholder-style="color:#ccc" />
		</view>
		<span class='symbol'>×</span>
		<view>
			<uni-easyinput class="uni-input" @input="onInput" v-model="height" placeholder="高(mm)" placeholder-style="color:#ccc" />
		</view>
	</view>
</template>

<script>
	export default{
		behaviors: ['uni://form-field'],
		data(){
			return{length:"",
			width:"",
			height:""}
			
		},
		props:{
			placeholder:String,
		},
		methods: {
			onInput() {
				this.$emit('input', `${this.length},${this.width},${this.height}`)
			}
		}
	}
</script>

<style lang="scss">
	
</style>