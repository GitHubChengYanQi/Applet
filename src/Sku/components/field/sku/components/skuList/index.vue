<template>
	<view class="line">
		<view class="">
			<uni-forms-item label="名称:">
				<uni-combox :candidates="candidates" v-model="name2" @input="onInput"/>
			</uni-forms-item>
			<uni-forms-item label="内容:">
				<uni-combox :candidates="candidates" v-model="content"  @input="onInput"/>
			</uni-forms-item>
		</view>
		<view class="rubbish">
			<uni-icons type="trash-filled" color="red" size="20" @click="del"></uni-icons>
		</view>
	</view>
	
</template>

<script>
	export default{
		behaviors: ['uni://form-field'],
		data() {
			return {
				name2:'',
				content:''
			}
		},
		props:{
			index:Number,
			value:Object,
		},
		watch:{
			value:function(){
				console.log(1);
				this.name2 = this.value.name;
				this.content = this.value.content;
			}
		},
		mounted(){

		},
		methods:{
			del(){
				this.$emit("delete",this.index);
			},
			onInput(value) {
				this.$emit('input', {
					index:this.index,
					name:this.name2,
					content:this.content
				})
			}
		}
	}
</script>

<style>
	.line{
		padding-top: 10px;
		display: flex;
	}
	.rubbish{
		line-height: 90px;
		width: 50px;
		text-align: center;
	}
</style>