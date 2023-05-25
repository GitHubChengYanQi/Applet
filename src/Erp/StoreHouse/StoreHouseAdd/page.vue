<template>
  <view>
    <Loading skeleton-type="page" skeleton v-if="refreshLoading" />
    <scroll-view v-else class="storeHouseAdd">
      <view
          class="myMap"
          :style="{
        height:`${height + 20}px`
      }"
      >
        <map
            class="map"
            :scale="16"
            id="myMap"
            :longitude="location.longitude"
            :latitude="location.latitude"
            @regionchange="regionchange"
            @click="clickMap"
        />
        <view :class="{landmark:true,landmarkBounce}">
          <img :src="erp_map" alt="">
        </view>
      </view>

      <view class="selectPlace" v-if="topInputShow">
        <MyButton @click="keyboardInputOk">取消</MyButton>
        <MyButton
            v-if="$refs.storehouseKeybordInput && !$refs.storehouseKeybordInput.disabled()"
            color="#19be6b"
            @click="$refs.storehouseKeybordInput.ok()"
        >
          确定
        </MyButton>
      </view>

      <movable-area
          class="movableArea"
          :style="{top:`${top}vh`,height:`${(100 - top) + (50 - top)}vh`}"
      >
        <movable-view
            :animation="false"
            class="movableView"
            :disabled="moveY === 0 && startMove === false"
            :x="x"
            :y="y"
            :style="{height:`${100 - top}vh`}"
            direction="vertical"
            @change="change"
        >
          <view class="comment-container" @touchstart="touchstart(true)" @touchend="touchend">
            <view class="comment-header">
              <view class="comment-handler"></view>
            </view>
          </view>

          <StorehouseKeybordInput
              ref="storehouseKeybordInput"
              v-if="topInputShow"
              title="仓库地点"
              @close="keyboardInputOk"
              v-model="formData.palce"
              :selectList="searchPlacces"
              :noAutoFocus="!autoFocus"
              :searchPlaccesLoading="searchPlaccesLoading"
              @select="selectPlace"
              @selectAddress="selectAddress"
              @onTouchstart="touchstart"
              @onTouchend="touchend"
              :moveY="moveY"
              :top="top"
          />

          <scroll-view
              v-else
              :scroll-y="moveY === 0"
              class="storeHouseAddForm"
              :style="{
             maxHeight: `calc(${100 - top}vh - 33px - 60px - ${safeAreaHeight(this,)}px)`
          }"
              @touchstart="touchstart"
              @touchend="touchend"
          >
            <uni-forms
                ref="form"
                :model="formData"
                :rules="rules"
                validateTrigger="bind"
            >
              <FormItem
                  name="palce"
                  label="仓库地点"
                  required
              >
                <view
                    class="storePalce formItem"
                    @click="keyboardInput('palce')"
                    :style="{color:formData.palce ? '#000000' : '#999999'}"
                >
                  <u-icon name="map-fill" color="#257BDE" />
                  <view style="flex-grow: 1">
                    {{ formData.palce || '请输入仓库地点' }}
                  </view>
                </view>
              </FormItem>

              <FormItem
                  name="name"
                  label="仓库名称"
                  required
              >
                <view id="storeName" class="formItem" @click="onName">
                  <u--input
                      border="bottom"
                      v-model="formData.name"
                      placeholder="请输入仓库名称"
                      :adjustPosition="false"
                  />
                </view>
              </FormItem>

              <FormItem
                  name="description"
                  label="仓库描述"
              >
                <view id="storeDescribe" class="formItem" @click="onDescribe">
                  <u--input
                      border="bottom"
                      v-model="formData.description"
                      placeholder="请输入仓库描述"
                      :adjustPosition="false"
                  />
                </view>
              </FormItem>

              <FormItem
                  name="pid"
                  :label="pid ? '仓库结构' : '上级仓库'"
              >
                <StoreHouseStructure
                    :current="formData"
                    v-if="pid &&storeHouseData"
                    :storehouseId="storehouseId"
                    :storeHouseData="storeHouseData"
                    :classList="classList"
                    @openClass="classShow = true"
                    ref="storeHouseStructure"
                />
                <Tree v-else radio :data="isArray(storeHouseData)" :value="{key:formData.pid}" @input="onPStoreHouse" />
              </FormItem>

            </uni-forms>
          </scroll-view>
        </movable-view>
      </movable-area>

      <BottomButton
          v-if="!topInputShow"
          only
          text="保存"
          :loading="loading"
          @onClick="save"
      />

      <Popup
          z-index="99"
          :show="classShow"
          left-text="取消"
          right-text="确认"
          @close="classShow = false"
          @onLeft="classShow = false"
          @onRight="classShow = false"
          max-height="50vh"
      >
        <Loading skeleton v-if="categoryLoading" />
        <view v-else style="padding: 12px">
          <Tree icon="icon-gaojizujian" :data="cateGoryData" :value="classList" @input="onClassList" />
        </view>
      </Popup>

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
import StorehouseKeybordInput from "../components/StorehouseKeybordInput";
import {erp_map} from "../../../images/erp/map";
import BottomButton from "../../../components/BottomButton";
import StoreHouseStructure from "../components/StoreHouseStructure";
import FormItem from "../../../components/FormItem";

export default {
  options: {
    styleIsolation: 'shared'
  },
  props: ['storehouseId', 'pid'],
  components: {
    FormItem,
    StoreHouseStructure,
    BottomButton,
    StorehouseKeybordInput,
    Loading,
    Modal,
    MyButton,
    Elliptsis,
    Tree,
    Cascader,
    Popup
  },
  data() {
    return {
      safeAreaHeight,
      erp_map,
      refreshLoading: false,
      isArray,
      scale: 16,
      height: 100,
      top: 20,
      startMove: false,
      y: 0,
      scrollTop: 0,
      move: false,
      topInputShow: false,
      landmarkBounce: false,
      moveY: 0,
      map: {},
      location: {},
      formData: {pid: '0',},
      classList: [],
      markId: 0,
      time: null,
      cateGoryData: [],
      categoryLoading: false,
      storeHouseData: null,
      loading: false,
      classShow: false,
      windows: false,
      inputStoreName: false,
      inputStoreDescribe: false,
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
      searchPlaccesLoading: false
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
    this.y = windowHeight * ((50 - this.top) / 100)
    this.moveY = windowHeight * ((50 - this.top) / 100)
  },
  watch: {
    '$store.state.keyboard.keyboardHeight'(height) {

      if (!!this.topInputShow && height > 0) {
        const windowHeight = this.$store.state.systemInfo.systemInfo.windowHeight
        this.height = windowHeight * (this.top / 100)
        this.y = this.moveY
        setTimeout(() => {
          this.y = 0
        }, 0)
      }

      const query = uni.createSelectorQuery().in(this);
      query.select('#storeName').boundingClientRect((res) => {
        const windowHeight = this.$store.state.systemInfo.systemInfo.windowHeight
        if (res && this.inputStoreName && (windowHeight - res.top) < height) {
          this.inputStoreName = false
          this.y = this.moveY
          setTimeout(() => {
            // this.y = this.moveY - (height - (windowHeight - res.top)) - 40
            this.y = 0
          }, 0)
        }
      }).exec()

      query.select('#storeDescribe').boundingClientRect((res) => {
        const windowHeight = this.$store.state.systemInfo.systemInfo.windowHeight
        if (res && this.inputStoreDescribe && (windowHeight - res.top) < height) {
          this.inputStoreDescribe = false
          this.y = this.moveY
          setTimeout(() => {
            // this.y = this.moveY - (height - (windowHeight - res.top)) - 40
            this.y = 0
          }, 0)
        }
      }).exec()
    },
    'formData.palce'(value) {
      if (this.refreshLoading) {
        return
      }
      clearTimeout(this.time);
      this.time = setTimeout(() => {
        this.searchAddress(value)
      }, 500);
    },
    formData: {
      deep: true,
      handler(formData) {
        if (Object.keys(formData).length > 1) {
          uni.enableAlertBeforeUnload({
            message: '数据未提交，是否退出？',
            success: () => {
            }
          })
        } else {
          uni.disableAlertBeforeUnload()
        }
      }
    }
  },
  async mounted() {
    this.refreshLoading = true
    await this.getCateGory()
    await this.init()
  },
  methods: {
    searchAddress(value) {
      const _this = this
      this.searchPlaccesLoading = true
      wx.request({
        //地图WebserviceAPI驾车路线规划接口 请求路径及参数（具体使用方法请参考开发文档）
        url: `https://apis.map.qq.com/ws/place/v1/search?key=${process.env.VUE_APP_MAP_KEY}&keyword=${value}&boundary=nearby(${this.location.latitude},${this.location.longitude},1000,1)&orderby=_distance&page_size=20`,
        success(res) {
          _this.searchPlacces = isArray(res?.data?.data).map(item => ({
            ...item,
            title: item.title,
            describe: item.address
          }))
        },
        complete() {
          _this.searchPlaccesLoading = false
        }
      })
    },
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
          description: data.description
        }
        this.classList = isArray(data.spuClassResults).map(item => ({
          key: item.spuClassificationId,
          title: item.name
        }))
        if (!data.longitude) {
          const _this = this
          uni.getLocation({
            type: 'gcj02',
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
        uni.setNavigationBarTitle({title: '修改仓库'})
        await this.getDetail(this.storehouseId)
      } else {
        this.formData = {pid: this.pid || '0'}
        const _this = this
        uni.getLocation({
          type: 'gcj02',
          success(res) {
            console.log(res)
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
      const search = res.type === 'search'
      if ((res.type === 'end' && res.causedBy === "drag") || search) {
        if (!search) {
          this.location = res.detail.centerLocation
        }
        this.moveToLocation()
        const _this = this
        if (!search) {
          _this.keyboardInput('palce', true)
        }
        this.searchPlaccesLoading = true
        wx.request({
          //地图WebserviceAPI驾车路线规划接口 请求路径及参数（具体使用方法请参考开发文档）
          url: `https://apis.map.qq.com/ws/place/v1/explore?key=${process.env.VUE_APP_MAP_KEY}&boundary=nearby(${this.location.latitude},${this.location.longitude},1000,1)&orderby=_distance&page_size=20`,
          success(res) {
            _this.searchPlacces = isArray(res?.data?.data).map(item => ({
              ...item,
              title: item.title,
              describe: item.address
            }))
          },
          complete() {
            _this.searchPlaccesLoading = false
          }
        })
      }
    },
    clickMap() {
      const windowHeight = this.$store.state.systemInfo.systemInfo.windowHeight
      this.height = windowHeight * 0.5
      this.y = this.moveY
      setTimeout(() => {
        this.y = windowHeight * ((50 - this.top) / 100)
        this.moveY = windowHeight * ((50 - this.top) / 100)
      }, 0)
    },
    change(e) {
      // if (!this.startMove) {
      //   return
      // }
      this.move = true
      this.moveY = e.detail.y
      const windowHeight = this.$store.state.systemInfo.systemInfo.windowHeight
      this.height = e.detail.y + windowHeight * (this.top / 100)
    },
    touchstart(move) {
      this.startMove = true
    },
    touchend() {
      // if (!this.move) {
      //   return
      // }
      this.startMove = false
      this.move = false
    },
    moveToLocation() {
      this.landmarkBounce = true
      setTimeout(() => {
        this.landmarkBounce = false
      }, 500)
    },
    async getStoreHouseTree() {
      const response = await Storehouse.storeHouseTreeV2_0();
      const {
        data
      } = response;
      if (this.pid) {
        if (this.pid === '0') {
          this.storeHouseData = {key: '0', name: '顶级', childrenList: data}
        } else {
          this.storeHouseData = this.findStoreHouse(data || [], this.pid)
        }
      } else {
        this.storeHouseData = [{
          title: '顶级',
          key: '0',
          children: this.format(data || [])
        }];
      }

    },
    async getCateGory() {
      this.categoryLoading = true
      const response = await Sku.spuClassTreeView({data: {}});
      const {
        data
      } = response;
      this.cateGoryData = data || []
      this.categoryLoading = false
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
    findStoreHouse(data, key) {
      let storeHouse = null
      data.forEach(item => {
        if (item.storehouseId === key) {
          storeHouse = item
        } else {
          const childrenStoreHouse = this.findStoreHouse(item.childrenList || [], key, storeHouse);
          if (childrenStoreHouse) {
            storeHouse = childrenStoreHouse
          }
        }
      })
      return storeHouse
    },
    onName() {
      this.inputStoreName = true
    },
    onDescribe() {
      this.inputStoreDescribe = true
    },
    keyboardInput(filed, noAutoFocus) {
      this.autoFocus = !noAutoFocus
      // this.searchPlacces = []
      this.topInputShow = filed
      this.top = 20
      this.scrollTop = 0
      const windowHeight = this.$store.state.systemInfo.systemInfo.windowHeight
      this.height = windowHeight * 0.5
      this.y = this.moveY
      setTimeout(() => {
        this.y = windowHeight * ((50 - this.top) / 100)
        this.moveY = windowHeight * ((50 - this.top) / 100)
        if (!noAutoFocus) {
          if (this.formData.palce) {
            this.searchAddress(this.formData.palce)
          } else {
            this.regionchange({type: 'search'})
          }
        }
      }, 0)
    },
    keyboardInputOk() {
      const windowHeight = this.$store.state.systemInfo.systemInfo.windowHeight
      this.topInputShow = false
      this.scrollTop = 0
      this.height = windowHeight * 0.5
      this.y = this.moveY
      setTimeout(() => {
        this.y = windowHeight * ((50 - this.top) / 100)
        this.moveY = windowHeight * ((50 - this.top) / 100)
      }, 0)
    },
    selectPlace(address) {
      this.location = {
        longitude: address.location.lng,
        latitude: address.location.lat
      }
    },
    selectAddress(address) {
      if (address) {
        this.formData = {
          ...this.formData,
          palce: address.title
        }
        this.location = {
          longitude: address.location.lng,
          latitude: address.location.lat
        }
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
      this.classList = classList
    },
    save() {
      this.$refs.form.validate((err) => {
        if (!err) {
          this.loading = true
          const sort = this.$refs.storeHouseStructure.getCurrentSort()
          if (this.storehouseId) {
            Storehouse.storeHouseEditV2_0({
              data: {
                storehouseId: this.storehouseId,
                ...this.formData,
                ...this.location,
                spuClassIds: isArray(this.classList).map(item => item.key),
                sort
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
                  uni.disableAlertBeforeUnload()
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
              spuClassIds: isArray(this.classList).map(item => item.key),
              sort
            }
          }).then((res) => {
            uni.$emit('storeHouseAddSuccess', {
              pid: this.formData.pid,
              id: res.data,
              name: this.formData.name,
            })

            const _this = this
            this.$refs.modal.dialog({
              only: false,
              title: "添加成功！",
              confirmText: '继续添加',
              cancelText: '返回',
              onCancel() {
                uni.disableAlertBeforeUnload()
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
    animation-iteration-count: 1;
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
  overflow: auto;

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

.storePalce {
  display: flex;
  align-items: center;
  gap: 4px;
  border-bottom: solid 1px #dadbde;
  padding: 8px 0;

  .u-input {
    background-color: #fff !important;
  }
}

.selectPlace {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  top: 0;
  background-color: rgba(0, 0, 0, 0.3);
  box-shadow: 0 8px 20px 10px rgba(0, 0, 0, 0.3);
  width: calc(100vw - 24px);
  z-index: 1;
  padding: 12px 12px 0;
}

.formItem {
  width: calc(100% - 24px);
}

</style>
