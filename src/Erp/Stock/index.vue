<template>
  <view>
    <view class="search">
      <u-search placeholder="请输入物料相关信息" shape="square" :showAction=false @click="click" disabled="true" v-model="value"></u-search>
    </view>
    <scroll-view scroll-x="true"  class="scroll-view"  @scroll="scroll">
      <view class="scroll-view-item_H">
        <view class="choose">全部</view>
      </view>
      <view class="scroll-view-item_H">成产品</view>
      <view class="scroll-view-item_H">虚拟件</view>
      <view class="scroll-view-item_H">零件</view>
      <view class="scroll-view-item_H">标准件</view>
      <view class="scroll-view-item_H">外购件</view>
    </scroll-view >
    <view class="content">
      <SkuItem>
        <view slot="otherData">123</view>
      </SkuItem>
      <SkuItem>
        <view slot="otherData">123</view>
      </SkuItem>
      <SkuItem>
        <view slot="otherData">123</view>
      </SkuItem>
      <SkuItem>
        <view slot="otherData">123</view>
      </SkuItem>
      <SkuItem>
        <view slot="otherData">123</view>
      </SkuItem>
      <SkuItem>
        <view slot="otherData">123</view>
      </SkuItem>
      <SkuItem>
        <view slot="otherData">123</view>
      </SkuItem>
      <SkuItem>
        <view slot="otherData">123</view>
      </SkuItem>
      <SkuItem>
        <view slot="otherData">123</view>
      </SkuItem>
      <SkuItem>
        <view slot="otherData">123</view>
      </SkuItem>
      <SkuItem>
        <view slot="otherData">123</view>
      </SkuItem>
      <SkuItem>
        <view slot="otherData">123</view>
      </SkuItem>
    </view>
  </view>
</template>

<script>
import SkuItem from '../../components/SkuItem'
export default {
  name: 'Stock',
  components: {SkuItem},
  data() {
    return {
      value:'',
      eventName:'search_stock'
    }
  },
  mounted() {
    const _this = this;
    uni.$on(this.eventName,data=>{
      console.log(this,_this);
      console.log('监听到事件来自 '+_this.eventName+' ，携带参数 msg 为：' + data.msg);
    })
  },
  methods: {
    click(){
      uni.navigateTo({
        url: '/pages/searchPage/index?eventName='+this.eventName
      });
    },
    scroll(e) {

    },
  }
}
</script>

<style scoped>
.search{
  background-color: #FFFFFF;
  padding: 12px;
}
.scroll-view{
  display: flex;
  justify-content: flex-start;
  height: 45px;
  white-space: nowrap;
  width: 100%;
}

.scroll-view-item_H {
  display: inline-block;
  width: 20%;
  text-align: center;
  padding-top: 12px;
}
.choose{
  width: 50px;
  height: 25px;
  margin: auto ;
  background-color: #257BDE;
  border-radius: 10px;
  color: #fff;
}
.content{
background-color: #FFFFFF;
}
</style>
