<template>
	<view class="">
		<view class="tab">
			<view class="border"></view>
			<uni-segmented-control :current="current" @clickItem="onClickItem" :values="item" styleType="text" activeColor="#007AFF" ></uni-segmented-control>
		</view>
		<view class="content">
			<view v-show="current === 0">
				<view class="uni-list">
					<checkbox-group @change="checkboxChange">
						<label class="uni-list2">
							<view class="uni-list3">
								<checkbox :value="item.value" :checked="item.checked" style="transform:scale(0.6)" color="#007AFF"/>
								<view class="number">1&nbsp;/&nbsp;89</view>
								<view class="warn">无合同</view>
							</view>
							<view class="time">2022-12-26 14:38:07</view>
						</label>
						<view class="uni-list4">
							<view class="check">
								<checkbox :value="item.value" :checked="item.checked" style="transform:scale(0.6)" color="#007AFF"/>
							</view>
							<view class="headPortrait3">
							  <image src="../../static/3.png" alt="" />
							  <view class="quantity">10件</view>
							</view>
							<view class="describe">
								<view>大孔过渡板</view>
								<view class="grey">t5-76041l / 大孔用</view>
							</view>
							
							<view class="uni-list5">
								<view class="warn">无工艺</view>
								<view class="number">×2</view>
							</view>
						</view>
					<view class="uni-list4">
						<view class="check">
							<checkbox :value="item.value" :checked="item.checked" style="transform:scale(0.6)" color="#007AFF"/>
						</view>
						<view class="headPortrait3">
						  <image src="../../static/3.png" alt="" />
						  <view class="quantity">10件</view>
						</view>
						<view class="describe">
							<view>大孔过渡板</view>
							<view class="grey">t5-76041l / 大孔用</view>
						</view>
						
						<view class="uni-list5">
							<view class="warn">无工艺</view>
							<view class="number">×2</view>
						</view>
					</view>
					</checkbox-group>
				</view>
				
				<view class="space"></view>
				
				<view class="uni-list">
					<checkbox-group @change="checkboxChange">
						<label class="uni-list2">
							<view class="uni-list3">
								<checkbox :value="item.value" :checked="item.checked" style="transform:scale(0.6)" color="#007AFF"/>
								<view class="number">1&nbsp;/&nbsp;89</view>
								<view class="warn">无合同</view>
							</view>
							<view class="time">2022-12-26 14:38:07</view>
						</label>
						<view class="uni-list4">
							<view class="check">
								<checkbox :value="item.value" :checked="item.checked" style="transform:scale(0.6)" color="#007AFF"/>
							</view>
							<view class="headPortrait3">
							  <image src="../../static/3.png" alt="" />
							  <view class="quantity">10件</view>
							</view>
							<view class="describe">
								<view>大孔过渡板</view>
								<view class="grey">t5-76041l / 大孔用</view>
							</view>
							
							<view class="uni-list5">
								<view class="warn">无工艺</view>
								<view class="number">×2</view>
							</view>
						</view>
					<view class="uni-list4">
						<view class="check">
							<checkbox :value="item.value" :checked="item.checked" style="transform:scale(0.6)" color="#007AFF"/>
						</view>
						<view class="headPortrait3">
						  <image src="../../static/3.png" alt="" />
						  <view class="quantity">10件</view>
						</view>
						<view class="describe">
							<view>大孔过渡板</view>
							<view class="grey">t5-76041l / 大孔用</view>
						</view>
						
						<view class="uni-list5">
							<view class="warn">无工艺</view>
							<view class="number">×2</view>
						</view>
					</view>
					</checkbox-group>
				</view>
			</view>
			<view v-show="current === 1">
				<view class="uni-list4">
					<view class="uni-list6">
						<view class="check">
							<checkbox :value="item.value" :checked="item.checked" style="transform:scale(0.6)" color="#007AFF"/>
						</view>
						<view class="headPortrait3">
						  <image src="../../static/3.png" alt="" />
						  <view class="quantity">10件</view>
						</view>
						<view class="describe">
							<view>大孔过渡板</view>
							<view class="grey">t5-76041l / 大孔用</view>
						</view>
						
						<view class="uni-list5">
							<view class="warn">无工艺</view>
						</view>
					</view>
					
				</view>
			</view>
			
			<view class="bottom">
				<view class="button">
					<van-button type="info" block round >创建出库计划</van-button>
				</view>
			</view>
			
		</view>
		
	</view>
</template>

<script>
	import SkuItem from '../../Erp/Sku/components/SkuItem/index.vue'
	export default {
	  data() {
	    return {
	        item: ['订单式生产', '计划式生产'],
	        current: 0
	    };
	  },
	  
	  methods: {
		  onClickItem(e) {
		        if (this.current != e.currentIndex) {
		          this.current = e.currentIndex;
		        }
		      }
	  }
	};
</script>

<style lang="scss">
	body{
		background-color: #e1ebf6;
	}
	image{
	  width: 100%;
	  height: 100%;
	}
	.space{
		height: 3px;
		background-color: #e1ebf6;
	}
	.tab{
		background-color: #fff;
		border-bottom: 1px solid #eeeeee;
	}
	.border{
		height: 1px;
		background-color: #e1ebf6;
	}
	.content{
		background-color: #fff;
	}
	.uni-list{
		padding: 5px 12px 0 12px;
	}
	.uni-list2{
		display: flex;
		align-items: flex-end;
		padding-bottom: 5px;
		border-bottom: 1px solid #e1ebf6;
	}
	.uni-list3{
		display: flex;
		align-items: flex-end;
		flex-grow: 1;
	}
	.uni-list4{
		display: flex;
		padding: 8px;
	}
	.uni-list5{
		display: flex;
		flex-direction: column;
		justify-content: center;
		text-align: center;
	}
	.uni-list6{
		display: flex;
		border-bottom: 1px solid #e1ebf6;
	}
	.check{
		line-height: 72px;
	}
	.warn{
		color: #ff3141;
		font-size: 12px;
	}
	.number{
		font-size: 14px;
		padding: 2px 10px 0 0;
	}
	.time{
		font-size: 12px;
		color: #9d9d9d;
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
	.button{
		width: 90%;
		margin: 0 auto;
		
	}
	.bottom{
		width: 100%;
		background-color: #fff;
		padding: 10px 0;
		position: absolute;
		bottom: 0;
	}
</style>