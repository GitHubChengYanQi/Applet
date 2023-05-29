<template>
  <view>
    <view v-for="(item,index) in value" :key="index">
      <Card
          headerStyle="border-bottom: solid 1px #F5F5F5;padding-bottom: 8px;"
          noLeftBorder
          :title="`第${index + 1}批`"
      >
        <template v-slot:extra>
          <LinkButton @click="show = true ; id = index">
            <u-icon name="trash" color="red"></u-icon>
          </LinkButton>
        </template>
        <template v-slot:default>
          <view v-if="payPlan === 2">
            <view class="detailItem">
              <view class="flexCenter" @click="open = {type: 'payTime',key: index}">
                日期：
                <view v-if="item.payTime">
                  {{ item.payTime }}
                </view>
                <LinkButton v-else title="请选择"></LinkButton>
              </view>
            </view>
            <view class="detailItem">
              <view class="flexCenter">
                付款比例：
                <ShopNumber
                    number
                    :max="100"
                    :min="0"
                    :value="item.percentum"
                    @onChange="(e)=>change(e,index)"

                />
                <view style="margin-left: 10px">%</view>
              </view>
              <view style="margin-left: 16px" class="flexCenter">
                付款金额：
                <ShopNumber
                    :decimal="2"
                    number
                    :value="item.money"
                    @onChange="(e)=> moneyChange(e,index)"
                />
              </view>
            </view>
            <view class="detailItem">
              <view style="width: 90px;text-align: left">款项说明：</view>
              <u-input
                  placeholder="请输入款项说明"
                  :value="item.remark"
                  @input="(remark)=>dataChange({remark},index)"
                  border="none"
                  maxlength="20"
              >
              </u-input>
            </view>
            <view class="space"/>
          </view>
          <view v-else>
            <view class="detailItem">
              <view class="flexCenter" @click="open = {type: 'payType',value: item.payType,key: index}">
                动作：
                <view v-if="item.payTypeName">
                  {{ item.payTypeName }}
                </view>
                <LinkButton v-else title="请选择"></LinkButton>
              </view>
              <view class="flexCenter">
                时间：
                <ShopNumber
                    number
                    :value="item.dateNumber || 0"
                    @onChange="(dateNumber) => dataChange({ dateNumber }, index)"
                />
              </view>
              <view class="flexCenter" @click="open = {type: 'dateWay',value: item.dateWay,key: index}">
                类型：
                <view v-if="item.dateWayName">
                  {{ item.dateWayName }}
                </view>
                <LinkButton v-else title="请选择"></LinkButton>
              </view>
            </view>
            <view class="detailItem">
              <view class="flexCenter">
                付款比例：
                <ShopNumber
                    number
                    :max="100"
                    :min="0"
                    :value="item.percentum"
                    @onChange="(e)=>change(e,index)"

                />
                <view style="margin-left: 10px">%</view>
              </view>
              <view style="margin-left: 16px" class="flexCenter">
                付款金额：
                <ShopNumber
                    :decimal="2"
                    number
                    :value="item.money"
                    @onChange="(e)=> moneyChange(e,index)"
                />
              </view>
            </view>
            <view class="detailItem">
              <view style="width: 90px;text-align: left">款项说明：</view>
              <u-input
                  placeholder="请输入款项说明"
                  :value="item.remark"
                  @input="(remark)=>dataChange({remark},index)"
                  border="none"
                  maxlength="20"
              >
              </u-input>
            </view>
            <view class="space"/>
          </view>
        </template>
      </Card>
    </view>
    <view style="padding: 8px;display: inline-block">
      <AddButton
          addStyle="width: max-content; padding: 0 8px;"
          @click="click"
          title="添加付款批次"
          plain="true"
      >
      </AddButton>
    </view>

    <u-modal
        :show="show"
        width="280px"
        showCancelButton
        cancelColor="#2680EB"
        confirmColor="#2680EB"
        @cancel="show = ''"
        @confirm="trash(id)"
    >
      <view class="slot-content">
        <u-icon name="warning" size="60" color="#faad14"/>
        <view>是否确认删除?</view>
      </view>
    </u-modal>

    <u-picker
        @close="open = ''"
        @cancel="open = ''"
        :columns="[[
                { label: '订单创建后', id: 0 },
                { label: '合同签订后', id: 1 },
                { label: '订单发货前', id: 2 },
                { label: '订单发货后', id: 3 },
                { label: '入库后', id: 4 },
           ]]"
        keyName="label"
        :show="open.type === 'payType'"
        closeOnClickOverlay="true"
        @confirm="(val) =>onChange([open.type],'payTypeName',val)"
    />

    <u-picker
        @close="open = ''"
        @cancel="open = ''"
        :columns="[[
                { label: '天', id: 0 },
                { label: '月', id: 1 },
                { label: '年', id: 2 },
           ]]"
        keyName="label"
        :show="open.type === 'dateWay'"
        closeOnClickOverlay="true"
        @confirm="(val) =>onChange([open.type],'dateWayName',val)"
    />

    <u-datetime-picker
        mode="datetime"
        ref="datetimePicker"
        :show="open.type === 'payTime'"
        :formatter="formatter"
        title="时间选择"
        @cancel="open = ''"
        closeOnClickOverlay="true"
        @close="open = ''"
        v-model="values"
        @confirm="(val) => dateChange('payTime',val)"
    >

    </u-datetime-picker>
  </view>
</template>

<script>
import AddButton from "@/components/AddButton/index.vue";
import {Message} from "@/components/Message";
import Card from "@/components/Card/index.vue";
import LinkButton from "@/components/LinkButton/index.vue";
import {isArray, MathCalc} from "@/util/Tools";
import ShopNumber from "@/components/ShopNumber/index.vue";
import moment from "moment/moment";


export default {
  name: "PaymentDetail",
  components: {ShopNumber, LinkButton, Card, AddButton},
  props: [
    'money',
    'value',
    'payPlan'
  ],
  data() {
    return {
      open: {},
      visible: '',
      values: Number(new Date()),
      show: false,
      id: '',
      content: `是否确认删除? `
    }
  },
  onReady() {
    this.$refs.datetimePicker.setFormatter(this.formatter)
  },
  methods: {
    MathCalc,
    click() {
      if (!this.money) {
        Message.toast('请输入采购总价!')
      } else {
        this.$emit('onChange', [
          ...this.value,
          {
            payType: null,
            dateNumber: 1,
            dateWay: 0,
            dateWayName: '天'
          }
        ])
      }
    },
    trash(index) {
      this.$emit('onChange', this.value.filter((item, valueIndex) => valueIndex !== index))
      this.show = ''
    },
    dateChange(key, e) {
      this.dataChange({[key]: moment(e.value).format('YYYY/MM/DD  HH:mm:ss')}, this.open?.key)
      this.open = ''
    },
    change(e, index) {
      let percentums = 0;
      this.value.forEach((item, valueIndex) => {
        if (valueIndex !== index) {
          percentums = MathCalc(item.percentum, percentums, 'jia')
        }
      })
      const remaining = MathCalc(100, percentums, 'jian');
      const newPercentum = remaining > e ? e : remaining;
      this.dataChange({
        percentum: newPercentum,
        money: Number(MathCalc(this.money, MathCalc(newPercentum, 100, 'chu'), 'cheng').toFixed(2)),
      }, index);
    },
    moneyChange(e, index) {
      let moneys = 0;
      this.value.forEach((item, valueIndex) => {
        if (valueIndex !== index) {
          moneys = MathCalc(item.money, moneys, 'jia');
        }
      });
      const remaining = MathCalc(this.money, moneys, 'jian');
      const newMoney = remaining > e ? e : remaining;
      this.dataChange({
        money: newMoney,
        percentum: Number(MathCalc(((MathCalc((e), this.money, 'chu')).toFixed(2)), 100, 'cheng')),
      }, index);
    },
    onChange(key, keyName, e) {
      this.dataChange({[key]: e.value[0].id, [keyName]: e.value[0].label}, this.open?.key)
      this.open = ''
    },
    dataChange(param, key) {
      let percentum = 0
      const newData = isArray(this.value).map((item, index) => {
        if (index === key) {
          const newItem = {...item, ...param}
          percentum = MathCalc(newItem.percentum, percentum, 'jia')
          return newItem
        }
        percentum = MathCalc(item.percentum, percentum, 'jia')
        return item
      })
      this.$emit('onChange', [
        ...newData
      ])
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
      if (type === 'hour') {
        return `${value}时`
      }
      if (type === 'minute') {
        return `${value}分`
      }
      if (type === 'second') {
        return `${value}秒`
      }
      return value
    }
  }
}
</script>

<style lang="scss">

.flexCenter {
  flex-grow: 1;
  display: flex;
  align-items: center;
}

.detailItem {
  border-bottom: solid 1px #F5F5F5;
  padding: 8px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.space {
  background-color: #E1EBF6;
  height: 1px;
  padding: 0 !important;
}

.slot-content {
  display: flex;
  align-items: center;
  grid-gap: 8px;
  gap: 8px;
  flex-direction: column
}

</style>