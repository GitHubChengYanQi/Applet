<template>
  <view class="box">
    <view class="header">
      <view class="title">{{title}}</view>
      <slot name="right"></slot>
    </view>
     <slot name="content"></slot>
  </view>
</template>

<script>
export default {
  name: "MenuCard",
  props:['title'],
  components: {},
data(){
    return{
      src:'../../../../static/创建采购单.png'
    }
}
}
</script>

<style lang="scss">
.box{
  margin-bottom: 22px;
}
.header{
  display: flex;
  font-size: 14px;
  justify-content: space-between;
  padding: 11px 5px;
  .title{
    font-weight: bold;
  }
}

</style>
