<template>
  <view>
    <Loading :skeleton="true" skeleton-type="page" v-if="refreshLoading" />
    <view v-else>
      <Loading :loading="loading" />

      <scroll-view class="skuAdd">

        <Uploader :size="70" @onChange="imgChange">
          <view
              class="uploadSkuImg"
              :style="{
            backgroundImage:isArray(formData.imageUrls).length > 0 ? `url(${isArray(formData.imageUrls)[0].url.split('?')[0]+'?x-oss-process=image%2Fresize%2Cm_fill%2Ch_213%2Cw_'+windowWidth})` : `url(${sku_uploadImage})`,
          }"
          >
            <view :class="{box:isArray(formData.imageUrls).length > 0}">
              <view class="imgTitle" :style="{color:isArray(formData.imageUrls).length > 0 && '#fff'}">
                <u-icon size="60" color="#dcdee0" name="camera-fill" />
                上传物料图片
              </view>
            </view>
          </view>
        </Uploader>

        <movable-area
            class="movableArea"
            :style="{height: `calc(100vh - 20px + 213px + ${isArray(formData.imageUrls).length > 0 ? 108 : 0}px)`}"
        >
          <movable-view
              :disabled="moveY === 0 && startMove === false"
              class="movableView"
              :y="y"
              :x="x"
              direction="vertical"
              @change="change"
          >

            <view class="content">

              <view class="comment-container" @touchstart="startMove = true" @touchend="touchend">
                <view class="comment-header">
                  <view class="comment-handler"></view>
                </view>
              </view>

              <view
                  class="skuForm"
                  :style="{
                overflow:moveY === 0 ? 'auto' : 'hidden',
                 maxHeight: `calc(100vh - 20px - 33px - 81px - ${safeAreaHeight(this,8)}px)`
              }"
                  @touchstart="touchstart"
                  @touchend="touchend"
              >

                <SkuFormItem required class="skuFormItemComponent" icon="icon-fenlei" label="分类" />

                <view class="space" />

                <SkuFormItem required class="skuFormItemComponent" icon="icon-chanpinmingcheng" label="产品名称" />


                <SkuFormItem class="skuFormItemComponent" icon="icon-xinghao" label="型号/国家标准/零件号" />

                <view class="space" />

                <SkuFormItem class="skuFormItemComponent" icon="icon-guige" label="规格" />


                <SkuFormItem required class="skuFormItemComponent" icon="icon-jidanwei" label="单位" />

                <view class="space" />

                <SkuFormItem required class="skuFormItemComponent" icon="icon-erweimal" label="二维码" />

                <template v-if="open">
                  <view class="otherFormItem" />

                  <SkuFormItem class="skuFormItemComponent" label="养护周期" />

                  <view class="space" />

                  <SkuFormItem class="skuFormItemComponent" label="规格参数" />


                  <SkuFormItem class="skuFormItemComponent" label="品牌" />

                  <view class="space" />

                  <SkuFormItem class="skuFormItemComponent" label="材质" />


                  <SkuFormItem class="skuFormItemComponent" label="重量" />

                  <view class="space" />

                  <SkuFormItem class="skuFormItemComponent" label="级别" />


                  <SkuFormItem class="skuFormItemComponent" label="表色" />

                  <view class="space" />

                  <SkuFormItem class="skuFormItemComponent" label="热处理" />


                  <SkuFormItem style="width: 100%" label="尺寸" />


                  <SkuFormItem class="skuFormItemComponent" label="图纸" />

                  <view class="space" />

                  <SkuFormItem class="skuFormItemComponent" label="附件" />


                  <SkuFormItem class="skuFormItemComponent" label="包装方式" />

                  <view class="space" />

                  <SkuFormItem class="skuFormItemComponent" label="图幅" />


                  <SkuFormItem style="width: 100%" class="skuFormItemComponent" label="备注" />

                </template>
              </view>

              <view class="formDes">
                注：
                <u-badge isDot />
                为必填项
              </view>

              <view class="expand" @click="open = !open">
                <img :src="sku_expand" alt="">
                <view class="icon">
                  <Icon :icon="!open ? 'icon-shuangjiantouxia' : 'icon-shuangjiantoushang'" size="10" />
                </view>
              </view>

              <view class="footer" />

            </view>
          </movable-view>
        </movable-area>

        <view class="skuImgs">
          <u--image
              v-for="(image,index) in isArray(formData.imageUrls)"
              :key="index"
              :showLoading="true"
              :src="image.url"
              :width='imgWidth'
              :height="imgWidth"
              @click="previewImage(image)"
          />
        </view>

        <uni-forms v-if="false" ref="form" :model="formData" :rules="rules" labelWidth="100px">

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
              <Cascader
                  :changeOnSelect="false"
                  v-if="showContent"
                  :data="cateGoryData"
                  :value="formData.spuClass"
                  @change="onFinish"
                  @close="show=false"
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

          <!--          <uni-forms-item-->
          <!--              label="初始库存"-->
          <!--              name="initialNumber"-->
          <!--              required-->
          <!--          >-->
          <!--           <view class="formItem">-->
          <!--             <ShopNumber :min="0" v-model="formData.initialNumber" />-->
          <!--           </view>-->
          <!--          </uni-forms-item>-->

          <uni-forms-item
              label="单位"
              name="unitId"
              required
          >
            <UnitId placeholder="单位" v-model="formData.unitId"></UnitId>
          </uni-forms-item>

          <view>
            <uni-forms-item
                label="二维码"
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
      </scroll-view>


      <view style="height:80px" v-if="false" />
      <BottomButton
          v-if="false"
          :loading="loading"
          only
          @onClick="formSubmit"
      />
    </view>

    <Modal ref="modal" />

  </view>
</template>

<script>
import {
  getLocalParmas,
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
import Popup from "../../components/Popup";
import Modal from "../../components/Modal";
import Cascader from "../../components/Cascader";
import ShopNumber from "../../components/ShopNumber";
import {Init} from "MES-Apis/lib/Init";
import Icon from "../../components/Icon";
import SkuFormItem from "./components/SkuFormItem";
import {sku_uploadImage} from "../../images/sku/uploadImage";
import {sku_expand} from "../../images/sku/expand";
import {safeAreaHeight} from '../../util/Tools'

export default {
  options: {
    styleIsolation: 'shared'
  },
  components: {
    SkuFormItem,
    Icon,
    ShopNumber,
    Cascader,
    Modal,
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
  data() {
    return {
      safeAreaHeight,
      startMove: false,
      y: 213,
      move: false,
      moveY: 213,
      sku_expand,
      sku_uploadImage,
      isArray,
      imgWidth: 0,
      windowWidth: 0,
      typeSetting: [],
      cateGoryData: [],
      general: [],
      formData: {
        batch: 1,
        initialNumber: 0,

      },
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
  mounted() {
    this.windowWidth = this.$store.state.systemInfo.systemInfo.windowWidth
    this.imgWidth = (this.windowWidth - 60) / 4
    const _this = this
    uni.$on('skuClassAddSuccess', (classId) => {
      _this.getCateGory(classId);
    })
    _this.getCateGory();
  },
  methods: {
    change(e) {
      if (!this.startMove) {
        return
      }
      this.move = true
      this.moveY = e.detail.y
    },
    touchstart() {
      if (this.moveY === 0) {

      } else {
        this.startMove = true
      }
    },
    touchend() {
      if (!this.move) {
        return
      }
      this.startMove = false
      this.move = false
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
    close() {
      this.show = false
    },
    addClass() {
      uni.navigateTo({
        url: '/Sku/SkuClass/SkuClassAdd/index'
      })
    },
    async onFinish({id, name}) {
      this.formData = {
        ...this.formData,
        spuClass: id,
        skuClassTitle: name
      }
      // this.loading = false
    },
    imgChange(value) {

      if (this.moveY !== 321) {
        this.y = this.moveY
        this.$nextTick(function () {
          this.y = 321
          this.moveY = 321
        })
      }

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
      const defaultId = getLocalParmas().search.classId
      const {list, currentObj, defaultClass} = this.format(data || [], classId, defaultId);

      this.cateGoryData = list
      if (classId) {
        this.show = false
        this.formData = {
          ...this.formData,
          spuClass: currentObj && currentObj.id,
          skuClassTitle: currentObj && currentObj.name
        }
      } else if (defaultId) {
        this.formData = {
          ...this.formData,
          spuClass: defaultClass && defaultClass.id,
          skuClassTitle: defaultClass && defaultClass.name
        }
      }
    },
    format(data, classId, defaultClassId) {
      const list = [];
      let currentObj = null
      let defaultClass = null
      data.forEach(item => {
        const obj = {
          name: item.title,
          id: item.key
        }
        if (classId && item.key === classId) {
          currentObj = obj
        }
        if (defaultClassId && item.key === defaultClassId) {
          defaultClass = obj
        }
        if (item.children.length > 0) {
          const {
            list,
            currentObj: childrenCurrentObj,
            defaultClass: childrenDefaultClass
          } = this.format(item.children, classId, defaultClassId)
          obj.children = list;
          if (!currentObj) {
            currentObj = childrenCurrentObj
          }
          if (!defaultClass) {
            defaultClass = childrenDefaultClass
          }
        }
        list.push(obj);
      })

      return {
        list,
        currentObj,
        defaultClass
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
          SkuApis.addV2_0({data: newValue}).then((res) => {
            uni.$emit('skuAddSuccess')
            this.$refs.modal.dialog({
              only: false,
              title: '添加成功！',
              cancelText: '继续添加',
              confirmText: '查看详情',
              onConfirm() {
                _this.formData = {}
                _this.refreshLoading = true
                setTimeout(() => {
                  _this.refreshLoading = false
                }, 1000)
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
            this.$refs.modal.dialog({
              title: Init.getNewErrorMessage() || '添加失败！'
            })
          }).finally(() => {
            this.loading = false
          })
        } else {
          this.$refs.modal.dialog({
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

.movableArea {
  position: absolute;
  top: 20px;
  width: 100vw;
}

.movableView {
  width: 100vw;
  height: calc(100vh - 20px);
  z-index: 2;
}

.comment-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  //position: absolute;
  //top: 0;
  z-index: 999;
}

.comment-header {
  width: 100%;
  font-size: 16px;
  text-align: center;
  padding: 15px 0;
}

.comment-handler {
  width: 50px;
  height: 3px;
  border-radius: 3px;
  background-color: #EEE;
  margin: 0 auto;
}

.skuAdd {
  height: 100vh;

  .uploadSkuImg {
    z-index: 1;
    width: 100vw;
    height: 213px;
    background-color: #fff;
    box-shadow: 0 6px 9px -2px rgba(220, 220, 220, 0.3);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    flex-direction: column;
    background-size: cover;

    .box {
      top: 0;
      position: absolute;
      left: 0;
      right: 0;
      width: 100%;
      height: 100%;
      /* 主要内容 */
      background: rgba(0, 0, 0, .1);
      /* 模糊大小就是靠的blur这个函数中的数值大小 */
      backdrop-filter: blur(12px);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
    }

    .imgBox {
      position: absolute;
      background: rgba(255, 255, 255, 0.9);
      box-shadow: 0 6px 9px -2px rgba(220, 220, 220, 0.3);
    }

    .imgTitle {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      z-index: 1;
      color: #3D3D3D;
    }
  }

  .skuImgs {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 12px 0;
    overflow: auto;
    z-index: 1;
  }

  .content {
    margin: 0 12px;
    padding: 0 18px;
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 0 9px 0 rgba(220, 220, 220, 0.4);

    .skuForm {
      display: flex;
      align-items: center;
      flex-wrap: wrap;

      .skuFormItemComponent {
        width: calc(50% - 8px)
      }

      .space {
        width: 16px;
      }

      .otherFormItem {
        width: 100%;
        border-bottom: 3px solid #E1EBF6;
      }
    }

    .formDes {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      padding-top: 12px;
      color: #999999;
      gap: 8px;
    }

    .expand {
      padding-top: 32px;
      height: 15px;
      display: flex;
      align-items: center;
      justify-content: center;

      image {
        position: absolute;
        width: 37px;
        height: 15px;
      }

      .icon {
        z-index: 1;
        margin-top: 2px;
      }
    }

    .footer {
      height: 6px;
      margin: 0 -18px;
      background-color: #257BDE;
    }
  }
}

</style>
