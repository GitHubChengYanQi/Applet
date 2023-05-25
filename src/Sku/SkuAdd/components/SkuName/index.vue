<template>
  <view class="skuName">

    <view class="skuNameSpace" v-if="skuNames.length > 1">
      <Divider color="#007aff">
        型号{{ index + 1 }}
      </Divider>
    </view>


    <SkuFormItem
        class="skuFormItemComponent"
        icon="icon-xinghao"
        label="型号"
        @click="inputFiled = 'skuName'"
        :value="formData.skuName"
    />

    <view class="space" />

    <SkuFormItem
        class="skuFormItemComponent"
        icon="icon-guige"
        label="规格"
        @click="inputFiled = 'specifications'"
        :value="formData.specifications"
    />


    <SkuFormItem
        class="skuFormItemComponent"
        icon="icon-qichukucun"
        label="期初库存"
        :value="formData.initialNumber"
        @click="keybordShow = 'initialNumber'"
    />

    <view class="space" />

    <SkuFormItem
        class="skuFormItemComponent"
        icon="icon-caigoujiage"
        label="采购价格"
        :value="`￥${formData.inPrice || 0}`"
        @click="keybordShow = 'inPrice'"
    />


    <SkuFormItem
        class="skuFormItemComponent"
        icon="icon-xiaoshoujiage"
        label="销售价格"
        :value="`￥${formData.outPrice || 0}`"
        @click="keybordShow = 'outPrice'"
    />

    <template v-if="open">
      <view class="otherFormItem" />

      <SkuFormItem
          class="skuFormItemComponent"
          label="养护周期"
          :value="(formData.maintenancePeriod || 0)+'天'"
          @click="keybordShow = 'maintenancePeriod'"
      />

      <view class="space" />

      <SkuFormItem
          class="skuFormItemComponent"
          label="规格参数"
          @click="skuShow = true"
          :value="isArray(formData.sku).map(item=>{
                          return (item.label || '-')+':'+(item.value || '-')
                        }).join(',')"
      />


      <SkuFormItem
          class="skuFormItemComponent"
          label="品牌"
          @click="selectBrand"
          :value="isArray(formRenderData.brands).map(item=>item.brandName).join('、')"
      />

      <view class="space" />

      <SkuFormItem
          class="skuFormItemComponent"
          label="材质"
          :value="formRenderData.materialName"
          @click="filedShow = 'materialId'"
      />


      <SkuFormItem
          class="skuFormItemComponent"
          label="重量"
          :value="(formData.weight || 0)+'kg'"
          @click="keybordShow = 'weight'"
      />

      <view class="space" />

      <SkuFormItem
          class="skuFormItemComponent"
          label="级别"
          @click="inputFiled = 'level'"
          :value="formData.level"
      />


      <SkuFormItem
          class="skuFormItemComponent"
          label="表色"
          @click="inputFiled = 'color'"
          :value="formData.color"
      />

      <view class="space" />

      <SkuFormItem
          class="skuFormItemComponent"
          label="热处理"
          @click="inputFiled = 'heatTreatment'"
          :value="formData.heatTreatment"
      />


      <SkuFormItem style="width: 100%" label="尺寸">
        <view class="skuSize">
          <view class="skuSizeItem" @click="keybordShow = 'skuSizeLength'">
            长：
            <view class="skuSizeValue">{{ formData.skuSizeLength || 0 }}mm</view>
          </view>
          <view class="skuSizeItem" @click="keybordShow = 'skuSizeWidth'">
            宽：
            <view class="skuSizeValue">{{ formData.skuSizeWidth || 0 }}mm</view>
          </view>
          <view class="skuSizeItem" @click="keybordShow = 'skuSizeHeight'">
            高：
            <view class="skuSizeValue">{{ formData.skuSizeHeight || 0 }}mm</view>
          </view>
        </view>
      </SkuFormItem>


      <SkuFormItem
          class="skuFormItemComponent"
          label="图纸"
          @click="fileShow = 'drawing'"
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
          @click="fileShow = 'fileId'"
      >
        <view class="fileRender" v-if="isArray(formData.fileId).length > 0">
          <u-icon name="file-text" size="24" color="#007aff" />
          x {{ formData.fileId.length }}
        </view>
      </SkuFormItem>


      <SkuFormItem
          class="skuFormItemComponent"
          label="包装方式"
          @click="inputFiled = 'packaging'"
          :value="formData.packaging"
      />

      <view class="space" />

      <SkuFormItem
          class="skuFormItemComponent"
          label="图幅"
          @click="inputFiled = 'viewFrame'"
          :value="formData.viewFrame"
      />


      <SkuFormItem
          style="width: 100%"
          class="skuFormItemComponent"
          label="备注"
          @click="inputFiled = 'remarks'"
          :value="formData.remarks"
      />

    </template>


    <!--        其他输入字段-->
    <SkuInput
        :show="inputFiled"
        @close="inputFiled = ''"
        v-model="formData[inputFiled]"
        :params="{spuClassId:this.formData.spuClass}"
        :textarea="inputFiled === 'remarks'"
        @change="(val)=>generalFormData(inputFiled,val)"
    />


    <!--        材质-->
    <SelectMaterial
        :value="formData.materialId"
        :show="filedShow === 'materialId'"
        @close="filedShow = ''"
        @select="selectMaterial"
    />

    <!--        数量、价格-->
    <Keybord
        :visible="!!keybordShow"
        @close="keybordShow = ''"
        :value="formData[keybordShow]"
        :min='0'
        :decimal="['initialNumber'].includes(keybordShow) ? 0 : 2"
        @onChange="(val)=>formData[keybordShow] = val"
    />

    <!--      图纸、附件-->
    <Popup
        :show="!!fileShow"
        :title="fileShow === 'fileId' ? '附件' : '图纸'"
        @close="fileShow = ''"
        :destroy-on-close="false"
    >
      <view class="fileShow">
        <FileUpload @onLoading="(load)=>uploadLoading = load" v-model="formData[fileShow]">
          <MyButton type="primary">
            <view class="uploadFile">
              <uni-icons type="upload" color="#ffffff" />
              上传
            </view>
          </MyButton>
        </FileUpload>
      </view>
    </Popup>


    <!--      sku物料描述-->
    <Popup
        :show="skuShow"
        title="物料描述"
        @close="skuShow = false"
    >
      <view class="skuDescribe">
        <SkuDescribe v-model="formData.sku" />
      </view>
    </Popup>

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
  props: ['open', 'index', 'skuNames'],
  data() {
    return {
      safeAreaHeight,
      isArray,
      general: [],
      formData: {},
      formRenderData: {},
      refreshLoading: false,
      uploadLoading: false,
      filedShow: '',
      keybordShow: '',
      showContent: false,
      loading: false,
      skuShow: false,
      inputFiled: '',
      fileShow: ''
    }
  },
  mounted() {
    const _this = this

    // 选择品牌
    uni.$on('checkBrands', ({checkBrands = []}) => {
      _this.saveFormData({brandIds: checkBrands.map(item => item.brandId)}, {
        brands: checkBrands
      })
    })
  },
  methods: {
    selectBrand() {
      const _this = this
      uni.navigateTo({
        url: `/Sku/Brand/BrandList/index?type=multiple`,
        success: function (res) {
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('checkBrands', {
            checkBrands: _this.formRenderData.brands,
          })
        }
      })
    },
    reset() {
      this.formData = {}
      this.formRenderData = {}
    },
    saveFormData(value, label) {
      this.formData = {
        ...this.formData,
        ...value
      }
      this.formRenderData = {
        ...this.formRenderData,
        ...label
      }
    },
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
    selectBatch(batch) {
      this.saveFormData({
        batch: batch.key
      }, {
        batchName: batch.text
      })
    },
    selectMaterial(material) {
      this.saveFormData({
        materialId: material.key
      }, {
        materialName: material.text
      })
    },
  },
}
</script>

<style lang="scss">
.skuName {
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  .skuNameSpace {
    margin-top: 24px;
    width: 100%;
  }
}
</style>
