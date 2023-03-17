<template>
  <view>
    <Card title="基本信息">
      <CardItem label="这个是标题">
        这个是内容
      </CardItem>
      <CardItem label="这个是标题">
        这个是内容
      </CardItem>
      <CardItem label="这个是标题">
        这个是内容
      </CardItem>
    </Card>
    <Card title="买方信息">
      <CardItem label="这个是标题">
        这个是内容
      </CardItem>
      <CardItem label="这个是标题">
        这个是内容
      </CardItem>
      <CardItem label="这个是标题">
        这个是内容
      </CardItem>
    </Card>
    <Card title="卖方信息">
      <CardItem label="这个是标题">
        这个是内容
      </CardItem>
      <CardItem label="这个是标题">
        这个是内容
      </CardItem>
      <CardItem label="这个是标题">
        这个是内容
      </CardItem>
    </Card>
    <view>
      <Matter></Matter>
      <Matter></Matter>
      <Matter></Matter>
    </view>
    <view class="button" :style="{paddingBottom:bottom}">
      <u-button type="primary" text="确定" shape="circle" ></u-button>
    </view>
  </view>
</template>

<script>
import Card from "@/components/Card";
import CardItem from "@/components/Card/CardItem";
import Matter from "@/Purchase/Order/OrderDetail/components/Matter";
export default {
  name: 'OrderDetail',
  components: {Card,CardItem,Matter},
  props: ['orderId'],
  data() {
    return {
      bottom:0,
      src: process.env.VUE_APP_PAGE_URL
    }
  },
  mounted() {
    const _this = this;
    uni.getSystemInfo({
      success: function (res) {
        _this.bottom = res.safeAreaInsets.bottom+'px';
      }
    })
  }
}
</script>
<style scoped>
.button{
  background-color: #FFFFFF;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 8px;
}
</style>
