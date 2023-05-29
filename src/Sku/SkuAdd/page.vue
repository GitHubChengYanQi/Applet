<template>
  <view>
    <Loading :skeleton="true" skeleton-type="page" v-if="refreshLoading" />
    <view v-else>

      <scroll-view class="skuAdd">

        <Uploader multiple @loading="onUploadLoading" :size="70" @onChange="imgChange">
          <view
              class="uploadSkuImg"
              :style="{
            backgroundImage:isArray(formRenderData.imageUrls).length > 0 ? `url(${isArray(formRenderData.imageUrls)[0].url.split('?')[0]+'?x-oss-process=image%2Fresize%2Cm_fill%2Ch_213%2Cw_'+windowWidth})` : `url(${sku_uploadImage})`,
          }"
          >
            <view :class="{box:isArray(formRenderData.imageUrls).length > 0}">
              <view class="imgTitle" :style="{color:isArray(formRenderData.imageUrls).length > 0 && '#fff'}">
                <Icon size="40" icon="icon-shangchuanwuliaotubiao" />
                上传物料图片
              </view>
            </view>
          </view>
        </Uploader>

        <movable-area
            class="movableArea"
            :style="{height: `calc(100vh - 20px + 213px + ${(uploadLoading || isArray(formRenderData.imageUrls).length > 0) ? 108 : 0}px)`}"
        >
          <movable-view
              :disabled="moveY === 0 && startMove === false"
              class="movableView"
              :y="y"
              direction="vertical"
              @change="change"
              :inertia="true"
              :friction="1"
          >

            <view class="content">

              <view class="comment-container" @touchstart="startMove = true" @touchend="touchend">
                <view class="comment-header">
                  <view class="comment-handler"></view>
                </view>
              </view>

              <scroll-view
                  :scroll-y="moveY === 0"
                  :style="{maxHeight: `calc(100vh - 20px - 33px - 47px - ${Object.keys(formData).length > 0 ? (65+12) : 0}px - ${safeAreaHeight(this,8)}px)`}"
                  @touchstart="startMove = true"
                  @touchend="touchend"
              >

                <view class="skuForm">
                  <SkuFormItem
                      required
                      class="skuFormItemComponent"
                      icon="icon-fenlei"
                      label="分类"
                      @click="filedShow = 'spuClass'"
                      :value="formRenderData.skuClassName"
                  />

                  <view class="space" />

                  <SkuFormItem
                      required
                      class="skuFormItemComponent"
                      icon="icon-chanpinmingcheng"
                      label="产品名称"
                      @click="inputFiled = 'spu';clickIndex=null"
                      :value="formData.spu"
                  />


                  <SkuFormItem
                      required
                      class="skuFormItemComponent"
                      icon="icon-jidanwei"
                      label="单位"
                      :value="formRenderData.unitName"
                      @click="filedShow = 'unitId'"
                  />

                  <view class="space" />

                  <SkuFormItem
                      required
                      class="skuFormItemComponent"
                      icon="icon-erweimal"
                      label="二维码"
                      :value="formRenderData.batchName"
                      @click="filedShow = 'batch'"
                  />

                  <SkuName
                      v-for="(skuName,index) in skuNames"
                      :key="index"
                      :form-data="skuName.formData"
                      :form-render-data="skuName.formRenderData"
                      style="width: 100%"
                      :open="open"
                      :index="index"
                      :skuNames="skuNames"
                      @inputFiled="(filed)=>onInputFiled(filed,index)"
                      @keyboardShow="(filed)=>onkeyboardShow(filed,index)"
                      @skuShow="onSkuShow(index)"
                      @selectBrand="onSelectBrand(index)"
                      @fileShow="(filed)=>onFileShow(filed,index)"
                      @filedShow="(filed)=>onFiledShow(filed,index)"
                      @remove="remove(index)"
                  />

                </view>

                <MyButton class="addSkuName" plain type="primary" @click="addSkuName">
                  <u-icon name="plus" color="#3c9cff" />
                  增加型号
                </MyButton>

                <view class="formDes">
                  注：
                  <u-badge isDot />
                  为必填项
                </view>

              </scroll-view>


              <view class="expand" @click="open = !open">
                <img :src="sku_expand" alt="">
                <view class="icon">
                  <Icon :icon="!open ? 'icon-shuangjiantouxia' : 'icon-shuangjiantoushang'" size="24" />
                </view>
              </view>

              <view class="footer" />

            </view>
          </movable-view>
        </movable-area>

        <scroll-view scroll-x style="width: 100vw" :scroll-left="scrollLeft" @scroll="skuImgsScroll">
          <view class="skuImgs">
            <u--image
                v-for="(image,index) in isArray(formRenderData.imageUrls)"
                :key="index"
                :showLoading="true"
                :src="image.url"
                :width='imgWidth'
                :height="imgWidth"
                @click="previewImage(image)"
            />
            <view v-if="uploadLoading" :style="{width:`${imgWidth}px`,height:`${imgWidth}px`}" class="imgLoading">
              <u-loading-icon mode="circle" />
            </view>
          </view>
        </scroll-view>

        <view
            v-if="Object.keys(formData).length > 0"
            class="saveButton"
            :style="{bottom: `calc(${safeAreaHeight(this,8)}px)`}"
        >
          <MyButton type="primary" @click="formSubmit">
            保存
          </MyButton>
        </view>
      </scroll-view>


      <!--        其他输入字段-->
      <SkuInput
          :show="inputFiled && clickIndex === null"
          :inputFiled="inputFiled"
          @close="inputFiled = ''"
          v-model="formData[inputFiled]"
          :params="{spuClassId:this.formData.spuClass}"
          @checked="checked"
          :textarea="inputFiled === 'remarks'"
      />

      <!--        skuName其他输入字段-->
      <SkuInput
          :show="inputFiled && clickIndex !== null"
          :inputFiled="inputFiled"
          @close="inputFiled = ''"
          v-model="skuNames[clickIndex].formData[inputFiled]"
          :params="{spuClassId:this.formData.spuClass}"
          @checked="checked"
          :textarea="inputFiled === 'remarks'"
          @change="(val)=>generalFormData(inputFiled,val)"
      />


      <!--        分类-->
      <Popup
          @close="filedShow = ''"
          :show="filedShow === 'spuClass'"
          position="bottom"
          @onLeft="filedShow = ''"
          left-text="取消"
          right-text="新增"
          title="选择分类"
          @closeAfter="showContent = false"
          @showBefore="showContent = true"
      >
        <template slot="rightButton">
          <view class="skuClassPopupActions">
            <MyButton
                @click="addClass"
                :customStyle="{height:'30px !important'}"
            >新增
            </MyButton>
            <MyButton
                @click="filedShow = ''"
                :customStyle="{height:'30px !important'}"
                type="primary"
            >确认
            </MyButton>
          </view>
        </template>
        <Loading skeleton v-if="getCateGoryLoading" />
        <Cascader
            v-else-if="showContent"
            :data="cateGoryData"
            :value="formData.spuClass"
            @change="onFinish"
            @close="filedShow = ''"
        />
      </Popup>

      <!--        单位-->
      <SelectUnit
          :value="formData.unitId"
          :label="formRenderData.unitName"
          :show="filedShow === 'unitId'"
          @close="filedShow = ''"
          @select="selectUnit"
      />

      <!--        二维码-->
      <SelectCode
          :value="formData.batch"
          :show="filedShow === 'batch'"
          @close="filedShow = ''"
          @select="selectBatch"
      />


      <!--        材质-->
      <SelectMaterial
          :label="skuNames[clickIndex].formRenderData.materialName"
          :value="skuNames[clickIndex].formData.materialId"
          :show="filedShow === 'materialId'"
          @close="filedShow = ''"
          @select="selectMaterial"
      />

      <!--        数量、价格-->
      <Keybord
          :visible="!!keyboardShow"
          @close="keyboardShow = ''"
          v-model="skuNames[clickIndex].formData[keyboardShow]"
          :min='0'
          :decimal="['initialNumber'].includes(keyboardShow) ? 0 : 2"
      />

      <!--      图纸、附件-->
      <Popup
          :show="!!fileShow"
          :title="fileShow === 'fileId' ? '附件' : '图纸'"
          @close="fileShow = ''"
          :destroy-on-close="false"
      >
        <view class="fileShow">
          <FileUpload
              @onLoading="(load)=>uploadFileLoading = load"
              v-model="skuNames[clickIndex].formData[fileShow]"
          >
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
          <SkuDescribe v-if="skuShow" v-model="skuNames[clickIndex].formData.sku" />
        </view>
      </Popup>

      <Loading :loading="loading || uploadFileLoading" />

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
  isArray, isNull
} from "../../util/Tools";
import Uploader from "../../components/Uploader";
import {Sku} from "MES-Apis/lib/Sku/promise";
import Loading from "../../components/Loading";
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
import MyButton from "../../components/MyButton/index.vue";
import SkuInput from "./components/SkuInput/index.vue";
import SelectUnit from "./components/SelectUnit/index.vue";
import SelectCode from "./components/SelectCode/index.vue";
import Keybord from "../../components/Keybord/index.vue";
import SelectMaterial from "./components/SelectMaterial/index.vue";
import FileUpload from "../../components/Uploader/FileUpload/index.vue";
import SkuDescribe from "./components/SkuDescribe/index.vue";
import SkuName from "./components/SkuName/index.vue";

export default {
  options: {
    styleIsolation: 'shared'
  },
  components: {
    SkuName,
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
      cateGoryData: [],
      general: [],
      skuNames: [{formData: {}, formRenderData: {}}],
      formData: {},
      formRenderData: {},
      refreshLoading: false,
      uploadLoading: false,
      uploadFileLoading: false,
      filedShow: '',
      keyboardShow: '',
      getCateGoryLoading: false,
      showContent: false,
      open: false,
      loading: false,
      skuShow: false,
      inputFiled: '',
      fileShow: '',
      clickIndex: null,
      scrollLeft: 0,
      skuImgsScrollLeft: 0
    }
  },
  computed: {},
  mounted() {
    this.windowWidth = this.$store.state.systemInfo.systemInfo.windowWidth
    this.imgWidth = (this.windowWidth - 60) / 4
    const _this = this

    // 选择品牌
    uni.$on('checkBrands', ({id, checkBrands = []}) => {
      this.skuNames[parseInt(id)].formData = {
        ...this.skuNames[parseInt(id)].formData,
        brandIds: checkBrands.map(item => item.brandId)
      }
      this.skuNames[parseInt(id)].formRenderData = {
        ...this.skuNames[parseInt(id)].formRenderData,
        brands: checkBrands
      }
    })

    // 添加分类
    uni.$on('skuClassAddSuccess', (classId) => {
      _this.getCateGory(classId);
    })
    _this.getCateGory();
  },
  methods: {
    reset() {
      this.formData = {}
      this.formRenderData = {}
      this.skuNames = [{formData: {}, formRenderData: {}}]
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
    async checked(checkedItem) {
      this.loading = true
      switch (checkedItem.filed) {
        case 'spu':
          Sku.spuDetail({
            data: {
              spuId: checkedItem.value
            }
          }).then((res) => {
            const detail = res?.data || {}
            this.saveFormData({
              unitId: detail.unitId,
              spuClass: detail.spuClassificationId
            }, {
              unitName: detail.unitResult?.unitName,
              skuClassName: detail.spuClassificationResult?.name
            })
          }).catch(() => {

          })
          break
      }
      this.loading = false
    },
    change(e) {
      this.move = true
      this.moveY = e.detail.y
    },
    touchend() {
      // if (!this.move) {
      //   return
      // }
      this.startMove = false
      this.move = false
    },
    generalFormData(key, value) {
      if (key === 'spu' || key === 'remarks') {
        return
      }
      const general = this.skuNames[this.clickIndex].general || []
      let exits = false;
      const newFormData = general.map(formDataItem => {
        if (formDataItem.fieldName === key) {
          exits = true;
          return {...formDataItem, value};
        }
        return formDataItem;
      });
      if (!exits && value) {
        newFormData.push({fieldName: key, value});
      }
      this.skuNames[this.clickIndex].general = newFormData
    },
    addClass() {
      uni.navigateTo({
        url: '/Sku/SkuClass/SkuClassAdd/index'
      })
    },
    onFinish({id, name}) {
      this.saveFormData({
        spuClass: id,
      }, {
        skuClassName: name
      })
    },
    selectUnit(unit) {
      this.saveFormData({
        unitId: unit.value
      }, {
        unitName: unit.label
      })
    },
    selectBatch(batch) {
      this.saveFormData({
        batch: batch.key
      }, {
        batchName: batch.text
      })
    },
    selectMaterial(material) {
      this.skuNames[this.clickIndex].formData = {
        ...this.skuNames[this.clickIndex].formData,
        materialId: material.value
      }
      this.skuNames[this.clickIndex].formRenderData = {
        ...this.skuNames[this.clickIndex].formRenderData,
        materialName: material.label
      }
    },
    onUploadLoading(loading) {
      if (loading && this.moveY !== 321) {
        this.y = this.moveY
        this.$nextTick(function () {
          this.y = 321
          this.moveY = 321
        })
      }
      if (loading) {
        this.uploadLoading = true
      }

      this.scrollLeft = this.skuImgsScrollLeft
      this.$nextTick(function () {
        if (isArray(this.formRenderData.imageUrls).length > 4) {
          this.scrollLeft = (this.formRenderData.imageUrls.length - 3) * this.imgWidth + (this.formRenderData.imageUrls.length - 3) * 12
        }
      })
    },
    imgChange(value) {
      this.saveFormData({
        images: this.formData.images ? [...this.formData.images.split(','), value.id].join(',') : value.id,
      }, {
        imageUrls: [
          ...isArray(this.formRenderData.imageUrls),
          value
        ]
      })
      this.uploadLoading = false
      setTimeout(() => {
        this.scrollLeft = this.skuImgsScrollLeft
        this.$nextTick(function () {
          if (isArray(this.formRenderData.imageUrls).length > 4) {
            this.scrollLeft = (this.formRenderData.imageUrls.length - 4) * this.imgWidth + (this.formRenderData.imageUrls.length - 4) * 12
          }
        })
      }, 100)
    },
    previewImage(current) {
      const _this = this
      uni.showActionSheet({
        itemList: ['置顶', '预览', '删除'],
        success(event) {
          switch (event.tapIndex) {
            case 0:
              const images = _this.formData.images.split(',') || []
              const imageUrls = isArray(_this.formRenderData.imageUrls)
              _this.saveFormData({
                images: images.map((item, index) => {
                  if (index === 0) {
                    return current.id
                  } else if (item === current.id) {
                    return images[0]
                  } else {
                    return item
                  }
                }).join(','),
              }, {
                imageUrls: imageUrls.map((item, index) => {
                  if (index === 0) {
                    return current
                  } else if (item.id === current.id) {
                    return imageUrls[0]
                  } else {
                    return item
                  }
                }),
              })
              break
            case 1:
              uni.previewImage({
                current: current.url,
                urls: _this.formRenderData.imageUrls.map(item => item.url)
              })
              break;
            case 2:
              _this.saveFormData({
                images: _this.formData.images.split(',').filter(item => item !== current.id).join(','),
              }, {
                imageUrls: isArray(_this.formRenderData.imageUrls).filter(item => item.id !== current.id)
              })
              break;
            default:
              break
          }
        },
      })
    },
    skuImgsScroll(e) {
      this.skuImgsScrollLeft = e.detail.scrollLeft
    },
    async getCateGory(classId) {
      this.getCateGoryLoading = true
      const response = await Sku.spuClassTreeView({data: {}});
      const {data} = response;
      const defaultId = getLocalParmas().search.classId
      const {list, currentObj, defaultClass} = this.format(data || [], classId, defaultId);

      this.cateGoryData = [{
        id: '0',
        name: '顶级',
        children: list
      }]

      if (classId) {
        this.filedShow = ''
        this.saveFormData({
          spuClass: currentObj?.id,
        }, {
          skuClassName: currentObj?.name
        })
      } else if (defaultId) {
        this.saveFormData({
          spuClass: defaultClass?.id,
        }, {
          skuClassName: defaultClass?.name
        })
      }
      this.getCateGoryLoading = false
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
      if (isNull(this.formData.spuClass)) {
        this.$refs.modal.dialog({title: '请选择分类!'})
      } else if (isNull(this.formData.spu)) {
        this.$refs.modal.dialog({title: '请输入产品名称!'})
      } else if (isNull(this.formData.unitId)) {
        this.$refs.modal.dialog({title: '请选择单位!'})
      } else if (isNull(this.formData.batch)) {
        this.$refs.modal.dialog({title: '请选择二维码生成方式!'})
      } else {
        const skuList = this.skuNames.map(item => {
          return {
            ...this.formData,
            type: 0,
            isHidden: true,
            spu: {name: this.formData.spu},
            ...item.formData,
            skuSize: `${(item.formData.skuSizeLength || 0)},${item.formData.skuSizeWidth || 0},${item.formData.skuSizeHeight || 0}`,
            model: item.formData.skuName,
            drawing: isArray(item.formData.drawing).map(item => item.id).toString(),
            fileId: isArray(item.formData.fileId).map(item => item.id).toString(),
            generalFormDataParams: item.general,
            skuSizeLength: undefined,
            skuSizeWidth: undefined,
            skuSizeHeight: undefined
          }
        })
        this.loading = true
        const _this = this
        Sku.batchAdd({data: {skuList}}).then((res) => {
          uni.$emit('skuAddSuccess')
          this.$refs.modal.dialog({
            only: false,
            title: '添加成功！',
            cancelText: '返回',
            confirmText: '继续添加',
            onConfirm() {
              _this.reset()
              _this.refreshLoading = true
              setTimeout(() => {
                _this.refreshLoading = false
              }, 1000)
              return true
            },
            onCancel() {
              uni.navigateBack()
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
      }
    },
    addSkuName() {
      this.skuNames = [...this.skuNames, {formData: {}, formRenderData: {}}]
    },
    onInputFiled(filed, index) {
      this.clickIndex = index
      this.inputFiled = filed
    },
    onkeyboardShow(filed, index) {
      this.clickIndex = index
      this.keyboardShow = filed
    },
    onSkuShow(index) {
      this.clickIndex = index
      this.skuShow = true
    },
    onFileShow(filed, index) {
      this.clickIndex = index
      this.fileShow = filed
    },
    onFiledShow(filed, index) {
      this.clickIndex = index
      this.filedShow = filed
    },
    remove(_thisIndex) {
      const _this = this
      this.$refs.modal.dialog({
        title: '确定要删除掉【型号' + (_thisIndex + 1) + '】吗？',
        only: false,
        confirmError: true,
        cancelText: '删除',
        onConfirm() {
          _this.skuNames = _this.skuNames.filter((item, index) => _thisIndex !== index)
          return true
        }
      })
    },
    onSelectBrand(index) {
      const _this = this
      uni.navigateTo({
        url: `/Sku/Brand/BrandList/index?type=multiple&id=${index}`,
        success: function (res) {
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('checkBrands', {
            checkBrands: _this.skuNames[index].formRenderData.brands || [],
          })
        }
      })
    },
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
      gap: 12px;
      color: #3D3D3D;
    }
  }

  .skuImgs {
    width: fit-content;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 12px 0;
    z-index: 1;

    .imgLoading {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #f3f4f6;
    }
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
        width: calc(50% - 8px);
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

    .fileRender {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .skuSize {
      display: flex;
      align-items: center;

      .skuSizeItem {
        flex-grow: 1;
        display: flex;
        align-items: center;

        .skuSizeValue {
          flex-grow: 1;
        }
      }
    }

    .expand {
      padding-top: 32px;
      height: 25px;
      display: flex;
      align-items: center;
      justify-content: center;

      image {
        position: absolute;
        width: 47px;
        height: 25px;
      }

      .icon {
        z-index: 1;
        margin-top: 6px;
      }
    }

    .footer {
      height: 6px;
      margin: 0 -18px;
      background-color: #257BDE;
    }
  }

  .saveButton {
    position: fixed;
    width: calc(100% - 24px);
    z-index: 5;
    margin: 0 12px;

    .myButton {
      width: 100%;

      button {
        width: 100% !important;
        border-radius: 50px;
        padding: 12px 0;
      }
    }
  }
}

.fileShow {
  padding: 24px;
  max-height: 50vh;
  overflow: hidden auto;

  .myButton {

    button {
      width: calc(100vw - 48px) !important;

      .uploadFile {
        display: flex;
        align-items: center;
        gap: 8px;
      }
    }


  }
}

.addSkuName {
  .myButton {
    display: inline-block;
    width: calc(100% - 24px);
    padding: 12px;

    > button {
      width: 100% !important;
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }
}

.skuDescribe {
  padding: 12px 24px;
  max-height: 50vh;
  overflow: hidden auto;
}

.skuClassPopupActions {
  display: flex;
  align-items: center;
  gap: 18px;
}

</style>
