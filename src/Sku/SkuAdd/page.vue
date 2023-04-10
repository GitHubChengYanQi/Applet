<template>
  <view>
    <Loading :skeleton="true" skeleton-type="page" v-if="refreshLoading" />
    <view v-else>
      <Loading :loading="loading" />
      <u-notice-bar text="需要批量添加物料可在管理平台进行导入"></u-notice-bar>


      <view class="skuAdd">
        <uni-forms ref="form" :model="formData" :rules="rules" labelWidth="100px">

          <uni-forms-item
              label="物料图片"
              class="images"
              name="images"
          >
            <view class="skuImgs">
              <u--image
                  v-for="(image,index) in isArray(formData.imageUrls)"
                  :key="index"
                  :showLoading="true"
                  :src="image.url"
                  :width='70'
                  :height="70"
                  @click="previewImage(image)"
              />
              <Uploader v-if="isArray(this.formData.imageUrls).length < 3" :size="70" @onChange="imgChange" />
            </view>
          </uni-forms-item>

          <uni-forms-item
              label="物料编码"
              name="standard"
          >
            <Standard
                placeholder="物料编码"
                v-model="formData.standard"
            />
          </uni-forms-item>

          <uni-forms-item
              label="分类"
              class="spuClass"
              name="spuClass"
              required
          >
            <view :class="[formData.spuClass?'grey2':'grey','select']" @click="show = true">
              <view class="value"> {{ formData.skuClassTitle || '请选择所属分类' }}</view>
              <u-icon name="arrow-down" size="15"></u-icon>
            </view>
            <Popup
                @close="show=false"
                :show="show"
                position="bottom"
                @onLeft="close"
                left-text="取消"
                right-text="新增"
                @onRight="addClass"
                title="选择分类"
                @closeAfter="showContent = false"
                @showBefore="showContent = true"
            >
              <van-cascader
                  :value="formData.spuClass"
                  v-if="showContent"
                  :show-header="false"
                  :options="cateGoryData"
                  @finish="onFinish"
              />
            </Popup>
          </uni-forms-item>


          <uni-forms-item
              label="产品名称"
              name="spu"
              required
          >
            <Spu
                :spuClassId="formData.spuClass"
                placeholder="产品名称"
                v-model="formData.spu"
                @onSpuDetail="onSpuDetail"
            />
          </uni-forms-item>

          <uni-forms-item
              label="产品码"
              name="spuCoding"
          >
            <SpuCoding
                placeholder="产品码"
                v-model="formData.spuCoding"
            />
          </uni-forms-item>


          <uni-forms-item
              label="型号/国家标准/零件号"
              name="skuName"
          >
            <Combox
                placeholder="型号/国家标准/零件号"
                v-model="formData.skuName"
                field-name="skuName"
                @change="generalFormData"
            />
          </uni-forms-item>

          <uni-forms-item
              label="规格"
              name="specifications"
          >
            <Combox
                placeholder="规格"
                v-model="formData.specifications"
                field-name="skuName"
                @change="generalFormData"
            />
          </uni-forms-item>

          <uni-forms-item
              label="单位"
              name="unitId"
              required
          >
            <UnitId placeholder="单位" v-model="formData.unitId"></UnitId>
          </uni-forms-item>

          <view>
            <uni-forms-item
                label="二维码生成方式"
                name="batch"
                required
            >
              <Batch v-model="formData.batch"></Batch>
            </uni-forms-item>
          </view>


          <view v-if="open">
            <uni-forms-item
                label="养护周期"
                name="maintenancePeriod"
            >
              <MaintenancePeriod
                  placeholder="养护周期"
                  v-model="formData.maintenancePeriod"
              />
            </uni-forms-item>

            <uni-forms-item
                label="规格参数"
                name="sku"
            >
              <Sku placeholder="规格参数" v-model="formData.sku"></Sku>
            </uni-forms-item>

            <uni-forms-item
                label="品牌"
                name="brandIds"
            >
              <Brandids placeholder="品牌" v-model="formData.brandIds" />
            </uni-forms-item>

            <uni-forms-item
                label="图纸"
                name="drawing"
            >
              <Drawing placeholder="图纸" v-model="formData.drawing" />
            </uni-forms-item>

            <uni-forms-item
                label="附件"
                name="fileId"
            >
              <FileId placeholder="附件" v-model="formData.fileId" />
            </uni-forms-item>

            <uni-forms-item
                label="材质"
                name="materialId"
            >
              <MaterialId
                  placeholder="材质"
                  v-model="formData.materialId"
              />
            </uni-forms-item>

            <uni-forms-item
                label="重量"
                name="weight"
            >
              <Weight placeholder="重量" v-model="formData.weight" />
            </uni-forms-item>

            <uni-forms-item
                label="尺寸"
                name="skuSize"
            >
              <SkuSize v-model="formData.skuSize" />
            </uni-forms-item>

            <uni-forms-item
                label="表色"
                name="color"
            >
              <Combox
                  placeholder="表色"
                  v-model="formData.color"
                  field-name="color"
                  @change="generalFormData"
              />
            </uni-forms-item>

            <uni-forms-item
                label="级别"
                name="level"
            >
              <Combox
                  placeholder="级别"
                  v-model="formData.level"
                  field-name="level"
                  @change="generalFormData"
              />
            </uni-forms-item>

            <uni-forms-item
                label="热处理"
                name="heatTreatment"
            >
              <Combox
                  placeholder="热处理"
                  v-model="formData.heatTreatment"
                  field-name="heatTreatment"
                  @change="generalFormData"
              />
            </uni-forms-item>


            <uni-forms-item
                label="包装方式"
                name="packaging"
            >
              <Combox
                  placeholder="包装方式"
                  v-model="formData.packaging"
                  field-name="packaging"
                  @change="generalFormData"
              />
            </uni-forms-item>

            <uni-forms-item
                label="图幅"
                name="viewFrame"
            >
              <Combox
                  placeholder="图幅"
                  v-model="formData.viewFrame"
                  field-name="viewFrame"
                  @change="generalFormData"
              />
            </uni-forms-item>

            <uni-forms-item
                label="备注"
                name="remarks"
            >
              <Remarks
                  placeholder="备注"
                  v-model="formData.remarks"
              />
            </uni-forms-item>
          </view>

        </uni-forms>

        <view class="open" @click="open = !open">
          {{ !open ? '展开完整信息' : '收起' }}
          <u-icon :name="!open ? 'arrow-down' : 'arrow-up'" />
        </view>
      </view>


      <view style="height:80px" />
      <BottomButton
          :loading="loading"
          only
          @onClick="formSubmit"
      />
    </view>
  </view>
</template>

<script>
import {
  isArray
} from "../../util/Tools";
import Card from '../../components/Card';
import Brandids from "../components/field/brand-ids";
import Batch from "../components/field/batch";
import Combox from "../components/field/Combox";
import Drawing from "../components/field/drawing";
import FileId from "../components/field/fileId";
import MaintenancePeriod from "../components/field/maintenance-period";
import MaterialId from "../components/field/material-id";
import Remarks from "../components/field/remarks";
import Sku from "../components/field/sku";
import SkuSize from "../components/field/skuSize";
import Spu from "../components/field/spu";
import SpuCoding from "../components/field/spuCoding";
import Standard from "../components/field/standard";
import UnitId from "../components/field/unitId";
import Weight from "../components/field/weight";
import Uploader from "../../components/Uploader";
import {Sku as SkuApis} from "MES-Apis/lib/Sku/promise";
import Loading from "../../components/Loading";
import BottomButton from "../../components/BottomButton";
import {Message} from "../../components/Message";
import Popup from "../../components/Popup";

export default {
  options: {
    styleIsolation: 'shared'
  },
  components: {
    Popup,
    BottomButton,
    Loading,
    Uploader,
    Card,
    Batch,
    Brandids,
    Combox,
    Drawing,
    FileId,
    MaintenancePeriod,
    MaterialId,
    Remarks,
    Sku,
    SkuSize,
    Spu,
    SpuCoding,
    Standard,
    UnitId,
    Weight
  },
  mounted() {
    const _this = this
    uni.$on('skuClassAddSuccess', (classId) => {
      _this.getCateGory(classId);
    })
    _this.getCateGory();
  },
  data() {
    return {
      isArray,
      typeSetting: [],
      cateGoryData: [],
      general: [],
      formData: {batch: 1},
      refreshLoading: false,
      show: false,
      showContent: false,
      open: false,
      loading: false,
      rules: {
        spuClass: {
          rules: [
            // 校验 name 不能为空
            {
              required: true,
              errorMessage: '请选择分类!',
            },
          ]
        },
        spu: {
          rules: [
            // 校验 name 不能为空
            {
              required: true,
              errorMessage: '请输入名称!',
            },
          ]
        },
        unitId: {
          rules: [
            // 校验 name 不能为空
            {
              required: true,
              errorMessage: '请选择单位!',
            },
          ]
        },
        batch: {
          rules: [
            // 校验 name 不能为空
            {
              required: true,
              errorMessage: '请选择二维码类型!',
            },
          ]
        },

      }
    }
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
    close() {
      this.show = false
    },
    addClass() {
      uni.navigateTo({
        url: '/Sku/SkuClass/SkuClassAdd/index'
      })
    },
    async onFinish(e) {
      // this.loading = true
      this.show = false;
      const {selectedOptions} = e.detail;
      // const response = await this.getDetail(value);
      // const {data} = response;
      // this.typeSetting = isArray(JSON.parse(data.typeSetting)).filter(item => item.show);
      this.formData = {
        ...this.formData,
        spuClass: selectedOptions[selectedOptions.length - 1].value,
        skuClassTitle: selectedOptions[selectedOptions.length - 1].text
      }
      // this.loading = false
    },
    imgChange(value) {
      this.formData = {
        ...this.formData,
        images: this.formData.images ? [...this.formData.images.split(','), value.id].join(',') : value.id,
        imageUrls: [
          ...isArray(this.formData.imageUrls),
          value
        ]
      }
    },
    onSpuDetail(spu) {
      this.formData = {
        ...this.formData,
        spuCoding: spu.coding,
        unitId: spu.unitId
      }
    },
    previewImage(current) {
      const _this = this
      uni.showActionSheet({
        itemList: ['删除', '预览'],
        success(event) {
          switch (event.tapIndex) {
            case 0:
              _this.formData = {
                ..._this.formData,
                images: _this.formData.images.split(',').filter(item => item !== current.id).join(','),
                imageUrls: isArray(_this.formData.imageUrls).filter(item => item.id !== current.id)
              }
              break;
            case 1:
              uni.previewImage({
                current: current.url,
                urls: _this.formData.imageUrls.map(item => item.url)
              })
              break;
            default:
              break
          }
        },
      })
    },
    async getCateGory(classId) {
      const response = await SkuApis.spuClassTreeView({data: {}});
      const {data} = response;
      const {list, currentObj} = this.format(data, classId);
      this.cateGoryData = list
      if (classId) {
        this.show = false
        this.formData = {
          ...this.formData,
          spuClass: currentObj.value,
          skuClassTitle: currentObj.text
        }
      }
    },
    format(data, classId) {
      const list = [];
      let currentObj = {}
      data.forEach(item => {
        const obj = {
          text: item.title,
          value: item.key
        }
        if (classId && item.key === classId) {
          currentObj = obj
        }
        if (item.children.length > 0) {
          const {children, currentObj: childrenCurrentObj} = this.format(item.children, classId)
          obj.children = children;
          currentObj = childrenCurrentObj
        }
        list.push(obj);
      })

      return {
        list,
        currentObj
      };
    },
    formSubmit() {
      this.$refs.form.validate((err) => {
        if (!err) {
          const newValue = {
            ...this.formData,
            type: 0,
            isHidden: true,
            spu: {name: this.formData.spu, coding: this.formData.spuCoding},
            nationalStandard: this.formData.skuName,
            model: this.formData.skuName,
            partNo: this.formData.skuName,
            generalFormDataParams: this.general,
            imageUrls: undefined,
            skuClassTitle: undefined
          };
          this.loading = true
          const _this = this
          SkuApis.add({data: newValue}).then((res) => {
            Message.dialog({
              only: false,
              title: '添加成功！',
              cancelText: '继续添加',
              confirmText: '查看详情',
              onConfirm() {
                uni.redirectTo({
                  url: `/Sku/SkuDetail/index?skuId=${res.data}`
                })
                return true
              },
              onCancel() {
                _this.formData = {}
                _this.refreshLoading = true
                setTimeout(() => {
                  _this.refreshLoading = false
                }, 1000)
                return true
              }
            })
          }).catch(() => {
            Message.dialog({
              title: '添加失败！'
            })
          }).finally(() => {
            this.loading = false
          })
        } else {
          Message.dialog({
            title: '请检查必填项！'
          })
        }
      })
    },
    async getDetail(spuClassificationId) {
      return SkuApis.skuFormLayout(spuClassificationId)
    },
    labelFormat(filed) {
      switch (filed.key) {
        case 'skuSize':
          return filed.filedName + '(mm)';
        default:
          return filed.filedName;
      }
    }
  },
}
</script>

<style lang="scss">

.box {
  top: 0;
  position: absolute;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  /* 主要内容 */
  background: rgba(0, 0, 0, .5);
  /* 模糊大小就是靠的blur这个函数中的数值大小 */
  backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.skuAdd {
  border-radius: 8px;
  margin: 16px 8px;
  padding: 12px;
  background-color: #fff;

  .skuImgs {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .uni-forms-item {
    margin: 0;
    padding: 12px 0;
    border-bottom: solid 1px #ebebeb;
  }
}

.endItem {
  .uni-forms-item {
    border-bottom: none;
  }
}

.select {
  display: flex;
  align-items: center;
  border: 1px solid #dcdfe6;
  padding: 0 10px;
  line-height: 34px;
  border-radius: 4px;

  .value {
    flex-grow: 1;
  }

  .icon {

  }
}


.grey {
  color: #ccc;
}

.grey2 {
  color: #434343;
}

.space {
  height: 3px;
}

.choice {
  display: flex;
}


.uni-input2 {
  width: 30px;
  padding-top: 2px;
}

.size {
  border: 1px solid #ccc;
  display: flex;
  padding: 0 10px;
  margin: 0 5px;
}

.symbol {
  line-height: 30px;
}

.company {
  font-size: 14px;
  padding-top: 2px;
  line-height: 18px;
  padding-left: 5px;
  color: #ccc;
}

.company2 {
  font-size: 14px;
  padding-top: 2px;
  line-height: 22px;
  padding-left: 5px;
  color: #ccc;
}

.open {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 16px;
  font-size: 12px;
  border: solid 1px #ebebeb;
  width: fit-content;
  margin: 16px auto auto;
  border-radius: 50px;
}
</style>
