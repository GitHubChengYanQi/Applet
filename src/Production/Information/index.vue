<template>
	<view class="">
		<Card title="历史信息">
			<template v-slot:extra>
				<view class="link"  @click="show1 = true">查看</view>
			</template>
		</Card>
		<u-popup :show="show1" @close="close" mode="bottom" closeable="true">
			<view>
				<view class="add">历史信息</view>
				<Search></Search>
					<u-collapse accordion>
						<u-collapse-item title="历史计划">
							
							
						</u-collapse-item>
						<u-collapse-item title="历史订单">
							
						</u-collapse-item>
					</u-collapse>
			</view>
		</u-popup>
		<view class="space"></view>
		<Search></Search>
		<view class="uni-list">
			<view class="headPortrait3">
			  <image src="../../static/3.png" alt="" />
			  <view class="quantity">10件</view>
			</view>
			<view class="describe">
				<view>大孔过渡板</view>
				<view class="grey">t5-76041l / 大孔用</view>
				<view class="otherData">预警</view>
			</view>
			<view class="addButton">
				<u-button type="primary" :plain="true" size="small" text="添加" @click="show2 = true"></u-button>
			</view>
		</view>
		<u-popup :show="show2" mode="bottom" @close="close" closeable="true">
			<view class="add">选择版本</view>
			<view class="box">
				<view class="uni-list">
					<view class="headPortrait3">
					  <image src="../../static/3.png" alt="" />
					  <view class="quantity">10件</view>
					</view>
					<view class="describe">
						<view>大孔过渡板</view>
						<view class="grey">t5-76041l / 大孔用</view>
						<view class="otherData">预警</view>
					</view>
				</view>
			<view class="uni-list" v-for="item in list">
				<view class="content2">
					<view class="information">
						<view class="title">备注</view>
						<view class="substance">：</view>
					</view>
					<view class="information">
						<view class="title">版本号</view>
						<view class="substance">：123</view>
					</view>
					<view class="information">
						<view class="title">创建日期</view>
						<view class="substance">：2023-02-21 08:48:43</view>
					</view>
				</view>
				<view class="center">
					<ShopNumber value="0" @onChange="num=>onChange(num,item.id)" v-model="item.value"></ShopNumber>
				</view>
			</view>
			
			</view>
			<BottomButton rightText="添加"></BottomButton>
		</u-popup>
	</view>
</template>

<script>
	import Card from '../../components/Card/index.vue'
	import Search from '../../components/Search/index.vue'
	import ShopNumber from '../../components/ShopNumber/index.vue'
	import BottomButton from '../../components/BottomButton/index.vue'
	export default{
		components:{
			Card,
			Search,
			ShopNumber,
			BottomButton
		},
		 data() {
			return {
				show1:false,
				show2: false,
				list:[
					{id:1,
						value:1
					},
					{
						id:2,
						value:10
					},
					{
						id:3,
						value:100
					}
				]
			}
		  }, 
		  methods:{
			close() {
				this.show1 = false
				this.show2 = false
			},
			onChange(num,id){
				console.log(id,num)
				this.list = this.list.map(item=>{
					if(id==item.id) item.value=num;
					return item;
				});
			}
		  }
	}
</script>

<style lang="scss">
	image{
	  width: 100%;
	  height: 100%;
	}
	.link{
		color: #007AFF;
	}
	.uni-list{
		display: flex;
		width: 100%;
		padding-bottom: 8px;
		border-bottom: 1px solid #e1ebf6;
		background-color: #fff;
	}
	.headPortrait3{
	  width: 72px;
	  height: 72px;
	  border-radius: 2px;
	  overflow: hidden;
	  position: relative;
	  .quantity{
	    height: 16px;
	    width: 100%;
	    font-size: 12px;
	    text-align: center;
	    color: #fff;
	    position: absolute;
	    bottom: 0;
	    border-radius: 0 0 2px 2px;
	    background-color: rgba(0, 0, 0, 0.4);
	  }
	}
	.describe{
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		margin-left: 12px;
		justify-content: space-evenly;
		font-size: 14px;
		.grey{
			color: #808080;
		}
	}
	.addButton{
		margin: auto 12px;
	}
	.otherData{
		font-size: 12px;
		color: #3D3D3D;
	}
	.add{
		font-size: 18px;
		height: 45px;
		line-height: 45px;
		text-align: center;
		border-bottom: 1px solid #EEEEEE;
	}
	.box{
		padding: 12px 12px 50px 12px;
	}
	.information{
		display: flex;
	}
	.title{
		width: 70px;
		color: #9d9d9d;
		font-size: 14px;
		padding: 4px 0;
		text-align-last: justify;
	}
	.content2{
		padding: 12px 0;
		border-bottom: 1px solid #f5f5f5;
		flex-grow: 1;
	}
	.substance{
		font-size: 14px;
		padding: 4px 0;
	}
	.center{
		margin: auto 0;
	}
</style>