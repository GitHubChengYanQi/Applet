<template>
  <view class="skuName">

    <view class="skuNameSpace" v-if="skuNames.length > 1">
      <Divider color="#007aff">
        <view class="skuNameTitle">
          <u-icon name="minus-circle" color="#dd524d" @click="$emit('remove')" />
          型号{{ index + 1 }}
        </view>
      </Divider>
    </view>


    <SkuFormItem
        class="skuFormItemComponent"
        icon="icon-xinghao"
        label="型号"
        @click="$emit('inputFiled','skuName')"
        :value="formData.skuName"
    />

    <view class="space" />

    <SkuFormItem
        class="skuFormItemComponent"
        icon="icon-guige"
        label="规格"
        @click="$emit('inputFiled','specifications')"
        :value="formData.specifications"
    />


    <SkuFormItem
        class="skuFormItemComponent"
        icon="icon-caigoujiage"
        label="采购价格"
        :value="`￥${formData.inPrice || 0}`"
        @click="$emit('keyboardShow','inPrice')"
    />

    <view class="space" />

    <SkuFormItem
        class="skuFormItemComponent"
        icon="icon-xiaoshoujiage"
        label="销售价格"
        :value="`￥${formData.outPrice || 0}`"
        @click="$emit('keyboardShow','outPrice')"
    />


    <SkuFormItem
        class="skuFormItemComponent"
        icon="icon-qichukucun"
        label="期初库存"
        :value="formData.initialNumber"
        @click="$emit('keyboardShow','initialNumber')"
    />


    <template v-if="open">
      <view class="otherFormItem" />

      <SkuFormItem
          class="skuFormItemComponent"
          label="养护周期"
          :value="(formData.maintenancePeriod || 0)+'天'"
          @click="$emit('keyboardShow','maintenancePeriod')"
      />

      <view class="space" />

      <SkuFormItem
          class="skuFormItemComponent"
          label="规格参数"
          @click="$emit('skuShow')"
          :value="isArray(formData.sku).map(item=>{
                          return (item.label || '-')+':'+(item.value || '-')
                        }).join(',')"
      />


      <SkuFormItem
          class="skuFormItemComponent"
          label="品牌"
          @click="$emit('selectBrand')"
          :value="isArray(formRenderData.brands).map(item=>item.brandName).join('、')"
      />

      <view class="space" />

      <SkuFormItem
          class="skuFormItemComponent"
          label="材质"
          :value="formRenderData.materialName"
          @click="$emit('filedShow','materialId')"
      />


      <SkuFormItem
          class="skuFormItemComponent"
          label="重量"
          :value="(formData.weight || 0)+'kg'"
          @click="$emit('keyboardShow','weight')"
      />

      <view class="space" />

      <SkuFormItem
          class="skuFormItemComponent"
          label="级别"
          :value="formData.level"
          @click="$emit('inputFiled','level')"
      />


      <SkuFormItem
          class="skuFormItemComponent"
          label="表色"
          :value="formData.color"
          @click="$emit('inputFiled','color')"
      />

      <view class="space" />

      <SkuFormItem
          class="skuFormItemComponent"
          label="热处理"
          :value="formData.heatTreatment"
          @click="$emit('inputFiled','heatTreatment')"
      />


      <SkuFormItem style="width: 100%" label="尺寸">
        <view class="skuSize">
          <view class="skuSizeItem" @click="$emit('keyboardShow','skuSizeLength')">
            长：
            <view class="skuSizeValue">{{ formData.skuSizeLength || 0 }}mm</view>
          </view>
          <view class="skuSizeItem" @click="$emit('keyboardShow','skuSizeWidth')">
            宽：
            <view class="skuSizeValue">{{ formData.skuSizeWidth || 0 }}mm</view>
          </view>
          <view class="skuSizeItem" @click="$emit('keyboardShow','skuSizeHeight')">
            高：
            <view class="skuSizeValue">{{ formData.skuSizeHeight || 0 }}mm</view>
          </view>
        </view>
      </SkuFormItem>


      <SkuFormItem
          class="skuFormItemComponent"
          label="图纸"
          @click="$emit('fileShow','drawing')"
      >
        <view class="fileRender" v-if="isArray(formData.drawing).length > 0">
          <u-icon name="file-text" size="24" color="#007aff" />
          x {{ formData.drawing.length }}
        </view>
      </SkuFormItem>

      <view class="space" />

      <SkuFormItem
          class="skuFormItemComponent"
          label="附件"
          @click="$emit('fileShow','fileId')"
      >
        <view class="fileRender" v-if="isArray(formData.fileId).length > 0">
          <u-icon name="file-text" size="24" color="#007aff" />
          x {{ formData.fileId.length }}
        </view>
      </SkuFormItem>


      <SkuFormItem
          class="skuFormItemComponent"
          label="包装方式"
          :value="formData.packaging"
          @click="$emit('inputFiled','packaging')"
      />

      <view class="space" />

      <SkuFormItem
          class="skuFormItemComponent"
          label="图幅"
          :value="formData.viewFrame"
          @click="$emit('inputFiled','viewFrame')"
      />


      <SkuFormItem
          style="width: 100%"
          class="skuFormItemComponent"
          label="备注"
          :value="formData.remarks"
          @click="$emit('inputFiled','remarks')"
      />

    </template>

    <Loading :loading="uploadLoading" />
  </view>
</template>


<script>
import {
  getLocalParmas,
  isArray,
  isNull
} from "../../../../util/Tools";
import Uploader from "../../../../components/Uploader";
import Loading from "../../../../components/Loading";
import Popup from "../../../../components/Popup";
import Modal from "../../../../components/Modal";
import Cascader from "../../../../components/Cascader";
import ShopNumber from "../../../../components/ShopNumber";
import Icon from "../../../../components/Icon";
import SkuFormItem from "../SkuFormItem";
import {safeAreaHeight} from '../../../../util/Tools'
import MyButton from "../../../../components/MyButton/index.vue";
import SkuInput from "../SkuInput/index.vue";
import SelectUnit from "../SelectUnit/index.vue";
import SelectCode from "../SelectCode/index.vue";
import Keybord from "../../../../components/Keybord/index.vue";
import SelectMaterial from "../SelectMaterial/index.vue";
import FileUpload from "../../../../components/Uploader/FileUpload/index.vue";
import SkuDescribe from "../SkuDescribe/index.vue";
import Divider from "../../../../components/Divider/index.vue";

export default {
  options: {
    styleIsolation: 'shared'
  },
  name: 'SkuName',
  components: {
    Divider,
    SkuDescribe,
    FileUpload,
    SelectMaterial,
    Keybord,
    SelectCode,
    SelectUnit,
    SkuInput,
    MyButton,
    SkuFormItem,
    Icon,
    ShopNumber,
    Cascader,
    Modal,
    Popup,
    Loading,
    Uploader,
  },
  props: ['open', 'index', 'skuNames', 'formData', 'formRenderData'],
  data() {
    return {
      safeAreaHeight,
      isArray,
      general: [],
      refreshLoading: false,
      uploadLoading: false,
      filedShow: '',
      keyboardShow: '',
      showContent: false,
      loading: false,
      skuShow: false,
      inputFiled: '',
      fileShow: ''
    }
  },
  mounted() {

  },
  methods: {
    generalFormData(key, value) {
      let exits = false;
      const newFormData = this.general.map(formDataItem => {
        if (formDataItem.fieldName === key) {
          exits = true;
          return {...formDataItem, value};
        }
        return formDataItem;
      });
      if (!exits && value) {
        newFormData.push({fieldName: key, value});
      }
      this.general = newFormData
    },
  },
}
</script>

<style lang="scss">
.skuName {
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  .skuNameTitle {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .skuNameSpace {
    margin-top: 24px;
    width: 100%;
  }
}
</style>
