<template>
  <view>
    <view style="padding-bottom: 200px;">
      <view class="card">
        <view class="header" style="border: none" @click="visible = 'date'">
          <view class="title" style="margin: 0">日期</view>
          <view class="flexGrow">
            {{ formData.date || '请选择日期' }}
          </view>
          <u-icon name="arrow-right"/>
        </view>
      </view>
      <view class="card">
        <view class="header" @click="visible = 'customer'">
          <view class="title">客户</view>
          <view
              :class="{flexGrow:true,placeholder:!formData.customerId}"
              style="margin: 0 0 9px 0;max-width: calc(100% - 116px)"
          >
            {{ formDataRender.customerName || '请选择客户' }}
          </view>
          <view style="margin: 0 0 9px 0">
            <u-icon name="arrow-right"/>
          </view>
        </view>
        <view class="header" style="margin: 12px 0 0 0;border: none" @click="selectUser">
          <view class="title" style="margin: 0">领料人</view>
          <view :class="{flexGrow:true,placeholder:!formData.userId}">
            {{ formDataRender.user ? formDataRender.user.name : '请选择领料人' }}
          </view>
          <u-icon name="arrow-right"></u-icon>
        </view>
      </view>
      <view class="card">
        <view class="header" @click="visible = 'storehouse'">
          <view class="title">仓库</view>
          <view :class="{flexGrow:true,placeholder:!formData.storeHouseId}" style="margin: 0 0 9px 0">
            {{ formDataRender.storeHouseName || '请选择仓库' }}
          </view>
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
              v-modal="formData.remark"
              maxlength="10"
          ></u--input>
        </view>
      </view>
      <view class="card">
        <view class="right">
          <u-button
              type='primary'
              color="#f5f5f5"
              @click="click"
          >
            <view class="addButton">
              手动添加
              <u-badge max="99" :value="shopCartApplyList.length"/>
            </view>
          </u-button>
        </view>
      </view>
    </view>


    <BottomButton
        only=""
        text="保存"
        @onClick="save"
        :loading="saveLoading"
    />

    <SelectCustomer
        :value="formData.unitId"
        :label="formDataRender.customerName"
        :show="visible === 'customer'"
        @close="visible = ''"
        @select="selectCustomer"
    />

    <Popup
        @close="visible = ''"
        :show="visible === 'storehouse'"
        position="bottom"
        @onLeft="visible = ''"
        left-text="取消"
        right-text="确定"
        title="选择仓库"
        @onRight="visible = ''"
        @closeAfter="showContent = false"
        @showBefore="showContent = true"
    >
      <Loading skeleton v-if="storeTreeLoading"/>
      <Cascader
          v-else-if="showContent"
          :data="storeHouseData"
          :value="formData.storeHouseId"
          @change="onFinish"
          @close="visible = ''"
      />
    </Popup>

    <u-datetime-picker
        mode="date"
        :show="visible === 'date'"
        ref="datetimePicker"
        :value="formData.date"
        :formatter="formatter"
        title="时间选择"
        @cancel="visible = ''"
        @confirm="dateChange"
        closeOnClickOverlay="true"
        @close="visible = '' "
    >
    </u-datetime-picker>


    <Loading :loading="shopLoading || saveLoading"/>


    <Modal ref="modal"/>

  </view>
</template>
<script>
import BottomButton from "@/components/BottomButton/index.vue";
import Loading from "@/components/Loading/index.vue";
import {isArray} from "@/util/Tools";
import moment from "@/util/Common/moment";
import {Erp} from "MES-Apis/lib/Erp/promise";
import {Storehouse} from "MES-Apis/lib/Storehouse/promise";
import MyButton from "@/components/MyButton/index.vue";
import Popup from "@/components/Popup/index.vue";
import Cascader from "@/components/Cascader/index.vue";
import Modal from "@/components/Modal/index.vue";
import {Init} from "MES-Apis/lib/Init";
import SelectCustomer from "@/Crm/OutStock/components/SelectCustomer/index.vue";
import {Crm} from "MES-Apis/lib/Crm/promise";
import {Message} from "@/components/Message";

const shopType = 'crmOutStock'
export default {
  name: "page",
  components: {SelectCustomer, Modal, Cascader, Popup, MyButton, Loading, BottomButton},
  data() {
    return {
      isArray,
      visible: '',
      storeHouseData: [],
      formData: {
        date: moment().format('YYYY-MM-DD')
      },
      formDataRender: {},
      shopCartApplyList: [],
      shopLoading: false,
      storeTreeLoading: false,
      showContent: false,
      saveLoading: false
    }
  },
  mounted() {
    this.storeHouseList()
    uni.$on('shopCartApplyList', (list) => {
      this.shopCartApplyList = list
    })
    uni.$on('selectUser', (res) => {
      const user = res.checkUsers[0] || {};
      this.formDataChange({userId: user.userId}, {user})
    })
  },
  methods: {
    formDataChange(formData, formDataRender) {
      this.formData = {
        ...this.formData,
        ...formData
      }
      this.formDataRender = {
        ...this.formDataRender,
        ...formDataRender
      }
    },
    async getShopList(storehouseId) {
      this.shopLoading = true
      const res = await Erp.shopCartApplyList({
        data: {type: shopType, storehouseId}
      })
      this.shopCartApplyList = res.data || []
      this.shopLoading = false
    },
    storeHouseList() {
      this.storeTreeLoading = true
      Storehouse.storeHouseTreeV2_0().then(res => {
        this.storeHouseData = this.format(res.data || [])
      }).finally(() => {
        this.storeTreeLoading = false
      })
    },
    format(data) {
      const list = [];
      data.forEach(item => {
        const obj = {
          name: item.name,

          id: item.storehouseId
        }
        if (isArray(item.childrenList).length > 0) {
          obj.children = this.format(item.childrenList || []);
        }
        list.push(obj);
      })

      return list
    },
    click() {
      if (!this.formData.storeHouseId) {
        Message.toast('请先选择仓库！')
        return
      }
      uni.navigateTo({
        url: `/Crm/OutStock/SelectProduct/index?storeId=${this.formData.storeHouseId}`
      })
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
    dateChange(e) {
      this.formDataChange({date: moment(e.value).format('YYYY-MM-DD')})
      this.visible = ''
    },
    onFinish({id, name}) {
      this.formDataChange({storeHouseId: id}, {storeHouseName: name})
      this.getShopList(id)
    },
    selectCustomer(customer) {
      this.formDataChange({
        customerId: customer.value
      }, {
        customerName: customer.label
      })
    },
    selectUser() {
      const _this = this
      uni.navigateTo({
        url: `/User/UserList/index?type=radio`,
        success: function (res) {
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('checkUsers', {
            checkUsers: _this.formData.userId ? [_this.formDataRender.user] : [],
          })
        }
      })
    },
    save() {
      const formData = this.formData
      if (!formData.customerId) {
        this.$refs.modal.dialog({
          title: '请选择客户!'
        })
      } else if (!formData.userId) {
        this.$refs.modal.dialog({
          title: '请选择业务员!'
        })
      } else if (!formData.storeHouseId) {
        this.$refs.modal.dialog({
          title: '请选择仓库!'
        })
      } else {
        this.saveLoading = true
        Crm.outStock({
          data: {
            userId: formData.userId,
            orderParam: {
              type: 2,
              currency: '人民币',
              buyerId: formData.customerId,
              date: formData.date,
              storehouseId: formData.storeHouseId,
              remark: formData.remark,
              detailParams: this.shopCartApplyList.map(item => {
                return {
                  skuId: item.skuId,
                  brandId: 0,
                  purchaseNumber: item.number,
                  onePrice: item.skuResult?.outPrice,
                  totalPrice: (item.skuResult?.outPrice || 0) * item.number,
                  unitId: item.skuResult?.spuResult?.unitId
                }
              })
            }
          }
        }).then(() => {
          this.$refs.modal.dialog({
            title: '保存成功！',
            onConfirm() {
              uni.navigateBack()
              return true
            }
          })
        }).catch(() => {
          this.$refs.modal.dialog({
            title: Init.getNewErrorMessage() || '保存失败！'
          })
        }).finally(() => {
          this.saveLoading = false
        })
      }

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

    .placeholder {
      color: #999999;
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

.addButton {
  color: #000000;
  display: flex;
  align-items: center;
  gap: 8px;
}

</style>