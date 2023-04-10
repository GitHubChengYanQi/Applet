<template>
  <view class="back">
    <view class="popupContent">
      <Search placeholder="请输入供应商信息"></Search>
      <view class="content" v-for="item in list" @click="click(item)">
        <view class="information">{{ item.customerName }}</view>
      </view>
    </view>
  </view>
</template>

<script>
import Search from "@/components/Search";
import {
  request
} from 'MES-Apis/lib/Service/request';

export default {
  components: {Search},
  data(){
    return{
      list:[]
    }
  },
  mounted() {
    this.get();
  },
  methods:{
    get(){
      const _this = this;
      request({
        url:"/supplier/list",
        method:"POST",
        data:{}
      }).then(res=>{
        console.log(res);
        _this.list = res.data;
      });
    },
    click(item){
      uni.$emit("supplierChange", item);
      uni.navigateBack();
    }
  }


}
</script>

<style lang="scss">
.back{
  background-color: #FFFFFF;
}
.select{
  display: flex;
  justify-content: space-between;
  padding: 0 12px;
  .selectText{
    color: #257bde;
    line-height: 45px;
  }
  .selectTitle{
    font-size: 18px;
    line-height: 45px;
  }
}
.popupContent{
  padding: 12px;
  .content{
    display: flex;
    border-top: 1px solid #f5f5f5;
    border-bottom: 1px solid #f5f5f5;
    padding:6px 0;
    .information{
      flex: 1;
      padding-left: 12px;
    }
  }
}
</style>