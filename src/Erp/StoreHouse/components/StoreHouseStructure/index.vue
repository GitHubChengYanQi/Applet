<template>
  <view>
    <view class="StoreHouseStructure">
      <movable-area
          class="StoreHouseStructure-movableArea"
          :style="{
      height:`${childrenList.length * itemHeight + itemHeight + 20}px`,
      width: `${itemWidth * 3}px`,
      marginLeft:`-${itemWidth}px`,
    }"
      >
        <movable-view
            disabled
            direction="all"
            :damping="0"
            :animation="false"
            :x="movableViewX"
            :style="{
                width: `${itemWidth+10}px`,
                height:`${itemHeight}px`
                }"
        >
          <view class="storeItemContent" :style="{height:`${itemHeight - 1}px`}">
            <view class="deptIcon">
              <Icon icon="icon-cangkutubiao" size="55" />
            </view>
            <view class="itemTitle">
              <view> {{ storeHouseData.name }}</view>
            </view>
            <view class="drag" @longpress="moveStart(e,index)" :style="{height:`${itemHeight}px`}">
              <u-icon name="list" />
            </view>
          </view>
        </movable-view>
        <movable-view
            v-for="(item,index) in childrenList"
            :key="index"
            :damping="0"
            :out-of-bounds="true"
            :animation="false"
            :disabled="isMove !== index"
            :style="{
                top:`${itemHeight * index + itemHeight}px`,
                width: `${itemWidth}px`,
                height:`${itemHeight}px`,
                paddingLeft:'10px'
                }"
            :y="movableViewY"
            :x="movableViewX"
            direction="all"
            @change="(e)=>move(e,index)"
            @touchend="(e)=>moveEnd(e,index)"
            :class="{moveItem:isMove === index}"
        >
          <view class="moveLine" v-if="moveIndex === index" />
          <view class="storeItemContent" :style="{height:`${itemHeight - 1}px`}">
            <view class="deptIcon">
              <Icon icon="icon-cangkutubiao" size="55" />
            </view>
            <view class="itemTitle">
              <view>{{ item.name }}</view>
              <view class="itemOther">
                <view
                    v-if="isArray(item.objects).length > 0"
                    class="itemDescribe"
                    :style="{maxWidth:`calc(100vw - ${12 + 55 + 12 + 12 + 40 + 56 + 12}px)`}"
                >
                  {{ isArray(item.objects).join('、') }}
                </view>
                <view
                    v-if="classList.length > 0 && item.storehouseId === newStorehouseId"
                    class="itemDescribe"
                    :style="{maxWidth:`calc(100vw - ${12 + 55 + 12 + 12 + 40 + 56 + 12}px)`}"
                >
                  {{ classList.map(item => item.title).join('、') }}
                </view>
                <view class="bindClass">
                  <LinkButton
                      v-if="item.storehouseId !== newStorehouseId"
                      @click="bindClass(item)"
                  >
                    绑定分类
                  </LinkButton>
                  <LinkButton v-else @click="$emit('openClass')">绑定分类</LinkButton>
                </view>
              </view>
            </view>
            <view class="drag" @longpress="moveStart(e,index)" :style="{height:`${itemHeight}px`}">
              <u-icon name="list" />
            </view>
          </view>
          <view
              class="moveLine"
              v-if="moveIndex === childrenList.length && index === childrenList.length-1"
          />
        </movable-view>

        <view
            class="storeItemContent moveFixItem"
            v-if="isMove !== null"
            :style="{
                top:`${itemHeight * isMove + itemHeight}px`,
                left:`${itemWidth}px`,
                height:`${itemHeight}px`,
                width: `${itemWidth}px`,
                paddingLeft:'10px'
              }"
        >
          <view class="deptIcon">
            <Icon icon="icon-cangkutubiao" size="55" />
          </view>
          <view class="itemTitle">
            <view>{{ childrenList[isMove].name }}</view>
            <view class="itemOther">
              <view
                  v-if="isArray(childrenList[isMove].objects).length > 0"
                  class="itemDescribe"
                  :style="{maxWidth:`calc(100vw - ${12 + 55 + 12 + 12 + 40 + 56 + 12}px)`}"
              >
                {{ isArray(childrenList[isMove].objects).join('、') }}
              </view>
              <view
                  v-if="classList.length > 0 && childrenList[isMove].storehouseId === newStorehouseId"
                  class="itemDescribe"
                  :style="{maxWidth:`calc(100vw - ${12 + 55 + 12 + 12 + 40 + 56 + 12}px)`}"
              >
                {{ classList.map(item => item.title).join('、') }}
              </view>
            </view>
          </view>
        </view>
      </movable-area>
    </view>
    <Modal ref="modal" />
    <Loading :loading="getDetailLoading" />
  </view>
</template>


<script>
import {isArray} from "../../../../util/Tools";
import Icon from "../../../../components/Icon";
import MyButton from "../../../../components/MyButton";
import {Storehouse} from "MES-Apis/lib/Storehouse/promise";
import {Init} from "MES-Apis/lib/Init";
import Modal from "../../../../components/Modal";
import LinkButton from "../../../../components/LinkButton/index.vue";
import Loading from "../../../../components/Loading/index.vue";

export default {
  options: {
    styleIsolation: 'shared'
  },
  name: 'StoreHouseStructure',
  components: {Loading, LinkButton, Modal, MyButton, Icon},
  props: {
    storeHouseData: {
      default: _ => {
      }
    },
    current: {
      default: _ => {
      }
    },
    cateGoryData: Array,
    classList: Array,
    storehouseId: String,
  },
  watch: {
    storeHouseData(storeHouseData) {
      const list = storeHouseData.childrenList || []
      this.sorts = this.sorts.map(item => {
        const store = list.find(listItem => listItem.storehouseId === item.storehouseId)
        return store || item
      })
    }
  },
  created() {
    this.itemWidth = this.$store.state.systemInfo.systemInfo.windowWidth - 24 - 10
    this.movableViewX = this.itemWidth
    this.newStorehouseId = this.storehouseId || 'newStorehouseId'
    this.sorts = isArray(this.storeHouseData.childrenList)
  },
  computed: {
    childrenList() {
      if (this.sorts.length > 0) {
        if (this.sorts.find(item => item.storehouseId === this.newStorehouseId)) {
          return this.sorts.map(item => {
            if (item.storehouseId === this.newStorehouseId) {
              return {name: this.current.name, storehouseId: this.newStorehouseId}
            } else {
              return item
            }
          })
        } else if (this.current.name) {
          return [...this.sorts, {
            name: this.current.name,
            storehouseId: this.newStorehouseId
          }]
        } else {
          return this.sorts
        }
      }
      return this.current.name ? [{
        name: this.current.name,
        storehouseId: this.newStorehouseId
      }] : []
    }
  },
  data() {
    return {
      isArray,
      show: false,
      isMove: null,
      itemHeight: 68,
      itemWidth: 100,
      moveIndex: null,
      movableViewY: 0,
      movableViewX: 0,
      moveEndIndex: null,
      sorts: [],
      newStorehouseId: null,
      getDetailLoading: false,
    }
  },
  methods: {
    getCurrentSort() {
      const sort = this.childrenList.findIndex(item => item.storehouseId === this.newStorehouseId)

      if (sort > -1) {
        return this.childrenList.length - 1 - sort
      } else {
        return 0
      }

    },
    move(e, index) {
      if (!e.detail.source) {
        return
      }
      const y = e.detail.y
      let newY = 0
      if (y < this.itemHeight && y > -this.itemHeight) {
        newY = y
      } else {
        newY = y + newY
      }

      const moveIndex = parseInt(newY / this.itemHeight)
      let endIndex = (moveIndex + index)
      if (endIndex > this.childrenList.length - 1) {
        endIndex = this.childrenList.length - 1
      } else if (endIndex < 0) {
        endIndex = 0
      }
      this.moveEndIndex = endIndex
      if (moveIndex === 0) {
        this.moveIndex = null
      } else {
        this.moveIndex = (moveIndex > 0 ? endIndex + 1 : endIndex)
      }
      this.movableView = e.detail.y
    },
    moveStart(e, index) {
      this.isMove = index
    },
    moveEnd(e) {

      if (typeof this.isMove !== 'number') {
        return
      }
      const thisIndex = this.isMove
      this.isMove = null
      const y = this.movableView
      let newY = 0
      if (y < this.itemHeight && y > -this.itemHeight) {
        newY = 0
      } else {
        newY = y
      }
      let moveIndex = parseInt(newY / this.itemHeight)
      const moveItem = this.childrenList[thisIndex]
      this.$nextTick(function () {
        if (this.moveEndIndex !== null) {
          const childrenList = this.childrenList.map((item, index) => {
            if (moveIndex > 0) {
              if (index < this.moveEndIndex && index >= thisIndex) {
                return {...this.childrenList[index + 1]}
              } else if (index === this.moveEndIndex) {
                return {...this.childrenList[thisIndex]}
              }
            } else {
              if (index > this.moveEndIndex && index <= thisIndex) {
                return {...this.childrenList[index - 1]}
              } else if (index === this.moveEndIndex) {
                return {...this.childrenList[thisIndex]}
              }
            }
            return item
          })

          this.sorts = childrenList

          const sortList = []
          childrenList.forEach((item, index) => {
            if (item.storehouseId !== 'newStorehouseId') {
              sortList.push({
                storehouseId: item.storehouseId,
                sort: childrenList.length - 1 - index
              })
            }
          })

          if (sortList.length > 0) {
            Storehouse.storeHouseSortV2_0({
              data: {sortList}
            }).catch(() => {
              this.$refs.modal.dialog({
                title: Init.getNewErrorMessage() || '排序失败!'
              })
            })
          }


        }

        this.movableViewY = 1
        this.movableViewX = this.itemWidth - 0.1
        setTimeout(() => {
          this.movableViewY = 0
          this.movableViewX = this.itemWidth
        }, 0)

        this.$nextTick(function () {
          this.moveEndIndex = null
          this.moveIndex = null
        })


      })
    },
    async bindClass(item) {
      this.getDetailLoading = true
      const res = await Storehouse.storeHouseDetailV2_0({data: {storehouseId: item.storehouseId}}).catch(() => {
        this.getDetailLoading = false
      })
      this.getDetailLoading = false
      this.$emit('bindClass', {
        ...item,
        classList: isArray(res.data?.spuClassResults).map(item => ({key: item.spuClassificationId, title: item.name}))
      })
    },
  }
}
</script>

<style lang="scss">

.StoreHouseStructure-movableArea {
  background-color: #FFFFFF;
}

.storeItemContent {
  border-bottom: solid 1px #f5f5f5;
  display: flex;
  align-items: center;
  gap: 12px;

  .itemTitle {
    flex-grow: 1;

    .itemDescribe {
      padding-right: 12px;
      font-size: 12px;
      color: #808080;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .itemOther {
      display: flex;
      align-items: center;

      .bindClass {

        .linkButton {

          > button {
            font-size: 14px !important;
          }
        }
      }
    }
  }


  .deptIcon {
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.storeChildren {
  padding-left: 10px;
}


.moveFixItem {
  opacity: 0.3;
  position: absolute;
  width: 100%;
}

.moveItem {
  opacity: 0.5;
  background-color: #fff;
  box-shadow: 0 1px 10px rgba(34, 33, 81, 0.15);
  z-index: 1;
}

.moveLine {
  height: 1px;
  background-color: rgba(0, 122, 255, 0.50);
  position: fixed;
  width: 100%;
}

.drag {
  padding: 0 12px;
  display: flex;
}
</style>
