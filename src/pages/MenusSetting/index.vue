<template>
  <view class="body">
    <Card title="常用功能">
      <view slot="right">
        <view class="blue">
          <view>管理</view>
          <uni-icons type="gear" size="16"  color="#2680EB"></uni-icons>
        </view>
      </view>
        <view class="white1" slot="content">
         <view class="text">
           已收起6个应用
         </view>
          <view class="little">
            <image :src="src"></image>
          </view>
          <view class="icon">
            <uni-icons type="bottom" size="12" color="#D8D8D8"></uni-icons>
          </view>
        </view>

    </Card>
    <Card title="营销中心">
      <view class="white" slot="content">
        <u-grid col="4" :border="true">
          <u-grid-item>
            <view class="block">
              <view class="img">
                <image :src="src"></image>
              </view>
              <view class="text">创建销售单</view>
            </view>
          </u-grid-item>
        </u-grid>
      </view>
    </Card>
  </view>

</template>

<script>
import Card from "./components/Card";
export default {
  name: "index",
  components: {
    Card
  },
  data(){
    return{
      src:'../../static/创建采购单.png'
    }
  }
}
</script>

<style lang="scss">
.body{
  padding: 27px 12px;
}

image{
  width: 100%;
  height: 100%;
}
.blue{
  display: flex;
  color: #2680EB;
}
.white{
  display: flex;
  background-color: #FFFFFF;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 6px 9px -2px rgba(220, 220, 220, 0.3);
  .block{
    justify-content: space-between;
    padding: 14px;

    .img{
      width: 34px;
      height: 34px;
      margin:4px auto;
    }
    .text{
      font-size: 12px;
    }
  }
}
.white1{
  display: flex;
  padding: 16px 21px;
  background-color: #FFFFFF;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 6px 9px -2px rgba(220, 220, 220, 0.3);

  .text{
    font-size: 12px;
    color: #808080;
    text-align: left;
    flex-grow: 1;
  }
  .little{
    width: 14px;
    height: 14px;
  }
  .icon{
    margin: auto 4px;
  }
}
</style>