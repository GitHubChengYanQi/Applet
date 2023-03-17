<template>
  <view class="background">
    <SkuItem></SkuItem>
    <view class="warper">
      <view class="left">
        <CardItem label="数量">× 1</CardItem>
        <CardItem label="数量">× 1</CardItem>
        <CardItem label="数量">× 1</CardItem>
        <CardItem label="数量">× 1</CardItem>
        <CardItem label="数量">× 1</CardItem>
        <CardItem label="数量">× 1</CardItem>
      </view>
      <view class="right">
        <CardItem label="单价">100人民币</CardItem>
      </view>
    </view>


  </view>
</template>

<script>
import SkuItem from "@/components/SkuItem";
import CardItem from "@/components/Card/CardItem";

export default {
  name:'Matter',
  components: {
    CardItem,
    SkuItem
  },
}

</script>

<style scoped>
.background{
  padding: 12px;
  background-color: #FFFFFF;
  margin-bottom: 3px;
}
.warper{
  display: flex;
  margin-top: 16px;
}
.left,.right{
  flex: 1;
}

</style>