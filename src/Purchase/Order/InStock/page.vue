<template>
  <view>
    <view style="padding-bottom: 200px;">
      <view class="card">
        <view class="header" style="border: none" @click="visible = 'date'">
          <view class="title" style="margin: 0">日期</view>
          <view class="flexGrow" v-if="defaultValue.date">
            {{ defaultValue.date }}
          </view>
          <view class="flexGrow" v-else>{{ date }}</view>
          <u-icon name="arrow-right"></u-icon>
        </view>
      </view>
      <view class="card">
        <view class="header" @click="()=> onClick(visible = 'sellerId')">
          <view class="title">供应商</view>
          <view class="flexGrow" style="margin: 0 0 9px 0;max-width: calc(100% - 116px)" v-if="defaultValue.sellerName">
            {{ defaultValue.sellerName }}
          </view>
          <view class="flexGrow" style="margin: 0 0 9px 0;max-width:calc(100% - 116px)" v-else>默认供应商</view>
          <view style="margin: 0 0 9px 0">
            <u-icon name="arrow-right"></u-icon>
          </view>
        </view>
        <view class="header" style="margin: 12px 0 0 0;border: none" @click="visible = 'purchaser'">
          <view class="title" style="margin: 0">采购员</view>
          <view class="flexGrow" v-if="defaultValue.purchaserName">
            {{ defaultValue.purchaserName }}
          </view>
          <view class="flexGrow" v-else></view>
          <u-icon name="arrow-right"></u-icon>
        </view>
      </view>
      <view class="card">
        <view class="header" @click="visible = 'storehousePositionsId'">
          <view class="title">仓库</view>
          <view class="flexGrow" style="margin: 0 0 9px 0" v-if="defaultValue.storehousePositionsName">
            {{ defaultValue.storehousePositionsName }}
          </view>
          <view class="flexGrow" style="margin: 0 0 9px 0" v-else>默认仓库</view>
          <view style="margin: 0 0 9px 0">
            <u-icon name="arrow-right"></u-icon>
          </view>
        </view>
        <view class="header" style="margin: 12px 0 0 0;border: none">
          <view class="title" style="margin: 0;">备注</view>
          <u--input
              placeholder="请输入"
              border="none"
              fontSize="14px"
              :value="defaultValue.remark"
              @input="(value)=>change('remark',value)"
              maxlength="10"
          ></u--input>
        </view>
      </view>
      <view class="card">
        <!--        <view class="left">-->
        <!--          <u-button-->
        <!--              type='primary'-->
        <!--              color="#f5f5f5"-->
        <!--          >-->
        <!--            <view style="color: #000000">扫码添加</view>-->
        <!--          </u-button>-->
        <!--        </view>-->
        <view class="right">
          <u-button
              type='primary'
              color="#f5f5f5"
              @click="click"
          >
            <view style="color: #000000">手动添加</view>
          </u-button>
        </view>
      </view>

    </view>


    <BottomButton
        only=""
        text="保存"
    />

    <u-datetime-picker
        mode="date"
        :show="visible === 'date'"
        ref="datetimePicker"
        v-model="dateValue"
        :formatter="formatter"
        title="时间选择"
        @cancel="visible = ''"
        @confirm="(value) => onConfirm('date',value)"
        closeOnClickOverlay="true"
        @close="visible = '' ">
    </u-datetime-picker>

    <u-picker
        :show="['purchaser'].includes(visible)"
        :columns="[[userInfo.name]]"
        @close="visible = ''"
        closeOnClickOverlay="true"
        @cancel="visible = ''"
        @confirm="(value) => purchaserChange('purchaserName',value)"
    />

    <u-picker
        :show="['storehousePositionsId'].includes(visible)"
        :columns="[isArray(storeHouseData).map(item => {
          return {
            label: item.name,
            id: item.storehouseId
          }
        })]"
        @close="visible = ''"
        keyName="label"
        closeOnClickOverlay="true"
        @cancel="visible = ''"
        @confirm="(value) => onChange('storehousePositionsName','storehousePositionsId',value)"
    />


    <Loading :loading="loading"/>

  </view>
</template>
<script>
import BottomButton from "@/components/BottomButton/index.vue";
import Loading from "@/components/Loading/index.vue";
import {request} from "MES-Apis/lib/Service/request";
import {isArray} from "@/util/Tools";
import moment from "moment/moment";
import {User} from "MES-Apis/lib/User/promise";

export default {
  name: "page",
  components: {Loading, BottomButton},
  data() {
    return {
      visible: '',
      userInfo: {},
      defaultValue: {},
      storeHouseData: {},
      date: '',
      dateValue: Number(new Date()),
      loading: true,
    }
  },
  mounted() {
    this.get()
  },
  methods: {
    isArray,
    async get() {
      const _this = this
      this.date = moment(this.dateValue).format('YYYY-MM-DD')
      const userRes = await User.getUserInfo()
      this.userInfo = userRes.data || {}
      this.loading = true
      _this.selfEnterpriseDetail()
      _this.storeHouseList()
      this.loading = false
    },
    selfEnterpriseDetail() {
      const _this = this
      return request({
        url: "/selfEnterprise/detail",
        method: 'post',
        data: {}
      }).then(async res => {
        let info = {
          buyerId: res.data.customerId,
          buyerName: res.data.customerName,
          partyAAdressId: res.data.defaultAddress,
          partyAAdressName: res.data.address?.detailLocation || res.data.address?.location,
          partyAContactsId: res.data.defaultContacts,
          partyAContactsName: res.data.contact?.contactsName,
          partyABankId: res.data.invoiceResult?.bankId,
          partyABankName: res.data.invoiceResult?.bankResult?.bankName,
          partyABankAccount: res.data.invoiceResult?.invoiceId,
          partyABankAccountName: res.data.invoiceResult?.bankAccount,
          partyABankNo: res.data.invoiceResult?.bankNo,
        };
        _this.defaultValue = {
          ..._this.defaultValue,
          ...info
        }
      })
    },
    storeHouseList() {
      return request({
        url: "/storehouse/list",
        method: 'post',
        data: {}
      }).then(res => {
        const _this = this
        _this.storeHouseData = res.data
      })
    },
    onClick(visible) {
      if (visible === 'sellerId') {
        uni.navigateTo({
          url: `/Crm/Supplier/index`
        })
      }
    },
    click() {
      uni.navigateTo({
        url: `/Purchase/Order/SelectProduct/index`
      })
    },
    change(key, e) {
      this.defaultValue = {
        ...this.defaultValue,
        [key]: e
      }
    },
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`
      }
      if (type === 'month') {
        return `${value}月`
      }
      if (type === 'day') {
        return `${value}日`
      }
    },
    onConfirm(key, e) {
      this.defaultValue = {
        ...this.defaultValue,
        [key]: moment(e.value).format('YYYY-MM-DD')
      }
      this.visible = ''
    },
    purchaserChange(key, e) {
      this.defaultValue = {
        ...this.defaultValue,
        [key]: e.value[0]
      }
      this.visible = ''
    },
    onChange(key, id, e) {
      if (e.value[0] !== undefined && e.value[0].id === undefined) {
        this.defaultValue = {
          ...this.defaultValue,
          [key]: (e.value[0] !== undefined) && (e.value[0].label),
          [id]: (e.value[0] !== undefined) && (e.value[0].value)
        }
      } else {
        this.defaultValue = {
          ...this.defaultValue,
          [key]: (e.value[0] !== undefined) && (e.value[0].label),
          [id]: (e.value[0] !== undefined) && (e.value[0].id)
        }
      }
      console.log(this.defaultValue)
      this.visible = ''
    }
  }
}
</script>

<style lang="scss">

.card {
  background-color: #fff;
  padding: 12px;
  font-size: 14px;
  border-radius: 10px;
  margin: 12px 10px 3px 10px;

  .header {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #F5F5F5;

    .title {
      flex-grow: 1;
      max-width: 100px;
    }

    .flexGrow {
      flex-grow: 1;
    }
  }

  //.left {
  //  width: 49%;
  //  display: inline-block;
  //
  //  button {
  //    height: 40px;
  //    padding: 0;
  //    font-size: 14px;
  //    width: 100%;
  //    border-radius: 50px 0 0 50px;
  //    border-right: none;
  //  }
  //}

  .right {
    width: 100%;
    display: inline-block;
    margin-left: 3px;

    button {
      height: 40px;
      padding: 0;
      font-size: 14px;
      width: 100%;
      //border-radius: 0 50px 50px 0;
      border-radius: 50px;
      border-right: none;
    }
  }
}

.button {
  display: flex;
  background-color: #f5f5f5;
  height: 45px;
  align-items: center;
  font-size: 14px;
  border-radius: 10px;
  margin: 5px 10px 0 10px;
  padding: 0 10px 0 10px;
}

.title {
  color: #666666;
  display: flex;
  align-items: center;
  margin: 0 0 9px 0;
}

</style>