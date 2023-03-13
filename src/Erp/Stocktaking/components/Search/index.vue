<template>
	<view class="">
			<view class="all">所有库位</view>
			<view class="search">
				<u-search
				 placeholder="搜索库位" 
				 searchIcon="scan" 
				 :showAction="false" 
				 shape="square" 
				 v-model="keyword"
				 @focus="onFocus" 
				 @blur="onBlur"
				 @clear="onClear"></u-search>
				<view class="action" :style="{width}" v-if="!historyType && (focus || keyword) && !noSearchButton">
				  搜索
				</view>
			</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				show:false,
				focus: false,
				keyword:''
			}
		},
		methods:{
			click(){
				this.show = true
			},
			onFocus() {
			  this.focus = true
			},
			onBlur() {
			  setTimeout(() => {
			    this.focus = false
			  }, 100)
			},
			onClear(){}
		}
	}
</script>

<style lang="scss">
	.search{
		padding: 12px;
		display: flex;
	}
	.all{
		font-size: 18px;
		height: 45px;
		line-height: 45px;
		text-align: center;
		border-bottom: 1px solid #EEEEEE;
	}
	.action {
	  color: $primary-color;
	  padding: 0 12px;
	  margin: auto 0;
	}
</style>