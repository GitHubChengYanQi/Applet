<template>
  <view>
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
                v-for="(image,index) in isArray(this.formData.imageUrls)"
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

        <view :class="{endItem:typeSetting.length === 0}">
          <uni-forms-item
              label="物料分类"
              class="spuClass"
              name="spuClass"
              required
          >
            <view :class="[formData.spuClass?'grey2':'grey','select']" @click="show = true">
              <view class="value"> {{ formData.skuClassTitle || '请选择所属分类' }}</view>
              <u-icon name="arrow-down" size="15"></u-icon>
            </view>
            <van-popup :show="show" round position="bottom" @close="close" closeable>
              <van-cascader :options="cateGoryData" @finish="onFinish" :closeable="false" value='checked' />
            </van-popup>
          </uni-forms-item>
        </view>
        <template
            v-for="(item,index) in typeSetting"
            v-if="!['spuClass','images'].includes(item.key)">

          <view :class="{endItem:index === typeSetting.length-1}">
            <uni-forms-item
                :label="labelFormat(item)"
                :name="item.key"
                :key="item.key"
                :required="['spu','unitId','batch'].includes(item.key)"
            >
              <Batch v-if="item.key=='batch'" :placeholder="item.filedName" v-model="formData.batch"></Batch>
              <Brandids
                  v-else-if="item.key=='brandIds'"
                  :placeholder="item.filedName"
                  v-model="formData.brandIds"
              />
              <Drawing
                  v-else-if="item.key=='drawing'"
                  :placeholder="item.filedName"
                  v-model="formData.drawing"
              />
              <FileId v-else-if="item.key=='fileId'" :placeholder="item.filedName" v-model="formData.fileId"></FileId>
              <MaintenancePeriod
                  v-else-if="item.key=='maintenancePeriod'"
                  :placeholder="item.filedName"
                  v-model="formData.maintenancePeriod"
              />
              <MaterialId v-else-if="item.key=='materialId'" :placeholder="item.filedName"
                          v-model="formData.materialId"></MaterialId>
              <Remarks
                  v-else-if="item.key=='remarks'"
                  :placeholder="item.filedName"
                  v-model="formData.remarks"
              />
              <Sku v-else-if="item.key=='sku'" :placeholder="item.filedName" v-model="formData.sku"></Sku>
              <SkuSize
                  v-else-if="item.key=='skuSize'"
                  :placeholder="item.filedName"
                  v-model="formData.skuSize"
              />
              <Spu
                  :spuClassId="formData.spuClass"
                  v-else-if="item.key=='spu'"
                  :placeholder="item.filedName"
                  v-model="formData.spu"
                  @onSpuDetail="onSpuDetail"
              />
              <SpuCoding
                  v-else-if="item.key=='spuCoding'"
                  :placeholder="item.filedName"
                  v-model="formData.spuCoding"
              />
              <Standard
                  v-else-if="item.key=='standard'"
                  :placeholder="item.filedName"
                  v-model="formData.standard"
              />
              <UnitId v-else-if="item.key=='unitId'" :placeholder="item.filedName" v-model="formData.unitId"></UnitId>
              <Weight v-else-if="item.key=='weight'" :placeholder="item.filedName" v-model="formData.weight"></Weight>
              <Combox
                  v-else
                  :placeholder="item.filedName"
                  v-model="formData[item.key]"
                  :field-name="item.key"
              />
            </uni-forms-item>
          </view>

        </template>
      </uni-forms>
    </view>
    <view style="height:80px" />
    <BottomButton
        :loading="loading"
        only
        @onClick="formSubmit"
        v-if="typeSetting.length>0"
    />
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
import HeatTreatment from "../components/field/heat-treatment";
import UploadImages from "../components/field/images";
import Level from "../components/field/level";
import MaintenancePeriod from "../components/field/maintenance-period";
import MaterialId from "../components/field/material-id";
import Model from "../components/field/model";
import NationalStandard from "../components/field/nationalStandard";
import Packaging from "../components/field/packaging";
import PartNo from "../components/field/partNo";
import Remarks from "../components/field/remarks";
import Sku from "../components/field/sku";
import SkuSize from "../components/field/skuSize";
import Specifications from "../components/field/specifications";
import Spu from "../components/field/spu";
import SpuCoding from "../components/field/spuCoding";
import Standard from "../components/field/standard";
import UnitId from "../components/field/unitId";
import ViewFrame from "../components/field/viewFrame";
import Weight from "../components/field/weight";
import Uploader from "../../components/Uploader";
import {Sku as SkuApis} from "MES-Apis/lib/Sku/promise";
import Loading from "../../components/Loading";
import BottomButton from "../../components/BottomButton";
import {Message} from "../../components/Message";

export default {
  options: {
    styleIsolation: 'shared'
  },
  components: {
    BottomButton,
    Loading,
    Uploader,
    Card,
    Batch,
    Brandids,
    Combox,
    Drawing,
    FileId,
    HeatTreatment,
    UploadImages,
    Level,
    MaintenancePeriod,
    MaterialId,
    Model,
    NationalStandard,
    Packaging,
    PartNo,
    Remarks,
    Sku,
    SkuSize,
    Specifications,
    Spu,
    SpuCoding,
    Standard,
    UnitId,
    ViewFrame,
    Weight
  },
  mounted() {
    this.getCateGory();
  },
  data() {
    return {
      isArray,
      typeSetting: [],
      cateGoryData: [],
      formData: {},
      show: false,
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
    close() {
      this.show = false
    },
    async onFinish(e) {
      this.loading = true
      this.show = false;
      const {selectedOptions, value} = e.detail;
      const response = await this.getDetail(value);
      const {data} = response;
      this.typeSetting = isArray(JSON.parse(data.typeSetting)).filter(item => item.show);
      this.formData = {
        ...this.formData,
        spuClass: selectedOptions[0].value,
        skuClassTitle: selectedOptions[0].text
      }
      this.loading = false
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
    async getCateGory() {
      const response = await SkuApis.spuClassTreeView({data: {}});
      const {
        data
      } = response;
      this.cateGoryData = this.format(data);
    },
    format(data) {
      const list = [];
      data.forEach(item => {
        const obj = {
          text: item.title,
          value: item.key
        }
        if (item.children.length > 0) {
          obj.children = this.format(item.children);
        }
        list.push(obj);
      })

      return list;
    },
    formSubmit() {
      this.$refs.form.validate((err) => {
        if (!err) {
          const newValue = {
            ...this.formData,
            type: 0,
            isHidden: true,
            spu: {name: this.formData.spu, coding: this.formData.spuCoding},
            skuName: this.formData.nationalStandard || this.formData.model || this.formData.partNo,
            // generalFormDataParams: formData,
          };
          this.loading = true
          SkuApis.add({data: newValue}).then((res) => {
            Message.dialog({
              only: false,
              content: '添加成功！',
              cancelText: '继续添加',
              confirmText: '查看详情',
              onConfirm() {
                uni.redirectTo({
                  url: `/Sku/SkuDetail/index?skuId=${res.data}`
                })
                return true
              },
              onCancel() {

                return true
              }
            })
          }).catch(() => {
            Message.dialog({
              content: '添加失败！'
            })
          }).finally(() => {
            this.loading = false
          })
        } else {
          Message.dialog({
            content: '请检查必填项！'
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
.skuAdd {
  border-radius: 8px;
  margin: 24px 8px;
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
</style>
