<template>
<view class="card-item">
  <view :style="{width:labelWidth}" class="label">
    {{label}}
  </view>
  <view>:</view>
  <view class="content"><slot></slot></view>
</view>
</template>

<script>
export default {
  name: "CardItem",
  props:{
    label:String,
    'label-width':{
      type:String,
      default() {
        return '80px';
      }
    }
  }
}
</script>

<style scoped>
.card-item{
  display: flex;
  height: 20px;
  line-height: 20px;
  margin-bottom: 8px;
}
.label{
  text-align: justify;
  text-align-last: justify;
  color: #9d9d9d;
}
.content{
  margin-left: 8px;
}
</style>