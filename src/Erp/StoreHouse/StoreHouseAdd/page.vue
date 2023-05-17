<template>
  <view>
    <Loading skeleton-type="page" skeleton v-if="refreshLoading" />
    <scroll-view v-else class="storeHouseAdd">
      <view
          class="myMap"
          :style="{
        height:`${height - keyboardHeight - (topInputShow ? (searchPlacces.length * 52 + 8) :0)}px`
      }"
      >
        <map
            class="map"
            :scale="16"
            id="myMap"
            :longitude="location.longitude"
            :latitude="location.latitude"

            @regionchange="regionchange"
        />
        <view :class="{landmark:true,landmarkBounce}">
          <img :src="erp_map" alt="">
        </view>
      </view>

      <movable-area v-if="!topInputShow" class="movableArea">
        <movable-view
            :animation="false"
            class="movableView"
            :disabled="moveY === 0 && startMove === false"
            :x="x"
            :y="y"
            direction="vertical"
            @change="change"
        >
          <view class="comment-container" @touchstart="startMove = true" @touchend="touchend">
            <view class="comment-header">
              <view class="comment-handler"></view>
            </view>
          </view>
          <view
              class="storeHouseAddForm"
              :style="{overflow:moveY === 0 ? 'auto' : 'hidden'}"
              @touchstart="touchstart"
              @touchend="touchend"
          >
            <uni-forms
                ref="form"
                :model="formData"
                :rules="rules"
                validateTrigger="bind"
            >
              <uni-forms-item name="palce">
                <slot name="label">
                  <view class="label">
                    仓库地点
                    <view class="required">
                      <u-badge isDot />
                    </view>
                  </view>
                </slot>
                <view @click="keyboardInput('palce')">
                  <u--textarea
                      border="bottom"
                      autoHeight
                      :disabled="!windows"
                      :adjustPosition="false"
                      v-model="formData.palce"
                      placeholder="请输入仓库地点"
                  />
                </view>
              </uni-forms-item>

              <uni-forms-item name="name">
                <slot name="label">
                  <view class="label">
                    仓库名称
                    <view class="required">
                      <u-badge isDot />
                    </view>
                  </view>
                </slot>
                <view id="storeName" class="storeName" @click="onName">
                  <u-icon name="map-fill" color="#257BDE" />
                  <u--input
                      border="none"
                      v-model="formData.name"
                      placeholder="请输入仓库名称"
                      :adjustPosition="false"
                  />
                </view>
              </uni-forms-item>

              <uni-forms-item name="palce">
                <slot name="label">
                  <view class="label">
                    仓库描述
                  </view>
                </slot>
                <view @click="keyboardInput('palce')">
                  <u--textarea
                      border="bottom"
                      autoHeight
                      :disabled="!windows"
                      :adjustPosition="false"
                      v-model="formData.palce"
                      placeholder="请输入仓库地点"
                  />
                </view>
              </uni-forms-item>

              <uni-forms-item name="pid">
                <slot name="label">
                  <view class="label">
                    上级仓库
                    <view class="required">
                      <u-badge isDot />
                    </view>
                  </view>
                </slot>
                <Tree radio :data="storeHouseData" :value="{key:formData.pid}" @input="onPStoreHouse" />
              </uni-forms-item>

              <uni-forms-item name="classList">
                <slot name="label">
                  <view class="label">
                    存放分类
                  </view>
                </slot>
                <Tree :data="cateGoryData" :value="formData.classList" @input="onClassList" />
              </uni-forms-item>

            </uni-forms>
            <view :style="{height: `${60+safeAreaHeight(this,)}px`}" />
          </view>
        </movable-view>
      </movable-area>

      <BottomButton
          only
          text="保存"
          :loading="loading"
          @onClick="save"
      />


      <KeybordInput
          :title="topInputShow === 'palce' ? '仓库地点' : '仓库名称'"
          :show="topInputShow"
          @close="keyboardInputOk"
          v-model="formData[topInputShow]"
          :selectList="searchPlacces"
          :noAutoFocus="!autoFocus"
          @select="selectPlace"
      />

      <Modal ref="modal" />
    </scroll-view>
  </view>
</template>

<script>
import Popup from "../../../components/Popup";
import Cascader from "../../../components/Cascader";
import {Sku} from "MES-Apis/lib/Sku/promise";
import Tree from "../../../components/Tree";
import {isArray, safeAreaHeight} from "../../../util/Tools";
import Elliptsis from "../../../components/Ellipsis";
import MyButton from "../../../components/MyButton";
import {Storehouse} from "MES-Apis/lib/Storehouse/promise";
import Modal from "../../../components/Modal";
import Loading from "../../../components/Loading";
import KeybordInput from "../../../components/KeybordInput";
import {erp_map} from "../../../images/erp/map";
import BottomButton from "../../../components/BottomButton";

export default {
  options: {
    styleIsolation: 'shared'
  },
  props: ['storehouseId', 'pid'],
  components: {BottomButton, KeybordInput, Loading, Modal, MyButton, Elliptsis, Tree, Cascader, Popup},
  data() {
    return {
      safeAreaHeight,
      erp_map,
      refreshLoading: false,
      isArray,
      scale: 16,
      height: 100,
      top: 50,
      startMove: false,
      y: 0,
      move: false,
      topInputShow: false,
      landmarkBounce: false,
      moveY: 0,
      map: {},
      location: {},
      formData: {pid: '0', classList: []},
      markId: 0,
      time: null,
      cateGoryData: [],
      storeHouseData: [],
      loading: false,
      windows: false,
      inputStoreName: false,
      rules: {
        name: {
          rules: [
            {
              required: true,
              errorMessage: '请输入仓库名称!',
            },
          ]
        },
        palce: {
          rules: [
            {
              required: true,
              errorMessage: '请输入仓库地点！'
            },
          ]
        },
        pid: {
          rules: [
            {
              required: true,
              errorMessage: '请选择上级仓库！'
            },
          ]
        },
      },
      searchPlacces: [],
      autoFocus: true,
    }
  },
  computed: {
    keyboardHeight() {
      if (!!this.topInputShow) {
        const safeAreaHeight = this.$store.state.systemInfo.systemInfo?.safeAreaInsets?.bottom || 0
        const keyboardHeight = this.$store.state.keyboard.keyboardHeight
        return keyboardHeight < safeAreaHeight ? safeAreaHeight : keyboardHeight
      } else {
        return 0
      }

    }
  },
  created() {
    const _this = this
    wx.getSystemInfo({
      success: (res) => {
        _this.windows = false
        // _this.windows = res.platform !== "ios" && res.platform !== 'android'
      }
    });
    const windowHeight = this.$store.state.systemInfo.systemInfo.windowHeight
    this.y = windowHeight * 0.4
    this.moveY = windowHeight * 0.4
  },
  watch: {
    '$store.state.keyboard.keyboardHeight'(height) {
      const query = uni.createSelectorQuery().in(this);
      query.select('#storeName').boundingClientRect((res) => {
        const windowHeight = this.$store.state.systemInfo.systemInfo.windowHeight
        if (res && this.inputStoreName && (windowHeight - res.top) < height) {
          this.inputStoreName = false
          this.y = this.moveY
          setTimeout(() => {
            this.y = this.moveY - (height - (windowHeight - res.top)) - 40
          }, 0)
        }
      }).exec()
    },
    'formData.palce'(value) {
      if (this.refreshLoading) {
        return
      }
      const _this = this
      clearTimeout(this.time);
      this.time = setTimeout(() => {
        wx.request({
          //地图WebserviceAPI驾车路线规划接口 请求路径及参数（具体使用方法请参考开发文档）
          url: `https://apis.map.qq.com/ws/place/v1/search?key=ALWBZ-SCA3I-3TVGR-UX4VD-PGTG6-JEFNH&keyword=${value}&boundary=nearby(${this.location.latitude},${this.location.longitude},1000,1)&page_size=5`,
          success(res) {
            _this.searchPlacces = isArray(res?.data?.data).map(item => ({
              ...item,
              title: item.title,
              describe: item.address
            }))
          },
        })
      }, 500);
    }
  },
  async mounted() {
    this.refreshLoading = true
    await this.getCateGory()
    await this.init()
  },
  methods: {
    async getDetail(storehouseId) {
      await Storehouse.storeHouseDetailV2_0({
        data: {
          storehouseId
        }
      }).then((res) => {
        const data = res.data || {}
        this.formData = {
          name: data.name,
          palce: data.palce,
          pid: data.pid,
          classList: isArray(data.spuClassResults).map(item => ({
            key: item.spuClassificationId,
            title: item.name
          }))
        }
        if (!data.longitude) {
          const _this = this
          uni.getLocation({
            success(res) {
              _this.location = {
                longitude: res.longitude,
                latitude: res.latitude,
              }
              _this.moveToLocation()
            }
          })
        } else {
          this.location = {
            longitude: data.longitude,
            latitude: data.latitude,
          }
        }
        this.moveToLocation()
      }).catch(() => {
      })
    },
    async init() {
      this.refreshLoading = true
      const windowHeight = this.$store.state.systemInfo.systemInfo.windowHeight
      this.height = windowHeight * 0.5
      await this.getStoreHouseTree()
      this.map = uni.createMapContext('myMap', this)
      if (this.storehouseId) {
        await this.getDetail(this.storehouseId)
      } else {
        this.formData = {pid: this.pid || '0', classList: []}
        const _this = this
        uni.getLocation({
          success(res) {
            _this.location = {
              longitude: res.longitude,
              latitude: res.latitude,
            }
            _this.moveToLocation()
          }
        })
      }
      this.refreshLoading = false
    },
    regionchange(res) {
      if (res.type === 'end' && (res.causedBy === "drag")) {
        this.location = res.detail.centerLocation
        this.moveToLocation()
        const _this = this
        wx.request({
          //地图WebserviceAPI驾车路线规划接口 请求路径及参数（具体使用方法请参考开发文档）
          url: `https://apis.map.qq.com/ws/place/v1/explore?key=ALWBZ-SCA3I-3TVGR-UX4VD-PGTG6-JEFNH&boundary=nearby(${this.location.latitude},${this.location.longitude},1000,1)&page_size=5`,
          success(res) {
            _this.keyboardInput('palce', true)
            _this.searchPlacces = isArray(res?.data?.data).map(item => ({
              ...item,
              title: item.title,
              describe: item.address
            }))
          },
        })
      }
    },
    change(e) {
      if (!this.startMove) {
        return
      }
      this.move = true
      this.moveY = e.detail.y
      const windowHeight = this.$store.state.systemInfo.systemInfo.windowHeight
      // this.scale = 16 - ((windowHeight * 0.4) - e.detail.y) / ((windowHeight * 0.4) / 10)
      this.height = e.detail.y + windowHeight * 0.1
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
    moveToLocation() {
      const _this = this
      this.map.moveToLocation({
        ..._this.location,
        complete(res) {
          _this.landmarkBounce = true
          setTimeout(() => {
            _this.landmarkBounce = false
          }, 500)
        }
      })
    },
    async getStoreHouseTree() {
      const response = await Storehouse.storeHouseTreeV2_0();
      const {
        data
      } = response;
      this.storeHouseData = [{
        title: '顶级',
        key: '0',
        children: this.format(data || [])
      }];
    },
    async getCateGory() {
      const response = await Sku.spuClassTreeView({data: {}});
      const {
        data
      } = response;
      this.cateGoryData = data
    },
    format(data) {
      const list = [];
      data.forEach(item => {
        const obj = {
          title: item.name,
          key: item.storehouseId
        }
        if (item.children.length > 0) {
          obj.children = this.format(item.childrenList || []);
        }
        list.push(obj);
      })

      return list;
    },
    onName() {
      this.inputStoreName = true
    },
    keyboardInput(filed, noAutoFocus) {
      if (this.windows) {
        return
      }
      this.autoFocus = !noAutoFocus
      this.searchPlacces = []
      this.topInputShow = filed
      const windowHeight = this.$store.state.systemInfo.systemInfo.windowHeight
      this.height = windowHeight - 100
    },
    keyboardInputOk() {
      const windowHeight = this.$store.state.systemInfo.systemInfo.windowHeight
      this.topInputShow = false
      this.height = windowHeight * 0.5
    },
    selectPlace(address) {
      this.formData = {
        ...this.formData,
        palce: address.address
      }
      this.location = {
        longitude: address.location.lng,
        latitude: address.location.lat
      }
      this.keyboardInputOk()
    },
    onPStoreHouse(storeHouse) {
      this.formData = {
        ...this.formData,
        pid: storeHouse.key,
      }
    },
    onClassList(classList) {
      this.formData = {
        ...this.formData,
        classList
      }
    },
    save() {
      this.$refs.form.validate((err) => {
        if (!err) {
          this.loading = true

          if (this.storehouseId) {
            Storehouse.storeHouseEditV2_0({
              data: {
                storehouseId: this.storehouseId,
                ...this.formData,
                ...this.location,
                spuClassIds: isArray(this.formData.classList).map(item => item.key),
                classList: undefined
              }
            }).then((res) => {
              uni.$emit('storeHouseEditSuccess', {
                pid: this.formData.pid,
                id: this.storehouseId,
                name: this.formData.name
              })
              this.$refs.modal.dialog({
                title: "修改成功！",
                onConfirm() {
                  uni.navigateBack()
                  return true
                }
              })
            }).catch(() => {
              this.$refs.modal.dialog({
                title: '修改失败！'
              })
            }).finally(() => {
              this.loading = false
            })
            return
          }

          Storehouse.storeHouseAddV2_0({
            data: {
              ...this.formData,
              ...this.location,
              spuClassIds: isArray(this.formData.classList).map(item => item.key),
              classList: undefined
            }
          }).then((res) => {
            uni.$emit('storeHouseAddSuccess', {
              pid: this.formData.pid,
              id: res.data,
              name: this.formData.name
            })

            const _this = this
            this.$refs.modal.dialog({
              only: false,
              title: "添加成功！",
              confirmText: '继续添加',
              cancelText: '返回',
              onCancel() {
                uni.navigateBack()
                return true
              },
              onConfirm() {
                _this.init()
                return true
              }
            })
          }).catch(() => {
            this.$refs.modal.dialog({
              title: '添加失败！'
            })
          }).finally(() => {
            this.loading = false
          })
        }
      })
    },
  },
}

</script>

<style lang="scss">

.storeHouseAdd {
  overflow: hidden;
  height: 100vh;
  background-color: #fff;
}

.movableArea {
  position: absolute;
  top: 10vh;
  width: 100vw;
  height: 130vh;
  background-color: $body-color;
}

.movableView {
  width: 100vw;
  height: 90vh;
  background-color: #fff;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  z-index: 2;
}

.myMap {
  width: 100vw;
  z-index: 1;
  position: relative;

  .map {
    width: 100%;
    height: 100%;
  }

  .landmark {
    width: 50px;
    height: 100px;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;

    image {
      width: 50px;
      height: 50px;
    }
  }

  .landmarkBounce {
    animation: bounce .5s ease-in-out infinite;
  }
}

@keyframes bounce {
  0%, 100% {
    top: 0;
  }
  50% {
    top: -50px;
  }
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

.storeHouseAddForm {
  padding: 0 12px;
  max-height: calc(90vh - 33px);
  overflow: auto;

  .uni-forms-item {
    margin: 0;
    padding: 12px 0;
  }

  .label {
    font-size: 14px;
    color: #666666;
    padding: 0;
    height: fit-content;
    width: fit-content;
    position: relative;

    .required {
      position: absolute;
      top: 0;
      right: -4px;

      .u-badge {
        width: 4px;
        height: 4px;
      }
    }
  }


  .myButton {
    padding: 24px 0;
    width: 100% !important;

    > button {
      width: 100% !important;
      border-radius: 50px !important;
      padding: 8px 0 !important;
    }
  }

  .u-textarea--disabled {
    background-color: #fff !important;
  }

  .u-textarea, .u-input {
    padding: 8px 0 !important;
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
    height: 34px;
  }

  .icon {

  }
}

.storeName {
  display: flex;
  align-items: center;
  gap: 4px;
  border-bottom: solid 1px #dadbde;
}

</style>
