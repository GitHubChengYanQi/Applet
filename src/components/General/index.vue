<template>
  <view>
    <Card
        v-if="(defaultValue.generateContract !== 1 && !['fileId','templateId','contractCoding','labelResults'].includes(stepItem[0].key)) || (defaultValue.generateContract === 1 && !['fileId','labelResults'].includes(stepItem[0].key)) || (defaultValue.generateContract === 2 && !['templateId','contractCoding','labelResults'].includes(stepItem[0].key))"
        :title="stepItem[0].filedName"
        bodyStyle="padding: 0;text-align: center"
    >
      <template v-slot:extra>
        <view
            v-if="['sellerId'].includes(stepItem[0].key)"
            @click="onClick(stepItem[0].key)"
        >
          <view v-if="defaultValue.sellerName">
            {{ defaultValue.sellerName }}
          </view>
          <LinkButton v-else :title="`请选择${stepItem[0].filedName || ''}`"></LinkButton>
        </view>
        <view
            v-if="['partyBContactsId'].includes(stepItem[0].key)"
            @click="() => showVisible(visible = 'partyBContactsId')"
        >
          <view v-if="defaultValue.partyBContactsName">
            {{ defaultValue.partyBContactsName }}
          </view>
          <LinkButton v-else :title="`请选择${stepItem[0].filedName || ''}`"></LinkButton>
        </view>
        <view
            v-if="['partyBPhone'].includes(stepItem[0].key)"
            @click="() => showVisible(visible = 'partyBPhone')"
        >
          <view v-if="defaultValue.partyBPhoneName">
            {{ defaultValue.partyBPhoneName }}
          </view>
          <LinkButton v-else :title="`请选择${stepItem[0].filedName || ''}`"></LinkButton>
        </view>
        <view
            v-if="['partyBAdressId'].includes(stepItem[0].key)"
            @click="() => showVisible(visible = 'partyBAdressId')"
        >
          <view v-if="defaultValue.partyBAdressName">
            {{ defaultValue.partyBAdressName }}
          </view>
          <LinkButton v-else :title="`请选择${stepItem[0].filedName || ''}`"></LinkButton>
        </view>
        <view
            v-if="['partyBBankId'].includes(stepItem[0].key)"
            @click="() => showVisible(visible = 'partyBBankId')"
        >
          <view v-if="defaultValue.partyBBankName">
            {{ defaultValue.partyBBankName }}
          </view>
          <LinkButton v-else :title="`请选择${stepItem[0].filedName || ''}`"></LinkButton>
        </view>
        <view
            v-if="['partyBBankAccount'].includes(stepItem[0].key)"
            @click="() => showVisible(visible = 'partyBBankAccount')"
        >
          <view v-if="defaultValue.partyBBankAccountName">
            {{ defaultValue.partyBBankAccountName }}
          </view>
          <LinkButton v-else :title="`请选择${stepItem[0].filedName || ''}`"></LinkButton>
        </view>
        <view v-if="stepItem[0] && ['totalAmount'].includes(stepItem[0].key)"
              style="padding: 8px;display: inline-block">
          <ShopNumber
              number
              :decimal="2"
              :value="defaultValue[stepItem[0].key]"
              @onChange="(value)=>onChange('totalAmount',value)"
              :min="0.01"
          />
        </view>
        <view v-if="['currency'].includes(stepItem[0].key)">
          <Currency :value="defaultValue.currency" :placeholder="`请选择${stepItem[0].filedName || ''}`"/>
        </view>
        <view
            v-if="['paperType'].includes(stepItem[0].key)"
            @click="() => showVisible(visible = 'paperType')"
        >
          <view v-if="defaultValue.paperTypeName">
            {{ defaultValue.paperTypeName }}
          </view>
          <LinkButton v-else :title="`请选择${stepItem[0].filedName || ''}`"></LinkButton>
        </view>
        <view
            v-if="['rate'].includes(stepItem[0].key)"
            @click="() => showVisible(visible = 'rate')"
        >
          <view v-if="defaultValue.rateName">
            {{ defaultValue.rateName }}
          </view>
          <LinkButton v-else :title="`请选择${stepItem[0].filedName || ''}`"></LinkButton>
        </view>
        <view
            v-if="['freight'].includes(stepItem[0].key)"
            @click="() => showVisible(visible = 'freight')"
        >
          <view v-if="defaultValue.freightName">
            {{ defaultValue.freightName }}
          </view>
          <LinkButton v-else :title="`请选择${stepItem[0].filedName || ''}`"></LinkButton>
        </view>
        <view
            v-if="['payPlan'].includes(stepItem[0].key)"
            @click="() => showVisible(visible = 'payPlan')"
        >
          <view v-if="defaultValue.payPlanName">
            {{ defaultValue.payPlanName }}
          </view>
          <LinkButton v-else :title="`请选择${stepItem[0].filedName || ''}`"></LinkButton>
        </view>
        <view v-if="['theme'].includes(stepItem[0].key)" style="display: inline-block">
          <view style="max-width: 105px">
            <u--input
                :placeholder="`请输入${stepItem[0].filedName || ''}`"
                border="none"
                @input="(value)=>onChange('theme',value)"
                :value="defaultValue.theme"
                inputAlign="right"
                maxlength="10"
            ></u--input>
          </view>
        </view>
        <view v-if="['coding'].includes(stepItem[0].key)" style="display: inline-block">
          <view style="max-width: 105px">
            <u--input
                :placeholder="`请输入${stepItem[0].filedName || ''}`"
                border="none"
                :value="defaultValue.coding"
                @input="(value)=>onChange('coding',value)"
                inputAlign="right"
                maxlength="10"
            ></u--input>
          </view>
        </view>
        <view
            v-if="['date'].includes(stepItem[0].key)"
            @click="visible = 'date'"
        >
          <view v-if="defaultValue.date">
            {{ defaultValue.date }}
          </view>
          <LinkButton v-else>
            <view style="min-width: 100px;height: 19px;text-align: right">
              <view style="width: fit-content;display: inline-block">
                <u-icon name="calendar"/>
              </view>
            </view>
          </LinkButton>
        </view>
        <view v-if="stepItem[0] && ['leadTime'].includes(stepItem[0].key)"
              style="padding: 8px;display: inline-block">
          <view class="flexCenter">
            <ShopNumber number :value="defaultValue[stepItem[0].key]" @onChange="(value)=>onChange('leadTime',value)"/>
            <view>天</view>
          </view>
        </view>
        <view v-if="stepItem[0] && ['adressId'].includes(stepItem[0].key)"
              @click="() => showVisible(visible = 'adressId')">
          <view v-if="defaultValue.adressName">
            {{ defaultValue.adressName }}
          </view>
          <LinkButton v-else :title="`请选择${stepItem[0].filedName || ''}`"></LinkButton>
        </view>
        <view v-if="stepItem[0] && ['generateContract'].includes(stepItem[0].key)"
              @click="() => showVisible(visible = 'generateContract')">
          <view v-if="defaultValue.generateContractName">
            {{ defaultValue.generateContractName }}
          </view>
          <LinkButton v-else :title="`请选择${stepItem[0].filedName || ''}`"></LinkButton>
        </view>
        <view v-if="stepItem[0] && ['contractCoding'].includes(stepItem[0].key)" style="display: inline-block">
          <view style="max-width: 105px">
            <u--input
                :placeholder="`请输入${stepItem[0].filedName || ''}`"
                border="none"
                :value="defaultValue.contractCoding"
                @input="(value)=>onChange('contractCoding',value)"
                inputAlign="right"
                maxlength="10"
            ></u--input>
          </view>
        </view>
        <view
            v-if="['templateId'].includes(stepItem[0].key)"
            @click="onClick(stepItem[0].key)"
        >
          <view v-if="defaultValue.templateName">
            {{ defaultValue.templateName }}
          </view>
          <LinkButton v-else :title="`请选择${stepItem[0].filedName || ''}`"></LinkButton>
        </view>
        <view
            v-if="['buyerId'].includes(stepItem[0].key)"
            @click="visible = 'buyerId'"
        >
          <view v-if="defaultValue.buyerName">
            {{ defaultValue.buyerName }}
          </view>
          <LinkButton v-else :title="`请选择${stepItem[0].filedName || ''}`"></LinkButton>
        </view>
        <view
            v-if="['partyAContactsId'].includes(stepItem[0].key)"
            @click="() => showVisible(visible = 'partyAContactsId')"
        >
          <view v-if="defaultValue.partyAContactsName">
            {{ defaultValue.partyAContactsName }}
          </view>
          <LinkButton v-else :title="`请选择${stepItem[0].filedName || ''}`"></LinkButton>
        </view>
        <view
            v-if="['partyAPhone'].includes(stepItem[0].key)"
            @click="() => showVisible(visible = 'partyAPhone')"
        >
          <view v-if="defaultValue.partyAPhoneName">
            {{ defaultValue.partyAPhoneName }}
          </view>
          <LinkButton v-else :title="`请选择${stepItem[0].filedName || ''}`"></LinkButton>
        </view>
        <view
            v-if="['partyAAdressId'].includes(stepItem[0].key)"
            @click="() => showVisible(visible = 'partyAAdressId')"
        >
          <view v-if="defaultValue.partyAAdressName">
            {{ defaultValue.partyAAdressName }}
          </view>
          <LinkButton v-else :title="`请选择${stepItem[0].filedName || ''}`"></LinkButton>
        </view>
        <view
            v-if="['partyABankId'].includes(stepItem[0].key)"
            @click="() => showVisible(visible = 'partyABankId')"
        >
          <view v-if="defaultValue.partyABankName">
            {{ defaultValue.partyABankName }}
          </view>
          <LinkButton v-else :title="`请选择${stepItem[0].filedName || ''}`"></LinkButton>
        </view>
        <view
            v-if="['partyABankAccount'].includes(stepItem[0].key)"
            @click="() => showVisible(visible = 'partyABankAccount')"
        >
          <view v-if="defaultValue.partyABankAccountName">
            {{ defaultValue.partyABankAccountName }}
          </view>
          <LinkButton v-else :title="`请选择${stepItem[0].filedName || ''}`"></LinkButton>
        </view>
        <view v-if="['partyALegalPerson'].includes(stepItem[0].key)">
          {{ aData.legal || '暂无' }}
        </view>
        <view v-if="['partyABankNo'].includes(stepItem[0].key)">
          {{ defaultValue.partyABankNo || '暂无' }}
        </view>
        <view v-if="['partyACompanyPhone'].includes(stepItem[0].key)">
          {{ aData.telephone || '暂无' }}
        </view>
        <view v-if="['partyAFax'].includes(stepItem[0].key)">
          {{ aData.fax || '暂无' }}
        </view>
        <view v-if="['partyAZipCode'].includes(stepItem[0].key)">
          {{ aData.zipCode || '暂无' }}
        </view>
        <view v-if="['partyBLegalPerson'].includes(stepItem[0].key)">
          {{ bData.legal || '暂无' }}
        </view>
        <view v-if="['partyBBankNo'].includes(stepItem[0].key)">
          {{ defaultValue.partyBBankNo || '暂无' }}
        </view>
        <view v-if="['partyBCompanyPhone'].includes(stepItem[0].key)">
          {{ bData.telephone || '暂无' }}
        </view>
        <view v-if="['partyBFax'].includes(stepItem[0].key)">
          {{ bData.fax || '暂无' }}
        </view>
        <view v-if="['partyBZipCode'].includes(stepItem[0].key)">
          {{ bData.zipCode || '暂无' }}
        </view>
        <view v-if="['payMethod'].includes(stepItem[0].key)" style="display: inline-block">
          <view style="max-width: 105px">
            <u--input
                :placeholder="`请输入${stepItem[0].filedName || ''}`"
                border="none"
                :value="defaultValue.payMethod"
                @input="(value)=>onChange('payMethod',value)"
                inputAlign="right"
            ></u--input>
          </view>
        </view>
        <view v-if="['deliveryWay'].includes(stepItem[0].key)" style="display: inline-block">
          <view style="max-width: 105px">
            <u--input
                :placeholder="`请输入${stepItem[0].filedName || ''}`"
                border="none"
                :value="defaultValue.deliveryWay"
                @input="(value)=>onChange('deliveryWay',value)"
                inputAlign="right"
                maxlength="10"
            ></u--input>
          </view>
        </view>
        <view
            v-if="['userId'].includes(stepItem[0].key)"
            @click="() => showVisible(visible = 'userId')"
        >
          <view v-if="defaultValue.userName">
            {{ defaultValue.userName }}
          </view>
          <LinkButton v-else :title="`请选择${stepItem[0].filedName || ''}`"></LinkButton>
        </view>
        <view
            v-if="['fileId'].includes(stepItem[0].key)"
            @click="visible = 'fileId'"
        >
          <Uploader file @onChange="change">
            <linkButton>
              <u-icon name="attach" color="#2680EB"/>
            </linkButton>
          </Uploader>
        </view>
        <view v-if="['money'].includes(stepItem[0].key)">
          {{ defaultValue.money || 0 }}
        </view>
        <view v-if="['floatingAmount'].includes(stepItem[0].key)">
          <ShopNumber
              :min="-9999"
              decimal="2"
              number
              :value="defaultValue[stepItem[0].key]"
              @onChange="(value)=>onChange('floatingAmount',value,'totalAmount',MathCalc(defaultValue.money,value,'jia'))"
          />
        </view>
      </template>
      <template v-slot:title v-if="required">
        <view class="title">
          <span>*</span>
        </view>
      </template>
      <template v-slot:default>
        <view v-if="stepItem[0] && ['detailParams'].includes(stepItem[0].key)"
              style="padding: 8px;display: inline-block">
          <AddButton
              title="添加物料"
              size="14px"
              plain="true"
              @click="click"
          />
        </view>
        <view v-if="stepItem[0] && ['paymentDetail'].includes(stepItem[0].key)">
          <PaymentDetail
              :money="defaultValue.totalAmount || 0"
              :value="isArray(defaultValue.paymentDetail)"
              :payPlan="defaultValue.payPlan"
              @onChange="(paymentDetail)=> onChange('paymentDetail',paymentDetail)"
          />
        </view>
        <view v-if="stepItem[0] && ['remark'].includes(stepItem[0].key)">
          <view style="text-align: left;font-size: 14px">
            <u--textarea
                :placeholder="`请输入${stepItem[0].filedName || ''}`"
                height="50"
                :value-="defaultValue.remark"
                border="none"
                @input="(value)=>onChange('remark',value)"
            />
          </view>
        </view>
        <view v-if="stepItem[0] && ['paymentRemark'].includes(stepItem[0].key)">
          <view style="text-align: left;font-size: 14px">
            <u--textarea
                :placeholder="`请输入${stepItem[0].filedName || ''}`"
                height="50"
                :value-="defaultValue.paymentRemark"
                border="none"
                @input="(value)=>onChange('paymentRemark',value)"
            />
          </view>
        </view>
        <view v-if="stepItem[0] && ['note'].includes(stepItem[0].key)">
          <view style="text-align: left;font-size: 14px">
            <u--textarea
                :placeholder="`请输入${stepItem[0].filedName || ''}`"
                height="50"
                :value-="defaultValue.note"
                border="none"
                @input="(value)=>onChange('note',value)"
            />
          </view>
        </view>
        <view v-if="stepItem[0] && ['fileId'].includes(stepItem[0].key)" style="padding: 8px">
          <FileUpload noUpload ref="FileUpload"></FileUpload>
        </view>
      </template>
    </Card>

    <u-datetime-picker
        mode="date"
        :show="visible === 'date'"
        ref="datetimePicker"
        v-model="dateValue"
        :formatter="formatter"
        title="时间选择"
        @cancel="visible = ''"
        @confirm="onConfirm"
        closeOnClickOverlay="true"
        @close="visible = '' ">
    </u-datetime-picker>

  </view>
</template>

<script>
import Card from "@/components/Card/index.vue";
import LinkButton from "@/components/LinkButton/index.vue";
import AddButton from "@/components/AddButton/index.vue";
import ShopNumber from "@/components/ShopNumber/index.vue";
import Currency from "@/components/Currency/index.vue";
import {ArrayDuplicate, isArray, MathCalc} from "@/util/Tools";
import Uploader from "@/components/Uploader/index.vue";
import FileUpload from "@/components/Uploader/FileUpload/index.vue";
import PaymentDetail from "@/components/PaymentDetail/index.vue";
import moment from "moment/moment";

export default {
  name: "General",
  components: {PaymentDetail, FileUpload, Uploader, Currency, ShopNumber, AddButton, LinkButton, Card},
  props: [
    'stepItem',
    'required',
    'defaultValue',
    'aData',
    'bData',
  ],
  data() {
    return {
      visible: "",
      files: [],
      dateValue: Number(new Date()),
    }
  },
  onReady() {
    this.$refs.datetimePicker.setFormatter(this.formatter);
  },
  methods: {
    MathCalc,
    ArrayDuplicate,
    isArray,
    showVisible() {
      this.$emit('picker', this.visible)
    },
    change(e) {
      this.files = [
        ...this.files,
        e
      ]
      this.$refs.FileUpload.save(this.files)
    },
    click() {
      let money = 0
      money = MathCalc(money, 380, 'jia')
      this.$emit('add', {
        totalAmount: money,
        money: 380
      })
    },
    onClick(e) {
      if (e === 'sellerId') {
        uni.navigateTo({
          url: `/Crm/Supplier/index`
        })
      }
      if (e === 'templateId') {
        uni.navigateTo({
          url: `/Crm/Contract/index`
        })
      }
    },
    onConfirm(e) {
      uni.$emit('dateInput', moment(e.value).format('YYYY/MM/DD'))
      this.visible = ''
    },
    onChange(key, num, id, value) {
      this.$emit('input', {
        [key]: num,
        [id]: value,
        visible: this.visible
      })
      this.visible = ''
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
  },

}
</script>

<style lang="scss">

.flexCenter {
  display: flex;
  grid-gap: 8px;
  gap: 8px;
  align-items: center;
}

.title span {
  color: red;
  margin-left: 4px;
}

.stepper {
  border-radius: 2px;
  border: 1px solid #D9D9D9;
  display: inline-block;
  height: 24px;
  line-height: 24px;
  min-width: 50px;
  width: min-content;
  padding: 0 8px;
}
</style>