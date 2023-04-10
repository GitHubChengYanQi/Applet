<template>
  <view>
    <u-skeleton
        rows="10"
        title
        :loading="Object.keys(form).length===0"
    >
      <Card title="基本信息">
        <CardItem label="订单编码">
          {{form.coding}}
        </CardItem>
        <CardItem label="主题">
          {{form.theme}}
        </CardItem>
        <CardItem label="创建人">
          这个是内容
        </CardItem>
        <CardItem label="创建时间">
          {{ form.createTime }}
        </CardItem>
      </Card>
      <Card title="买方信息">
        <CardItem label="公司名称">
          {{form.acustomer.customerName}}
        </CardItem>
        <CardItem label="联系人">
          {{form.acontacts.contactsName}}
        </CardItem>
        <CardItem label="联系人电话">
          {{form.aContactsPhone}}
        </CardItem>
        <CardItem label="公司地址">
          {{form.aadress.detailLocation}}
        </CardItem>
        <CardItem label="开户银行">
          {{form.abank.bankName}}
        </CardItem>
        <CardItem label="开户行账号">
          {{form.partyABankAccount}}
        </CardItem>
      </Card>
      <Card title="卖方信息">
        <CardItem label="公司名称">
          {{form.bcustomer.customerName}}
        </CardItem>
        <CardItem label="联系人">
          {{form.bcontacts.contactsName}}
        </CardItem>
        <CardItem label="联系人电话">
          {{form.bContactsPhone}}
        </CardItem>
        <CardItem label="公司地址">
          {{form.badress.location}}
        </CardItem>
        <CardItem label="开户银行">
          {{form.bbank.bankName}}
        </CardItem>
        <CardItem label="开户行账号">
          {{form.partyBBankAccount}}
        </CardItem>
      </Card>
      <Card title="产品明细">
        <view style="display: flex">
          <view >入库进度：</view>
          <view class="percent">
            <progress stroke-width="10" :percent='form.inStockRate' show-info  border-radius="8px" />
          </view>
        </view>
        <view class="content" v-for="(item) in form2">
          <view style="flex: 1">
            <SkuItem :skuResult="item.skuResult">
              <view slot="otherData">{{item.skuResult.standard}}</view>
            </SkuItem>
          </view>
          <view class="right">
            <view class="formula">
              <view style="font-weight: bold">
                {{ item.sign }}
              </view>
              <view class="number">
                {{item.onePrice}}
              </view>
              <span style="margin: 0 4px">×</span>
              {{item.purchaseNumber}}{{item.unit?item.unit.unitName:""}}
              <span style="margin: 0 4px">=</span>
              <view style="font-weight: bold;color:#ff0000;">
                {{ item.sign }}
              </view>
              <view class="number2">
                {{item.totalPrice}}
              </view>
            </view>
            <view class="statistics">
              <view>已到货</view>
              <view class="arrival">
                {{item.arrivalNumber}}
              </view>
            </view>
            <view class="statistics">
              <view>已入库</view>
              <view class="inStock">
                {{item.inStockNumber}}
              </view>
            </view>
          </view>
        </view>
      </Card>
      <Card title="财务信息">
        <CardItem label="总金额">
          <view class="formula">
            <view class="formula" v-if="form.paymentResult.floatingAmount!==0">
            <view style="font-weight: bold">
              ￥
            </view>
            <view class="number">
              {{form.paymentResult.money}}
            </view>
              <span style="margin: 0 4px">+</span>
              <view style="font-weight: bold">
                ￥
              </view>
              <view class="number">
                {{form.paymentResult.floatingAmount}}
              </view>
            <span style="margin: 0 4px">=</span>
          </view>
            <view style="font-weight: bold;color:#ff0000;">
              ￥
            </view>
            <view class="number2">
              {{form.paymentResult.totalAmount}}
            </view>
          </view>
        </CardItem>
        <CardItem label="币种">
          {{form.currency}}
        </CardItem>
        <CardItem label="票据类型">
          {{form.paymentResult.paperType ? '专票' : '普票'}}
        </CardItem>
        <CardItem label="是否含运费">
          {{ form.paymentResult.freight ? '是' : '否' }}
        </CardItem>
        <CardItem label="结算方式">
          {{form.payMethod || '---'}}
        </CardItem>
        <view style="display: flex">
          <view >付款进度：</view>
          <view class="percent">
            <progress stroke-width="10" :percent='form.paymentRate' show-info  border-radius="8px" />
          </view>
        </view>
      </Card>
      <Card title="请款记录">
        <CardItem label="这个是标题">
          这个是内容
        </CardItem>
      </Card>
      <Card title="付款记录">
        <view style="border-top:1px solid #f0f0f0">
          <view class="information" v-for="(item,index) in form3">
            <CardItem label="金额">
              <span>￥</span>
              {{item.paymentAmount}}
            </CardItem>
            <CardItem label="附件">
              <view class="link" @click="click2(index)">
                {{ Array.isArray(item.mediaUrlResults)?item.mediaUrlResults.length:0 }} 个（查看）
              </view>
            </CardItem>
            <CardItem label="付款时间">
              {{item.paymentDate}}
            </CardItem>
            <CardItem label="备注">
              {{item.remark}}
            </CardItem>
          </view>
        </view>
      </Card>
      <Card title="发票信息">
        <view style="border-top:1px solid #f0f0f0">
          <view class="information" v-for="(item,index) in form4">
            <CardItem label="发票名称">
              {{item.name}}
            </CardItem>
            <CardItem label="金额">
              <span>￥</span>
              {{item.money}}
            </CardItem>
            <CardItem label="附件">
              <view class="link" @click="click(index)">
                {{ Array.isArray(item.mediaUrlResults)?item.mediaUrlResults.length:0 }} 个（查看）
              </view>
            </CardItem>
            <CardItem label="发票日期">
              {{item.invoiceDate}}
            </CardItem>
          </view>
        </view>
      </Card>
    </u-skeleton>
    <u-popup :show="show" mode="center" @close="close" closeable	>
      <view class="form">
        <view class="title">查看附件</view>
        <view class="tabulation">
          <view class="row" v-for="item in showImglist" @click="big(item.url)">
            <image mode="aspectFit" :src="item.thumbUrl" style="width: 48px; height: 48px"></image>
            <view class="detailed">{{item.filedName}}</view>
          </view>
        </view>
<!--        <image v-for="(item) in form4" v-for="(mediaUrlResult) in item.mediaUrlResults" style="width: 200px; height: 200px; background-color: #eeeeee;" :mode="item.mode" :src="mediaUrlResult.thumbUrl"></image>-->
      </view>
    </u-popup>
    <view class="space"></view>
    <view class="button" :style="{paddingBottom:bottom}">
      <u-button type="primary" text="确认到货" shape="circle" @click="go"></u-button>
    </view>
  </view>
</template>

<script>
import Card from "@/components/Card";
import CardItem from "@/components/Card/CardItem";
import Matter from "@/Purchase/Order/OrderDetail/components/Matter";
import {Order} from "MES-Apis/lib/Order/promise";
import SkuItem from "@/components/SkuItem";
import {request} from "MES-Apis/lib/Service/request";
export default {
  name: 'OrderDetail',
  components: {Card,CardItem,Matter,SkuItem},
  props: ['orderId'],
  data() {
    return {
      bottom:0,
      src: process.env.VUE_APP_PAGE_URL,
      form:{},
      form2:[],
      form3:[],
      form4:[],
      show:false,
      showImglist:[]
    }
  },
  mounted() {
    const _this = this;
    uni.getSystemInfo({
      success: function (res) {
        _this.bottom = res.safeAreaInsets.bottom+'px';
      }
    })
    // console.log();
    Order.detail(this.orderId,{}).then(response=>{
      console.log(response.data);
      this.form=response.data
    })
    request({
      url: '/orderDetail/list',
      method: 'POST',
      data:{
        orderId:_this.orderId
      }
    }).then(response=>{
      this.form2=response.data
    });

    request({
      url: '/paymentRecord/list',
      method: 'POST',
      data:{
        orderId:_this.orderId
      }
    }).then(response=>{
      this.form3=response.data
    });

    request({
      url: '/invoiceBill/list',
      method: 'POST',
      data:{
        orderId:_this.orderId
      }
    }).then(response=>{
      this.form4=response.data
    });
  },
  methods:{
    go(){
      uni.navigateTo({
        url: `/Purchase/Order/ConfirmArrival/index?id=${this.orderId}`
      })
    },
    click(index){
      console.log(this.form4[index]);
      this.showImglist = this.form4[index].mediaUrlResults;
      this.show=true
    },
    click2(index){
      console.log(this.form3[index]);
      this.showImglist = this.form3[index].mediaUrlResults;
      this.show=true
    },
    close(){
      this.show=false
    },
    big(current){
      const urls = this.showImglist.map(item=>{
        return item.url;
      });
      console.log(urls)
      console.log(current)
      if(1){
        uni.previewImage({
          urls,
          current,
          longPressActions: {
            // itemList: ['发送给朋友', '保存图片', '收藏'],
            success: function(data) {
              console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
            },
            fail: function(err) {
              console.log(err.errMsg);
            }
          }
        });
      }else{
        uni.saveFile({
          tempFilePath: tempFilePaths[0],
          success: function (res) {
            var savedFilePath = res.savedFilePath;
          }
        });
      }
    }
  }

}
</script>
<style lang="scss">
.button{
  background-color: #FFFFFF;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 8px;
}
.space{
  height: 82px;
  width: 100%;
}
.percent{
  width:80%;
}
.content{
  margin-top: 8px;
  display: flex;
}
.right{
  margin: auto 0;
  flex-direction: column;
  text-align: right;
}
.formula{
  display: flex;
  align-items: flex-end;
  margin-right: 6px;
}
.number{
  font-size: 18px;
  font-weight: bold;
  margin-left: 4px;
}
.number2{
  font-size: 18px;
  font-weight: bold;
  margin-left: 4px;
  color: #ff0000;
}
.arrival{
  color: #1677ff;
  margin-left: 10px;
}
.inStock{
  color:#52C41A;
  margin-left: 10px;
}
.statistics{
  display: flex;
  justify-content: flex-end;
  margin: 4px 6px;
}
.information{
  padding: 12px 12px 2px 12px;
  border-bottom: 1px solid #f0f0f0;
}
.link{
  color: #257BDE;
}
.form{
  background-color: #FFFFFF;
  border-top: 3px solid #257bde;
}
.title{
  width: 300px;
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
}
.tabulation{
  padding:16px;
}
.row{
  border: 1px solid #d9d9d9;
  padding: 8px;
  display: flex;
  width: 300px;
}
.detailed{
  margin: auto 0;
  padding: 0 8px;
  color: #257bde;
  width: 80%;
  word-break: break-all;
}
</style>
