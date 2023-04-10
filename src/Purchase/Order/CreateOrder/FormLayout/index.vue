<template>
  <view>
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
      <view v-for="(stepItem,stepIndex) in currentFiled[currentStep]" :key="stepIndex">
        <Card :title="stepItem[0].filedName"
              v-if="stepItem[0] && !['labelResults','templateId'].includes(stepItem[0].key)"
              bodyStyle="padding: 0;text-align: center">
          <template v-slot:title v-if="currentStep === 3">
            <view style="color: red;margin-left: 4px" v-if="stepItem[0] && !['remark'].includes(stepItem[0].key)">
              <span>*</span>
            </view>
          </template>
          <template v-slot:extra>
            <view
                v-if="stepItem[0] && !['coding','theme','buyerId','partyAAdressId','partyAContactsId','partyAPhone','partyABankId','partyABankAccount','partyALegalPerson','partyABankNo','partyACompanyPhone','detailParams','money','currency','paymentDetail','leadTime','date','remark','payMethod'].includes(stepItem[0].key)">
              <GeneralSelection :stepItem="stepItem[0]" />
            </view>
            <view
                v-else-if="stepItem[0] && ['coding','theme','payMethod'].includes(stepItem[0].key)">
              <DefaultInput :stepItem="stepItem[0]"/>
            </view>
            <view
                v-else-if="stepItem[0] && ['buyerId','partyAAdressId','partyAContactsId','partyAPhone','partyABankId','partyABankAccount','partyALegalPerson','partyABankNo','partyACompanyPhone'].includes(stepItem[0].key)">
              <OtherOptions :stepItem="stepItem[0]" @click="Click(stepItem[0].key)"/>
            </view>
            <view v-else-if="stepItem[0] && ['money'].includes(stepItem[0].key)">
              <Money/>
            </view>
            <view v-else-if="stepItem[0] && ['currency'].includes(stepItem[0].key)">
              <Currency :placeholder="`请选择${stepItem[0].filedName || ''}`"/>
            </view>
            <view v-else-if="stepItem[0] && ['leadTime'].includes(stepItem[0].key)">
              <view class="flexCenter">
                <ShopNumber number :value="value" @onChange="onChange"/>
                <view>天</view>
              </view>
            </view>
            <view v-else-if="stepItem[0] && ['date'].includes(stepItem[0].key)">
              <MyDatePicker/>
            </view>
          </template>
          <template v-slot:default
                    v-if="stepItem[0] && ['detailParams','paymentDetail','remark'].includes(stepItem[0].key)">
            <view v-if="stepItem[0] && ['detailParams'].includes(stepItem[0].key)"
                  style="padding: 8px;display: inline-block">
              <AddButton title="添加物料" size="14px" :plain="true"></AddButton>
            </view>
            <view v-else-if="stepItem[0] && ['paymentDetail'].includes(stepItem[0].key)"
                  style="padding: 8px;display: inline-block">
              <AddButton title="添加付款批次" size="14px" :plain="true"></AddButton>
            </view>
            <view v-else-if="stepItem[0] && ['remark'].includes(stepItem[0].key)"
                  style="padding: 8px">
              <view class="textArea">
                <u--textarea border="none"
                             v-model="textValue"
                             :placeholder="`请输入${stepItem[0].filedName || ''}`"
                             height="30"
                ></u--textarea>
              </view>
            </view>
          </template>
        </Card>
      </view>
    </view>


    <BottomButton
        rightText='下一步'
        leftText="上一步"
        :leftDisabled="currentStep === 0"
        @rightOnClick="rightOnClick"
        @leftOnClick="leftOnClick"
        :rightDisabled="disabled"
        :rightText="currentStep < steps.length - 1 ? '下一步' : '保存'"
    />


  </view>
</template>

<script>
import {request} from "MES-Apis/lib/Service/request";
import Card from "@/components/Card/index.vue";
import BottomButton from "@/components/BottomButton/index.vue";
import GeneralSelection from "@/components/GeneralSelection/index.vue";
import DefaultInput from "@/components/DefaultInput/index.vue";
import OtherOptions from "@/components/OtherOptions/index.vue";
import AddButton from "@/components/AddButton/index.vue";
import Money from "@/components/Money/index.vue";
import Currency from "@/components/Currency/index.vue";
import ShopNumber from "@/components/ShopNumber/index.vue";
import MyDatePicker from "@/components/MyDatePicker/index.vue";

export default {
  name: "FormLayout",
  components: {
    MyDatePicker,
    ShopNumber,
    Currency,
    Money,
    AddButton,
    OtherOptions,
    DefaultInput,
    GeneralSelection,
    BottomButton,
    Card
  },
  props: [
    'formType',
    'onSave',
    'required',
    'onSave',
    'data'
  ],
  data() {
    return {
      showCorporateName: false,
      currentStep: 0,
      steps: [],
      currentFiled: [],
      value: '',
      textValue: '',
      spanTitle: true,
      requiredFiled: []
    }
  },
  mounted() {
    this.get()
  },
  methods: {
    async get() {
      const list = await this.listByFormType('PURCHASEORDER')
      const data = list.data
      const typeSetting = data[0].typeSetting
      this.typeSetting = JSON.parse(typeSetting)
      const mobile = this.typeSetting.mobile
      this.steps = mobile.steps
      this.currentFiled = this.steps.map(item => item.data.map(item => item[0].data.map(item => item)))

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
    onClick() {
      this.showCorporateName = true
    },
    cancel() {
      this.showCorporateName = false
    },
    rightOnClick() {
      this.currentStep = this.currentStep + 1
    },
    leftOnClick() {
      this.currentStep = this.currentStep - 1
    },
    onChange(num) {
      this.value = num
    },
    Click(e) {
      console.log(e)
    }
  },
  computed: {
    disabled() {
      const requiredFiled = [];
      this.currentFiled[this.currentStep] && this.currentFiled[this.currentStep].map(item => item.forEach(item => {
        if (item.required) {
          requiredFiled.push(item.key)
        }
      }))
      return requiredFiled.length !== 0
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
</style>