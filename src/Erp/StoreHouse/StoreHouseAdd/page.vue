<template>
  <view>
    <Loading skeleton-type="page" skeleton v-if="refreshLoading" />
    <scroll-view v-else class="storeHouseAdd">
      <map
          class="myMap"
          :scale="scale"
          id="myMap"
          :longitude="location.longitude"
          :latitude="location.latitude"
          :markers="markers"
          :style="{height:`${height - keyboardHeight}px`}"
          @regionchange="regionchange"
      />
      <movable-area v-if="!topInputShow" class="movableArea">
        <movable-view
            :disabled="!startMove"
            class="movableView"
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
          <view class="skuClassAdd">
            <uni-forms
                ref="form"
                :model="formData"
                :rules="rules"
                labelWidth="100px"
                validateTrigger="bind"
                label-position="top"
            >

              <uni-forms-item
                  label="仓库地点"
                  name="palce"
                  required
              >
                <view @click="keyboardInput('palce')">
                  <uni-easyinput
                      type="textarea"
                      autoHeight
                      :disabled="!windows"
                      v-model="formData.palce"
                      placeholder="请输入仓库地点"
                  />
                </view>
              </uni-forms-item>

              <uni-forms-item
                  label="仓库名称"
                  name="name"
                  required
              >
                <view id="storeName" @click="onName">
                  <uni-easyinput v-model="formData.name" placeholder="请输入仓库名称" />
                </view>
              </uni-forms-item>

              <uni-forms-item
                  label="上级仓库"
                  name="pid"
                  required
              >
                <Tree radio :data="storeHouseData" :value="{key:formData.pid}" @input="onPStoreHouse" />
              </uni-forms-item>

              <uni-forms-item
                  label="存放分类"
                  name="classList"
              >
                <Tree :data="cateGoryData" :value="formData.classList" @input="onClassList" />
              </uni-forms-item>

            </uni-forms>

            <MyButton :loading="loading" type="primary" @click="save">
              保存
            </MyButton>
          </view>
        </movable-view>
      </movable-area>

      <KeybordInput
          :title="topInputShow === 'palce' ? '仓库地点' : '仓库名称'"
          :show="topInputShow"
          @close="keyboardInputOk"
          v-model="formData[topInputShow]"
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
import {isArray} from "../../../util/Tools";
import Elliptsis from "../../../components/Ellipsis";
import MyButton from "../../../components/MyButton";
import {Storehouse} from "MES-Apis/lib/Storehouse/promise";
import Modal from "../../../components/Modal";
import Loading from "../../../components/Loading";
import KeybordInput from "../../../components/KeybordInput";

export default {
  options: {
    styleIsolation: 'shared'
  },
  props: ['storehouseId', 'pid'],
  components: {KeybordInput, Loading, Modal, MyButton, Elliptsis, Tree, Cascader, Popup},
  data() {
    return {
      refreshLoading: false,
      isArray,
      scale: 16,
      height: 100,
      top: 50,
      y: 0,
      move: false,
      startMove: false,
      topInputShow: false,
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
      }
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

    },
    markers() {
      this.markId = this.markId + 1
      if (uni.getSystemInfoSync().platform === 'devtools') {
        return Object.keys(this.location).length > 0 ? [{
          ...this.location,
          width: 34,
          height: 50,
          id: this.markId,
        }] : []
      } else {
        return Object.keys(this.location).length > 0 ? [{
          ...this.location,
          id: this.markId,
        }] : []
      }

    }
  },
  created() {
    const _this = this
    wx.getSystemInfo({
      success: (res) => {
        // _this.windows = false
        _this.windows = res.platform !== "ios" && res.platform !== 'android'
      }
    });
    const windowHeight = this.$store.state.systemInfo.systemInfo.windowHeight
    this.y = windowHeight * 0.4
  },
  watch: {
    '$store.state.keyboard.keyboardHeight'(height) {
      const query = uni.createSelectorQuery().in(this);
      query.select('#storeName').boundingClientRect((res) => {
        const windowHeight = this.$store.state.systemInfo.systemInfo.windowHeight
        if (res && this.inputStoreName && (windowHeight - res.top) < height) {
          this.inputStoreName = false
          this.keyboardInput('name')
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
          url: `https://apis.map.qq.com/ws/place/v1/search?key=ALWBZ-SCA3I-3TVGR-UX4VD-PGTG6-JEFNH&keyword=${value}&boundary=nearby(${this.location.latitude},${this.location.longitude},1000,1)&page_size=1`,
          success(res) {
            if (res.data.data && res.data.data[0]) {
              const place = res.data.data[0].location
              _this.location = {
                longitude: place.lng,
                latitude: place.lat
              }
              _this.moveToLocation()
            }
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
      if (res.type === 'end' && res.causedBy === "drag") {
        console.log(res)
        this.location = res.detail.centerLocation
        this.moveToLocation()
      }
    },
    change(e) {
      if (!this.startMove) {
        return
      }
      this.move = true
      this.moveY = e.detail.y
      const windowHeight = this.$store.state.systemInfo.systemInfo.windowHeight
      this.scale = 16 - ((windowHeight * 0.4) - e.detail.y) / ((windowHeight * 0.4) / 10)
      this.height = e.detail.y + windowHeight * 0.1
    },
    touchend() {
      if (!this.move) {
        return
      }
      this.startMove = false
      this.move = false
      this.moveToLocation()
    },
    moveToLocation() {
      this.map.moveToLocation({
        ...this.location,
        complete(res) {

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
    keyboardInput(filed) {
      if (this.windows) {
        return
      }
      this.topInputShow = filed
      const windowHeight = this.$store.state.systemInfo.systemInfo.windowHeight
      this.height = windowHeight - 100
      this.scale = 16
      this.moveToLocation()
    },
    keyboardInputOk() {
      const windowHeight = this.$store.state.systemInfo.systemInfo.windowHeight
      this.topInputShow = false
      this.height = windowHeight * 0.5
      this.scale = 16
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
  height: 130vh
}

.movableView {
  width: 100vw;
  height: 90vh;
  background-color: #fff;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
}

.myMap {
  width: 100vw;
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

.skuClassAdd {
  padding: 0 12px;
  max-height: calc(90vh - 33px);
  overflow: auto;

  .uni-forms-item {
    margin: 0;
    padding: 12px 0;
  }

  .uni-forms-item__label {
    font-size: 12px;
    color: #666666;
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

  .is-disabled {
    background-color: #fff !important;
    color: #000000 !important;
  }

  .is-input-border {
    border: none;
    border-bottom: 1px solid #EDEDED;
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

.grey {
  color: #999999;
}

.grey2 {
  color: #434343;
}

</style>
