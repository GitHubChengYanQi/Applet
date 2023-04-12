<template>
  <view>
    <List
        ref="listRef"
        :max-height="`calc(100vh - ${safeAreaHeight(this)}px)`"
        @request="Production.productionPlanList"
        @listSource="(newList)=> list = newList"
        :list="list"
    >
      <view
          v-for="(item,index) in list"
          :key="index"
      >
        <Card
            class-name="productionCard"
            header-class-name="header"
            :title="item.coding"
            :extra="timeDifference(item.createTime)"
            extra-class-name="createTime"
        >
          <view @click="goToDetail(item)">
            <view class="skuContent">
              <view class="skuItem">
                <SkuItem
                    no-view
                    extra-width="100px"
                    :sku-result="format(item).skuResult"
                    :other-data="['版本号：'+format(item).partsResult.name]"
                />
              </view>

              <view>
                x {{ format(item).planNumber }}
              </view>
            </view>

            <view class="progress">
              <view class="progressItem">
                <view class="total">
                  <view class="totalItem">
                    出库中：
                    <view class="num" style="color:#007aff">{{ outProgress(item).makingNumber }} ({{ 100 }}%)</view>
                  </view>
                  <view class="totalItem">
                    已出库：
                    <view class="num" style="color:#19be6b">{{ outProgress(item).makingNumber }} ({{ 100 }}%)</view>
                  </view>
                </view>
                <view class="percentage">
                  <Progress
                      :progress="outProgress(item).data"
                      :total="outProgress(item).total"
                  />
                </view>
              </view>
              <view class="progressItem">
                <view class="total">
                  <view class="totalItem">
                    BOM完成：
                    <view class="num" style="color:#007aff">{{ doneProgress(item).makingNumber }} ({{ 100 }}%)</view>
                  </view>
                  <view class="totalItem">
                    计划完成：
                    <view class="num" style="color:#19be6b">{{ doneProgress(item).makingNumber }} ({{ 100 }}%)</view>
                  </view>
                </view>
                <view class="percentage">
                  <Progress
                      :progress="doneProgress(item).data"
                      :total="doneProgress(item).total"
                  />
                </view>
              </view>
            </view>
          </view>
          <view class="otherActions">
            <view class="createUser">
              创建人:
              <Avatar size="24" :src="item.createUserResult.avatar" />
              {{ item.createUserResult.name }}
            </view>
            <view>
              <LinkButton :disabled="format(item).number === 0" @click="create(format(item))">创建出库任务</LinkButton>
            </view>
          </view>
        </Card>
      </view>
    </List>


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
                      '版本号：'+actionItem.partsResult.name
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
                    :value="formData.number"
                    :max="actionItem.planNumber"
                    @onChange="(number)=>formData.number = number"
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
  </view>
</template>

<script>
import List from "../../components/List/indx";
import {Production} from "MES-Apis/lib/Production/promise";
import Card from "../../components/Card";
import SkuItem from "../../components/SkuItem";
import LinkButton from "../../components/LinkButton";
import UserName from "../../components/UserName";
import Avatar from "../../components/Avatar";
import {isObject, safeAreaHeight, timeDifference} from "../../util/Tools";
import Popup from "../../components/Popup";
import ShopNumber from "../../components/ShopNumber";
import BottomButton from "../../components/BottomButton";
import {Message} from "../../components/Message";
import Progress from "../../components/Progress";

export default {
  options: {
    styleIsolation: 'shared'
  },
  name: 'ProductionList',
  components: {Progress, BottomButton, ShopNumber, Popup, Avatar, UserName, LinkButton, SkuItem, Card, List},
  data() {
    return {
      timeDifference,
      Production,
      list: [],
      safeAreaHeight,
      formData: {},
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
      show: false,
      submitLoading: false,
      actionItem: {},
      isObject
    }
  },
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
  methods: {
    outProgress(item) {
      const {planNumber, makingNumber} = this.format(item)
      let data = [
        {
          number: makingNumber,
          color: '#007aff'
        },
        {
          number: 2,
          color: '#19be6b'
        }
      ]
      return {
        total: planNumber,
        data,
        makingNumber: 99999
      }
    },
    doneProgress(item) {
      let total = 50;
      let data = [
        {
          number: 12,
          color: '#007aff'
        },
        {
          number: 20,
          color: '#19be6b'
        }
      ]
      return {
        total,
        data,
        makingNumber: 99999
      }
    },
    goToDetail(item) {
      uni.navigateTo({
        url: `/Production/ProductionDetail/index?id=${item.productionPlanId}`
      })
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
              partsId: this.actionItem.partsResult.partsId,
              number: this.formData.number
            }
          }).then(() => {
            Message.dialog({
              title: '创建出库任务成功!',
              onConfirm() {
                _this.$refs.listRef.submit()
                _this.show = false
                return true
              }
            })
          }).catch(() => {
            Message.dialog({
              title: '创建出库任务失败!'
            })
          }).finally(() => {
            _this.submitLoading = false
          })
        }
      })
    },
    create(item) {
      this.show = true
      this.actionItem = item
      this.formData = {number: item.number}
    },
    format(item) {
      const planDetailResult = item.planDetailResults[0] || {}
      return {
        ...item,
        skuResult: planDetailResult.skuResult || {},
        planNumber: planDetailResult.planNumber || 0,
        partsResult: planDetailResult.partsResult || {},
        makingNumber: planDetailResult.makingNumber || 0,
        number: (planDetailResult.planNumber || 0) - (planDetailResult.makingNumber || 0)
      }
    },
    selectUser(user) {
      uni.navigateTo({
        url: `/User/SelectUser/index?type=radio`,
        success: function (res) {
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('clickDept', {
            checkUsers: user ? [user] : [],
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">

.productionCard {
  padding-bottom: 0;
}

.header {
  padding-bottom: 8px;
  border-bottom: solid 1px #f0f0f0;
}

.createTime {
  color: #ccc;
  font-size: 12px;
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

.progress {

  .progressItem {
    padding-top: 8px;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;

    .total {
      text-align: center;
      display: flex;
      align-items: center;
      gap: 24px;
      padding-bottom: 4px;
      width: 100%;
      justify-content: center;

      .totalItem {
        display: flex;
      }
    }

    .percentage {
      width: 100%;
    }

  }
}

.otherActions {
  padding-top: 8px;
  display: flex;
  justify-content: space-between;
  border-top: solid 1px #f0f0f0;
  margin-top: 8px;

  .createUser {
    display: flex;
    align-items: center;
    gap: 8px;
  }
}

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

</style>
