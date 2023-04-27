<template>
  <view class="back" :style="{paddingBottom:padding}">
    <view class="list"  v-for="(item,index) in list" :key="index">
      <SkuItem title="物料名称"></SkuItem>
      <view class="input">
        到货数：
        <u--input
            placeholder="请输入内容"
            border="surround"
            type="number"
        ></u--input>
      </view>
    </view>
    <view class="button" :style="{paddingBottom:bottom}">
      <u-button type="primary" text="确定" shape="circle" ></u-button>
    </view>
  </view>
</template>
<script>
import SkuItem from "@/components/SkuItem";

export default {
  components: {
    SkuItem
  },
  data(){
    return {
      bottom:0,
      padding:0,
      list:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]
    }
  },
  mounted() {
    const _this = this;
    uni.getSystemInfo({
      success: function (res) {
        _this.bottom = res.safeAreaInsets.bottom+'px';
        _this.padding = (50+res.safeAreaInsets.bottom)+'px';
      }
    })
  }
}
</script>

<style scoped>
.back{

}
.list{
  padding: 8px;
  margin-top: 8px;
  background-color: #FFFFFF;
  position: relative;
}
.button{
  background-color: #FFFFFF;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 8px;
  z-index: 999;
}
.input{
  font-size: 14px;
  line-height: 22px;
  position: absolute;
  top: 18px;
  right: 8px;
  width: 80px;
}
</style>
