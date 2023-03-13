<template>
	<view class="">
		<button class="mini-btn" type="default" size="mini" @click="add">添加</button>
		<SkuList v-for="(item,index) in list" :index="index" :key="index" :value="item" @delete="del" @input="input" />
	</view>

</template>

<script>
	import SkuList from "./components/skuList"
	export default{
		components:{
			SkuList
		},
		data() {
			return {
				list:[]
			}
		},
		watch:{
			list(value){
				console.log(22,value)
				this.$emit("input",value)
			}
		},
		methods:{
			add(){
				const tmp = [...this.list];
				tmp.push({
					name:"",
					content:"",
					index:this.list.length
				});
				this.list = [...tmp];
				this.$emit("input",tmp);
			},
			del(index){
				this.list.splice(index,1)
			},
			input(value){
				const tmp = [...this.list];
				tmp.splice(value.index,1,value);
				this.list = [...tmp];
				this.$emit("input",tmp)
			}
		}
	}
</script>

<style>
</style>
