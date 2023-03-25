<template>
  <view>
    <view class="search">
      <Search></Search>
    </view>
    <view class="filter">
      <view class="classify" @click="click">
        <view class="title">{{title}}</view>
        <view class="icon">
          <uni-icons type="bottom" size="12" ></uni-icons>
        </view>
      </view>

      <view class="classify" @click="warning">
        <view class="title">预警状态</view>
        <view class="icon">
          <uni-icons type="bottom" size="12"></uni-icons>
        </view>
      </view>
    </view>
    <u-popup :show="show" @close="close">
    <view class="header">
      <link-button class="cancel" @click="close">取消</link-button>
      <view class="choose">选择分类</view>
      <link-button class="define">确定</link-button>
    </view>
      <van-cascader  :options="cateGoryData" @finish="onFinish" :closeable="false" value='checked'/>
  </u-popup>
    <u-picker :show="show2" :columns="columns" @cancel="close" closeOnClickOverlay keyName="text"></u-picker>
    <view class="list">
      <SkuItem>
        <view slot="otherData" class="number">
          <view>在途数量：10</view>
          <view class="waite">待采数量：0</view>
        </view>
        <view slot="otherData" class="storage">
          <view>库存下限：3</view>
          <view class="grey">库存上限：2</view>
        </view>

      </SkuItem>
    </view>
    <view class="list">
      <SkuItem>
        <view slot="otherData" class="number">
          <view>在途数量：10</view>
          <view class="waite">待采数量：0</view>
        </view>
        <view slot="otherData" class="storage">
          <view>库存下限：3</view>
          <view class="grey">库存上限：2</view>
        </view>

      </SkuItem>
    </view>
    <view class="list">
      <SkuItem>
        <view slot="otherData" class="number">
          <view>在途数量：10</view>
          <view class="waite">待采数量：0</view>
        </view>
        <view slot="otherData" class="storage">
          <view>库存下限：3</view>
          <view class="grey">库存上限：2</view>
        </view>

      </SkuItem>
    </view>
    <view class="list">
      <SkuItem>
        <view slot="otherData" class="number">
          <view>在途数量：10</view>
          <view class="waite">待采数量：0</view>
        </view>
        <view slot="otherData" class="storage">
          <view>库存下限：3</view>
          <view class="grey">库存上限：2</view>
        </view>

      </SkuItem>
    </view>
  </view>
</template>

<script>
import Search from '../../components/Search'
import LinkButton from "@/components/LinkButton";
import {request} from "MES-Apis/uitl/Service/request";
import SkuItem from "@/components/SkuItem";
export default {
  components:{
    LinkButton,
    Search,
    SkuItem
  },
  data(){
    return{
      checked:[],
      show:false,
      show2:false,
      cateGoryData:[],
      columns:[
        [{
          text: '全部',
          key:1
         },
          {
            text: '下限预警',
            key:2
          },
          {
            text: '上限预警',
            key:3
          }]
      ]
    }
  },
  computed:{
    title(){
      return Object.keys(this.checked).length>0?this.checked.text:"物料分类";
    },
  },
  mounted() {
    this.getCateGory();
  },
  methods:{
    click(){
      this.show = true;
    },
    close(){
      this.show = false;
      this.show2 = false;
    },
    warning(){
      this.show2 = true;
    },
    async getCateGory() {
      const response = await request({
        url: "/spuClassification/treeView",
        method: "POST",
        data: {
          isNotproduct: 1
        }
      });
      const {
        data
      } = response;
      this.cateGoryData = this.format(data);
      console.log(this.cateGoryData);
      // this.cateGoryData = data;
    },
    format(data){
      const list=[];
      for(var i=0;i<data.length;i++){
        const item = data[i];
        const obj = {
          text:item.title,
          value:item.key
        }
        if(item.children.length>0){
          obj.children = this.format(item.children);
        }
        list.push(obj);
      }
      return list;
    },
    async onFinish(e) {
      console.log(e);
      this.show = false;
      console.log(e.detail);
      const { selectedOptions, value } = e.detail;
      console.log(e.detail);
      this.checked = selectedOptions[0];
    }
  }
}
</script>

<style lang="scss">
.search{
  background-color: #FFFFFF;
  padding:  0 12px;
}
.filter{
  display: flex;
  background-color: #FFFFFF;
  font-size: 12px;
  color: #8d8d8d;
  text-align: center;
  .classify{
    flex-grow: 1;
    display: flex;
    padding:12px 8px;
    .title{
      flex: 1;
    }
    .icon{
      width: 12px;
    }
  }
}

.header{
  height: 45px;
  display: flex;
  border-bottom: 1px solid #EEEEEE;
  justify-content: space-between;
  line-height: 45px;
  padding: 0 12px;

  .choose{
    font-size: 18px;
    text-align: center;
    color: #333333;
    margin: auto 0;
  }
}

.list{
  background-color: #FFFFFF;
  padding: 12px;
  .number{
    font-size: 12px;
    color: #00A200;
    display: flex;
    .waite{
      margin-left: 5px;
    }
  }
  .storage{
    font-size: 12px;
    color: #ff3141;
    display: flex;
    .grey{
      color: #9A9A9A;
      margin-left: 5px;
    }
  }
}
</style>