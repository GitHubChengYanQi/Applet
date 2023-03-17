<template>
  <view class="body">
    <view class="search">
      <u-search placeholder="请输入搜索内容" showAction shape="square" :focus="true" :actionStyle="actionStyle" @search="search" v-model="value" @custom="search"></u-search>
    </view>
    <view class="chronicle">
      <view class="history">
        <view class="notes">历史记录</view>
        <view @click="delet">
          <uni-icons type="trash-filled" size="18" color="#ff3141"></uni-icons>
        </view>

      </view>
      <view class="content">
        <view>123</view>
      </view>
    </view>
    <u-modal :show="show" :title="title" :content='content' showCancelButton @confirm="confirm" @cancel="close" :closeOnClickOverlay="true"></u-modal>
  </view>

</template>

<script>
export default {
  name: "",
  components: {},
  data(){
    return{
      eventName:"",
      value:'',
      show:false,
      title:'标题',
      content:'uView的目标是成为uni-app生态最优秀的UI框架',
      actionStyle:{
        color:"#2680EB"
      }
    }
  },
  onLoad(params){
    console.log(params)
    this.eventName = params.eventName||"";
  },
  methods:{
    delet(){
      this.show = true;
    },
    close(){
      this.show = false;
    },
    confirm(){

    },
    search(){
      console.log(123333)
      uni.$emit(this.eventName||'search',{msg:this.value});
      uni.navigateBack();
    }
  }
}
</script>

<style lang="scss">
.body{
  background-color: #FFFFFF;
  height: 100vh;
  .chronicle{
    padding: 12px;
  }
  .search{
    padding: 12px;
  }
  .history{
    display: flex;
  }
  .notes{
    font-size: 14px;
    font-weight:bold;
    flex-grow: 1;
  }
  .content{
    padding: 4px 12px;
    font-size: 12px;
  }
}

</style>