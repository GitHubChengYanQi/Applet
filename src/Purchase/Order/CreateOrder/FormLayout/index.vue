<template>
  <view>
    <Loading :skeleton="true" skeleton-type="page" v-if="loading"/>
    <view class="formSteps" v-if="steps.length !== 1">
      <view class="steps">
        <u-steps :current="currentStep" dot>
          <view v-for="(item,index) in steps" :key="index" style="width: 100%">
            <u-steps-item :title="item.title"></u-steps-item>
          </view>
        </u-steps>
      </view>
    </view>

    <view style="padding-bottom: 90px;">
      <General
          v-for="stepItem in currentFiled[currentStep]" :key="stepItem.key"
          :stepItem="stepItem"
          :required="stepItem[0].required"
          :defaultValue="defaultValue"
          :aData="aData"
          :bData="bData"
          @input="input"
          @add="add"
          @picker="picker"


      />
    </view>


    <BottomButton
        rightText='下一步'
        leftText="上一步"
        :leftDisabled="currentStep === 0"
        @rightOnClick="rightOnClick"
        @leftOnClick="leftOnClick"
        :rightText="currentStep < steps.length - 1 ? '下一步' : '保存'"
        :rightDisabled="disable"
    />

    <u-picker
        :show="visible === 'partyBContactsId'"
        :columns="[isArray(bData.contactsParams).map(item => {
                return {
                  label: item.contactsName,
                  id: item.contactsId,
                }
              })]"
        @close="visible = ''"
        keyName="label"
        closeOnClickOverlay="true"
        @cancel="visible = ''"
        @confirm="partyBContactsIdConfirm"
    />

    <u-picker
        :show="['partyBPhone'].includes(visible)"
        :columns="[isArray(BContactsData.phoneParams).map(item => {
                return {
                  label: item.phone,
                  id: item.phoneId
                }
              })]"
        @close="visible = ''"
        keyName="label"
        closeOnClickOverlay="true"
        @cancel="visible = ''"
        @confirm="(value)=>onChange('partyBPhoneName','partyBPhone',value)"
    />

    <u-picker
        :show="['partyBAdressId'].includes(visible)"
        :columns="[isArray(bData.adressParams).map(item => {
                return {
                  label: item.detailLocation || item.location,
                  id: item.adressId
                }
              })]"
        @close="visible = ''"
        keyName="label"
        closeOnClickOverlay="true"
        @cancel="visible = ''"
        @confirm="(value)=>onChange(' partyBAdressName', 'partyBAdressId', value)"
    />

    <u-picker
        :show="['partyBBankId'].includes(visible)"
        :columns="[ArrayDuplicate(bData.invoiceResults, 'bankId').map(item => ({
                 id: item.bankId,
                 label: item.bankResult.bankName,
              }))]"
        @close="visible = ''"
        keyName="label"
        closeOnClickOverlay="true"
        @cancel="visible = ''"
        @confirm="(value)=>onChange('partyBBankName','partyBBankId', value)"
    />

    <u-picker
        :show="visible === 'paperType'"
        :columns="[[{ label: '普票', id: 0 }, { label: '专票', id: 1 }]]"
        @close="visible = ''"
        keyName="label"
        closeOnClickOverlay="true"
        @cancel="visible = ''"
        @confirm="(value)=>onChange('paperTypeName','paperType',value)"
    />

    <u-picker
        :show="visible === 'rate'"
        :columns="[taxData]"
        @close="visible = ''"
        keyName="label"
        closeOnClickOverlay="true"
        @cancel="visible = ''"
        @confirm="(value)=>onChange('rateName','rate',value)"
    />

    <u-picker
        :show="visible === 'freight'"
        :columns="[[{ label: '是', id: 1 }, { label: '否', id: 0 }]]"
        @close="visible = ''"
        keyName="label"
        closeOnClickOverlay="true"
        @cancel="visible = ''"
        @confirm="(value)=>onChange('freightName','freight',value)"
    />

    <u-picker
        :show="visible === 'payPlan'"
        :columns="[[{ label: '按时间分期付款', id: 2 },{ label: '按动作分期付款', id: 3 }]]"
        @close="visible = ''"
        keyName="label"
        closeOnClickOverlay="true"
        @cancel="visible = ''"
        @confirm="(value)=>onChange('payPlanName','payPlan',value)"
    />

    <u-picker
        :show="visible === 'adressId' "
        :columns="[isArray(aData.adressParams).map(item => {
                return {
                  label: item.detailLocation || item.location,
                  id: item.adressId
                }
              })]"
        @close="visible = ''"
        keyName="label"
        closeOnClickOverlay="true"
        @cancel="visible = ''"
        @confirm="(value)=>onChange('adressName','adressId',value)"
    />

    <u-picker
        :show="visible === 'generateContract'"
        :columns="[[{ label: '生成合同', id: 1 }, { label: '无合同', id: 0 }, { label: '上传合同', id: 2 }]]"
        @close="visible = ''"
        keyName="label"
        closeOnClickOverlay="true"
        @cancel="visible = ''"
        @confirm="(value)=>onChange('generateContractName','generateContract',value)"
    />

    <u-picker
        :show="visible === 'partyBBankAccount'"
        :columns="[isArray(bData.invoiceResults).filter(item => item.bankId === defaultValue.partyBBankId).map(item => {
                return {
                  label: item.bankAccount,
                  id: item.invoiceId,
                  bankNo: item.bankNo,
                }
              })]"
        @close="visible = ''"
        keyName="label"
        closeOnClickOverlay="true"
        @cancel="visible = ''"
        @confirm="(value)=>onChange('partyBBankAccountName','partyBBankAccount', value)"
    />

    <u-picker
        :show="['partyAContactsId'].includes(visible)"
        :columns="[isArray(aData.contactsParams).map(item => {
                return {
                  label: item.contactsName,
                  id: item.contactsId,
                }
              })]"
        @close="visible = ''"
        keyName="label"
        closeOnClickOverlay="true"
        @cancel="visible = ''"
        @confirm="(value) => onChange('partyAContactsName','partyAContactsId',value)"
    />

    <u-picker
        :show="['partyAAdressId'].includes(visible)"
        :columns="[isArray(aData.adressParams).map(item => {
                return {
                  label: item.detailLocation || item.location,
                  id: item.adressId,
                }
              })]"
        @close="visible = ''"
        keyName="label"
        closeOnClickOverlay="true"
        @cancel="visible = ''"
        @confirm="(value) => onChange('partyAAdressName','partyAAdressId',value)"
    />

    <u-picker
        :show="['partyAPhone'].includes(visible)"
        :columns="[isArray(AContactsData.phoneParams).map(item => {
                return {
                  label: item.phone,
                  id: item.phoneId,
                }
              })]"
        @close="visible = ''"
        keyName="label"
        closeOnClickOverlay="true"
        @cancel="visible = ''"
        @confirm="(value) => onChange('partyAPhoneName','partyAPhone',value)"
    />

    <u-picker
        :show="['partyABankId'].includes(visible)"
        :columns="[ArrayDuplicate(aData.invoiceResults,'bankId').map(item => {
                return {
                  label: item.bankResult.bankName,
                  id: item.bankId,
                }
              })]"
        @close="visible = ''"
        keyName="label"
        closeOnClickOverlay="true"
        @cancel="visible = ''"
        @confirm="(value) => onChange('partyABankName','partyABankId',value)"
    />

    <u-picker
        :show="['partyABankAccount'].includes(visible)"
        :columns="[isArray(aData.invoiceResults).filter(item => item.bankId === defaultValue.partyABankId).map(item => {
                return {
                  label:  item.bankAccount,
                  id: item.invoiceId,
                  bankNo: item.bankNo
                }
              })]"
        @close="visible = ''"
        keyName="label"
        closeOnClickOverlay="true"
        @cancel="visible = ''"
        @confirm="(value) => onChange('partyABankAccountName','partyABankAccount',value)"
    />

    <u-picker
        :show="visible === 'userId' "
        :columns="[isArray(aData.contactsParams).map(item => {
                return {
                  label: item.contactsName,
                  id: item.contactsId
                }
              })]"
        @close="visible = ''"
        keyName="label"
        closeOnClickOverlay="true"
        @cancel="visible = ''"
        @confirm="(value) => onChange('userName','userId',value)"
    />
  </view>
</template>

<script>
import {request} from "MES-Apis/lib/Service/request";
import Card from "@/components/Card/index.vue";
import BottomButton from "@/components/BottomButton/index.vue";
import General from "@/components/General/index.vue";
import {ArrayDuplicate, isArray, MathCalc} from "@/util/Tools";
import Loading from "@/components/Loading/index.vue";
import {Message} from "@/components/Message";


export default {
  name: "FormLayout",
  components: {
    Loading,
    General,
    BottomButton,
    Card
  },
  data() {
    return {
      currentFiled: [],
      currentStep: 0,
      steps: [],
      require: [],
      defaultValue: {
        payPlan: 3,
        payPlanName: '按动作分期付款',
        currency: '人民币',
        money: 0,
        paymentDetail: []
      },
      taxData: {},
      aData: {},
      bData: {},
      AContactsData: {},
      BContactsData: {},
      loading: true,
      visible: ''
    }
  },
  mounted() {
    this.get()
  },
  methods: {
    ArrayDuplicate,
    isArray,
    async get() {
      const _this = this
      this.loading = true
      const list = await this.listByFormType('PURCHASEORDER')
      const data = list.data
      const typeSetting = JSON.parse(data[0].typeSetting) || {}
      const mobile = typeSetting.mobile || {}
      this.steps = mobile.steps || []
      this.currentFiled = this.steps.map(item => item.data.map(item => item[0].data.map(item => item)))
      const taxRateListSelect = await this.taxRateListSelect()
      this.taxData = taxRateListSelect.data
      _this.selfEnterpriseDetail()


      uni.$on('supplierChange', function (item) {
        _this.defaultValue = {
          ..._this.defaultValue,
          sellerName: item.customerName,
          sellerId: item.customerId
        }
        _this.SupplierDetail(_this.defaultValue.sellerId)
      })

      uni.$on('dateInput', function (e) {
        _this.defaultValue = {
          ..._this.defaultValue,
          date: e
        }
      })

      uni.$on('currencyChange', function (e) {
        _this.defaultValue = {
          ..._this.defaultValue,
          currency: e
        }
      })

      uni.$on('contractChange', function (item) {
        _this.defaultValue = {
          ..._this.defaultValue,
          templateName: item.name,
        }
      })
      this.loading = false

    },
    onChange(key, id, e) {
      if (e.value[0].id === undefined) {
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
      this.visible = ''
    },
    async listByFormType(formType) {
      return request({
        url: "/formStyle/list",
        method: 'post',
        data: {
          formType
        }
      })
    },
    selfEnterpriseDetail() {
      const _this = this
      return request({
        url: "/selfEnterprise/detail",
        method: 'post',
        data: {}
      }).then(async res => {
        _this.aData = res.data
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
        if (res.data.defaultContacts) {
          const contactDetail = await _this.getContactsDetail(res.data.defaultContacts)
          const contact = contactDetail.data
          _this.AContactsData = contact
          info = {
            ...info,
            partyAPhone: isArray(contact?.phoneParams)[0]?.phoneId,
            partyAPhoneName: isArray(contact?.phoneParams)[0]?.phone,
          };
        }
        _this.defaultValue = {
          ..._this.defaultValue,
          ...info
        }
      })
    },
    SupplierDetail(customerId) {
      const _this = this
      return request({
        url: "/supplier/detail",
        method: 'post',
        data: {
          customerId
        }
      }).then(async res => {
        _this.bData = res.data
        let info = {
          partyBAdressId: res.data.defaultAddress,
          partyBAdressName: res.data.address?.detailLocation || res.data.address?.location,
          partyBContactsId: res.data.defaultContacts,
          partyBContactsName: res.data.contact?.contactsName,
          partyBBankId: res.data.invoiceResult?.bankId,
          partyBBankName: res.data.invoiceResult?.bankResult?.bankName,
          partyBBankAccount: res.data.invoiceResult?.invoiceId,
          partyBBankAccountName: res.data.invoiceResult?.bankAccount,
          partyBBankNo: res.data.invoiceResult?.bankNo,
        };
        if (res.data.defaultContacts) {
          const contactDetail = await _this.getContactsDetail(res.data.defaultContacts)
          const contact = contactDetail.data
          _this.BContactsData = contact
          info = {
            ...info,
            partyBPhone: isArray(contact?.phoneParams)[0]?.phoneId,
            partyBPhoneName: isArray(contact?.phoneParams)[0]?.phone,
          };
        }
        _this.defaultValue = {
          ..._this.defaultValue,
          ...info
        }
      })
    },
    async getContactsDetail(contactsId) {
      return request({
        url: "/contacts/detail",
        method: 'post',
        data: {
          contactsId
        }
      })
    },
    async taxRateListSelect() {
      return request({
        url: "/taxRate/listSelect",
        method: 'post',
        data: {}
      })
    },
    async partyBContactsIdConfirm(e) {
      const _this = this
      let infoContact;
      let contact = {};
      if (e.value[0] !== undefined && e.value[0].id) {
        const contactData = await _this.getContactsDetail(e.value[0].id);
        contact = contactData.data

        infoContact = {
          partyBContactsId: e.value[0].id,
          partyBContactsName: e.value[0].label,
          partyBPhone: isArray(contact?.phoneParams)[0]?.phoneId,
          partyBPhoneName: isArray(contact?.phoneParams)[0]?.phone,
        };
      }
      _this.defaultValue = {
        ..._this.defaultValue,
        ...infoContact
      }
      this.visible = ''
    },
    rightOnClick() {
      const currentFiled = [];
      isArray(this.currentFiled[this.currentStep]).map(item => {
        item.forEach(item => {
          currentFiled.push(item.key);
        })
      })
      let value = this.defaultValue
      if (currentFiled.find((item) => item === 'paymentDetail') && value.paymentDetail.length !== 0) {
        let percentum = 0;
        value.paymentDetail.map((item) => {
          return percentum = MathCalc(percentum, item.percentum, 'jia');
        });
        if (percentum !== 100) {
          Message.toast('请检查付款批次');
          return false;
        }
      }

      if (this.currentStep < 3) {
        this.currentStep = this.currentStep + 1
      }
    },
    leftOnClick() {
      if (this.currentStep > 0) {
        this.currentStep = this.currentStep - 1
      }
    },
    input(e) {
      this.defaultValue = {
        ...this.defaultValue,
        ...e,
      }
      this.defaultValue = {
        ...this.defaultValue,
        floatingAmount: MathCalc(this.defaultValue.totalAmount, this.defaultValue.money, 'jian'),
        paymentDetail: isArray(this.defaultValue.paymentDetail).map((item => {
          if (item) {
            return {
              ...item,
              money: MathCalc(MathCalc(item.percentum, 100, 'chu'), this.defaultValue.totalAmount, 'cheng')
            }
          }
          return item;
        }))
      }
    },
    add(e) {
      this.defaultValue = {
        ...this.defaultValue,
        ...e
      }
    },
    picker(e) {
      this.visible = e
    }
  },
  computed: {
    disable() {
      const requiredFiled = [];
      isArray(this.currentFiled[this.currentStep]).map(item => {
        item.forEach(item => {
          if (item.required) {
            requiredFiled.push(item.key);
          }
        })
      })
      const requireds = requiredFiled.filter(item => typeof this.defaultValue[item] !== 'number' && !this.defaultValue[item])
      return requireds.length !== 0 && this.currentStep !== 1
    }
  }
}
</script>

<style lang="scss">

.formSteps {
  padding-bottom: 3px;
  background-color: #E1EBF6;
}

.steps {
  background-color: #FFFFFF;
}

.flexCenter {
  display: flex;
  gap: 8px;
  align-items: center;
}

.textArea {
  font-size: 14px;
  text-align: left;
  line-height: 1.5;
}

.extra {
  display: flex;
}

</style>