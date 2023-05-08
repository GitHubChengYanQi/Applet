<template>
  <view>
    <Popup title="创建出库任务" :show="show" @close="show = false">
      <view class="create" :style="{
        paddingBottom:`${60}px`
      }">
        <view class="skuContent">
          <view class="skuItem">
            <SkuItem
                extra-width="100px"
                :sku-result="isObject(actionItem.skuResult)"
                :other-data="[
                      '版本号：'+(actionItem.partsResult.version || '-')
                  ]"
            />
          </view>

          <view>
            <view>
              x {{ actionItem.number }}
            </view>
          </view>
        </view>
        <view class="form">
          <uni-forms
              ref="form"
              :model="formData"
              labelWidth="100px"
              :rules="rules"
          >

            <uni-forms-item
                label="Bom数量"
                name="number"
                required
            >
              <view class="forItem">
                <ShopNumber
                    :min="1"
                    v-model="formData.number"
                    :max="actionItem.planNumber"
                />
              </view>
            </uni-forms-item>

            <uni-forms-item
                label="执行人"
                name="userId"
                required
            >
              <view class="forItem" @click="selectUser(formData.user)">
                <UserName :user="formData.user" v-if="formData.userId" />
                <LinkButton v-else>
                  <view>请选择执行人</view>
                </LinkButton>
              </view>
            </uni-forms-item>

          </uni-forms>
        </view>
      </view>
      <BottomButton
          :right-loading="submitLoading"
          right-text="创建"
          @rightOnClick="createOutTask"
          @leftOnClick="close"
      />
    </Popup>

    <Modal ref="modal" />
  </view>
</template>

<script>
import BottomButton from "../../../../components/BottomButton";
import ShopNumber from "../../../../components/ShopNumber";
import UserName from "../../../../components/UserName";
import LinkButton from "../../../../components/LinkButton";
import {isObject} from "../../../../util/Tools";
import {Production} from "MES-Apis/lib/Production/promise";
import Popup from "../../../../components/Popup";
import SkuItem from "../../../../components/SkuItem";
import Modal from "../../../../components/Modal";

export default {
  name: 'CreateOutStockTask',
  components: {Modal, SkuItem, Popup, LinkButton, UserName, ShopNumber, BottomButton},
  props: [],
  mounted() {
    const _this = this
    uni.$on('selectUser', (res) => {
      const user = res.checkUsers[0] || {};
      _this.formData = {
        ..._this.formData,
        user,
        userId: user.userId
      }
    })
  },
  data() {
    return {
      show: false,
      isObject,
      formData: {},
      submitLoading: false,
      actionItem: {},
      rules: {
        number: {
          rules: [
            {
              required: true,
              errorMessage: '请输入数量!',
            },
          ]
        },
        userId: {
          rules: [
            {
              required: true,
              errorMessage: '请选择执行人!',
            },
          ]
        },
      },
    }
  },
  methods: {
    create(item) {
      this.show = true
      this.actionItem = item
      this.formData = {number: item.number}
    },
    close() {
      this.show = false
    },
    createOutTask() {
      const _this = this
      this.$refs.form.validate((err) => {
        if (!err) {
          _this.submitLoading = true
          Production.createOutStockTask({
            data: {
              sourceId: this.actionItem.productionPlanId,
              userId: this.formData.userId,
              partsId: this.actionItem.partsResult.bomId,
              number: this.formData.number
            }
          }).then(() => {
            _this.$refs.modal.dialog({
              title: '创建出库任务成功!',
              onConfirm() {
                _this.$emit('refresh',{productionPlanId:_this.actionItem.productionPlanId,number:_this.formData.number})
                _this.show = false
                return true
              }
            })
          }).catch(() => {
            _this.$refs.modal.dialog({
              title: '创建出库任务失败!'
            })
          }).finally(() => {
            _this.submitLoading = false
          })
        }
      })
    },
    selectUser(user) {
      uni.navigateTo({
        url: `/User/UserList/index?type=radio`,
        success: function (res) {
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('checkUsers', {
            checkUsers: user ? [user] : [],
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
.create {
  padding: 12px;

  .form {
    padding-top: 12px;
  }

  .forItem {
    display: flex;
    height: 36px;
    align-items: center;
  }
}

.skuContent {
  display: flex;
  align-items: center;

  .planNumber {
    text-decoration-line: line-through;
    text-decoration-thickness: initial;
    text-decoration-style: initial;
    text-decoration-color: initial;
  }

  .skuItem {
    flex-grow: 1;
  }
}
</style>
