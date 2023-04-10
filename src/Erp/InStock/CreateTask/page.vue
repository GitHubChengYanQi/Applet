<template>
  <view>
    <form>
      <Card title="物料明细" extra="合计：1类 1件">
        <view class="detailed" v-for="item in list">
          <SkuItem style="flex: 1" :skuResult="item.skuResult">
            <view slot="otherData">123</view>
          </SkuItem>
          <view class="detailedRight">
            <!--          <uni-icons type="trash-filled" size="20" color="#ff3141" @click="deleted"></uni-icons>-->
            <view class="keybord">× {{ item.num }}</view>
          </view>
        </view>

      </Card>
      <Card title="主题">
        <u--input
            placeholder="请输入"
            border="none"
            v-model="theme"
            slot="extra"
            inputAlign="right"
        ></u--input>
      </Card>
      <Card title="供应商">
        <view @click="choose" slot="extra" class="choose">{{ sCustomerName }}</view>
      </Card>
      <Card title="入库类型">
        <view slot="extra" @click="inStock">{{ instockType.label || '请选择' }}</view>
      </Card>
      <Card title="注意事项">
        <view style="padding: 12px 0">
          <view :class="zysx.findIndex(i=>item.value===i)===-1?'warn':'warn2'" v-for="item in list2"
                @click="choosed(item.value)">{{ item.label }}
          </view>
          <view class="warn" @click="AddName">其他</view>
        </view>
        <!--      <view class="addName">-->
        <!--        <input class="uni-input" placeholder="请输入注意事项和名称" />-->
        <!--        <view class="preserve">-->
        <!--          <span class="cancel">取消</span>-->
        <!--          <view class="space"></view>-->
        <!--          <span class="preserveText">保存</span>-->
        <!--        </view>-->
        <!--      </view>-->
      </Card>
      <Card title="添加备注">
        <u--input
            placeholder="可@相关人员"
            border="none"
        ></u--input>
      </Card>
      <Card title="上传附件">
        <view>
          <u-upload
              :fileList="fileList1"
              @afterRead="afterRead"
              @delete="deletePic"
              name="1"
              multiple
              :maxCount="10"
          ></u-upload>
        </view>
      </Card>
      <BottomButton right-text="提交" @rightOnClick="onSubmit"></BottomButton>
      <u-picker :show="show4" :columns="columns" cancelColor="#257bde" closeOnClickOverlay @confirm="define"
                @close='close' @cancel="close" keyName="label"></u-picker>
      <u-modal :show="show2" :closeOnClickOverlay="true" showCancelButton @cancel="this.show2=false" @confirm="close"
               @close='close' cancelColor="#2680EB">
        <view>
          <view class="img">
            img
          </view>
          <view class="point">
            是否确认删除?
          </view>
        </view>
      </u-modal>
    </form>
  </view>
</template>

<script>
import Card from "@/components/Card";
import SkuItem from "@/components/SkuItem";
import Search from "@/components/Search";
import Supplier from "@/Crm/Supplier/page";
import {request} from "MES-Apis/lib/Service/request";
import BottomButton from "@/components/BottomButton";

export default {
  components: {Supplier, Card, SkuItem, Search, BottomButton},


  data() {
    return {
      theme:"",
      value: '',
      show2: false,
      show3: false,
      show4: false,
      show5: false,
      submitList: [],
      columns: [
        [
          {label: '采购入库', value: 'PURCHASE_INSTOCK'},
          {label: '生产入库', value: 'PRODUCTION_INSTOCK'},
          {label: '生产退库', value: 'PRODUCTION_RETURN'},
          {label: '客户退货', value: 'CUSTOMER_RETURN'},
        ]
      ],
      customer: {},
      list2: [],
      zysx: [],
      instockType: {}
    }
  },
  props: ["list"],
  computed: {
    sCustomerName() {
      return this.customer.customerName || "请选择供应商"
    }
  },
  mounted() {

    console.log(this.list)
    uni.$on("supplierChange", (item) => {
      console.log(item)
      this.customer = item
    })
    this.get();
  },
  methods: {
    get() {
      const _this = this;
      request({
        url: "/announcements/listSelect",
        method: "POST",
        data: {
          type: "inStock"
        }
      }).then(res => {
        console.log(res);
        _this.list2 = res.data;
      });
    },
    close() {
      this.show2 = false;
      this.show3 = false;
      this.show4 = false;
    },

    deleted() {
      this.show2 = true
    },
    choose() {
      uni.navigateTo({url: "/Crm/Supplier/index"});
    },
    inStock() {
      this.show4 = true;
    },
    AddName() {
      this.show5 = true;
    },
    choosed(value) {
      console.log(value)
      const tmpList = this.zysx;
      const index = tmpList.findIndex(i => value === i);
      if (index === -1) {
        this.zysx = [...tmpList, value]
      } else {
        tmpList.splice(index, 1)
        this.zysx = [...tmpList]
      }
    },
    onSubmit() {
      const _this = this;
      request({
        url: "/instockOrder/add",
        method: "POST",
        data: {
          customerId: _this.customer.customerId,
          instockType: _this.instockType.value,
          listParams: _this.list.map(item => ({
            brandId: item.brandId,
            skuId: item.skuId,
            number: item.num
          })),
          module: "createInstock",
          shopCardType: "inStock",
          theme: _this.theme,
          type: "purchaseOrder"
        }
      })
    },
    define(values) {
      this.show4 = false;
      console.log(values)
      this.instockType = values.value[0];

    },
    change() {
      console.log(this.inStock)
    }
  }
}
</script>

<style lang="scss">
.detailed {
  display: flex;
  padding: 8px;

  .detailedRight {
    display: flex;
    flex-direction: column;
    text-align: right;
    justify-content: space-evenly;
  }
}

.keybord {
  border: 1px solid #D9D9D9;
  padding: 2px 8px;
  text-align: center;
  margin-top: 8px;
}

.point {
  text-align: center;
  color: #999;
}

.choose {
  color: #257bde;
}


.warn {
  display: inline-block;
  margin: 0 4px 4px 4px;
  border-radius: 2px;
  background: #F5F5F5;
  border: 1px solid #D9D9D9;
  padding: 0 8px;
  text-align: center;
  height: 27px;
  line-height: 27px;
  width: calc(30% - 14px);
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.warn2 {
  display: inline-block;
  margin: 0 4px 4px 4px;
  border-radius: 2px;
  background: #E1EBF6;
  border: 1px solid #007FFF;
  padding: 0 8px;
  text-align: center;
  height: 27px;
  line-height: 27px;
  width: calc(30% - 14px);
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.addName {
  display: flex;

  .uni-input {
    flex: 1;
    border: 1px solid #d9d9d9;
    padding: 4px 8px;
  }

  .preserve {
    display: flex;
    background-color: #2680EB;
    text-align: center;
    height: 32px;
    line-height: 32px;
    border-radius: 2px;

    .preserveText {
      color: #FFFFFF;
      min-width: 60px;
    }

    .cancel {
      color: rgba(255, 255, 255, 0.7);
      min-width: 60px;

    }

    .space {
      margin: auto 0;
      width: 1px;
      height: 50%;
      background-color: rgba(255, 255, 255, 0.3);
      line-height: 30px;

    }
  }
}

</style>