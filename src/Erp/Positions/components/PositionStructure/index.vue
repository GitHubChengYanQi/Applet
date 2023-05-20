<template>
  <view>
    <view class="positionStructure">
      <movable-area
          class="positionStructure-movableArea"
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
          <view class="storeItem">
            <Icon icon="icon-pandiankuwei1" size="20" />
            {{ positionData.title }}
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
          <view class="storeItem">
            <view class="storeItemContent">
              <Icon icon="icon-pandiankuwei1" size="20" />
              <view class="positionStructure-title">
                {{ item.title }}
              </view>
              <view class="actionButtons" v-if="item.key === newPositionId">
                <MyButton
                    plain
                    type="primary"
                    @click="$emit('authShow')"
                >
                  设置权限
                </MyButton>
                <MyButton
                    plain
                    type="primary"
                    @click="$emit('goToBindSku')"
                >
                  绑定物料
                </MyButton>
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
            class="moveFixItem"
            v-if="isMove !== null"
            :style="{
                top:`${itemHeight * isMove + itemHeight}px`,
                left:`${itemWidth}px`,
                height:`${itemHeight}px`,
                width: `${itemWidth}px`,
                paddingLeft:'10px'
              }"
        >
          <view class="storeItem">
            <Icon icon="icon-pandiankuwei1" size="20" />
            {{ childrenList[isMove].title }}
          </view>
        </view>
      </movable-area>
    </view>

    <Modal ref="modal" />
  </view>
</template>


<script>
import {isArray} from "../../../../util/Tools";
import Icon from "../../../../components/Icon";
import MyButton from "../../../../components/MyButton";
import {Storehouse} from "MES-Apis/lib/Storehouse/promise";
import {Init} from "MES-Apis/lib/Init";
import Modal from "../../../../components/Modal";

export default {
  name: 'PositionStructure',
  components: {Modal, MyButton, Icon},
  props: {
    positionData: {
      default: _ => {
      }
    },
    current: {
      default: _ => {
      }
    },
    cateGoryData: Array,
    classList: Array,
    positionId: String,
    store: String,
  },
  created() {
    this.itemWidth = this.$store.state.systemInfo.systemInfo.windowWidth - 24 - 24 - 10
    this.movableViewX = this.itemWidth
    this.newPositionId = this.positionId || 'newPositionId'
    this.sorts = isArray(this.positionData.children)
  },
  computed: {
    childrenList() {
      if (this.sorts.length > 0) {
        if (this.sorts.find(item => item.key === this.newPositionId)) {
          return this.sorts.map(item => {
            if (item.key === this.newPositionId) {
              return {title: this.current.name, key: this.newPositionId}
            } else {
              return item
            }
          })
        } else if (this.current.name) {
          return [...this.sorts, {
            title: this.current.name,
            key: this.newPositionId
          }]
        } else {
          return this.sorts
        }
      }
      return this.current.name ? [{
        title: this.current.name,
        key: this.newPositionId
      }] : []
    }
  },
  data() {
    return {
      isArray,
      show: false,
      isMove: null,
      itemHeight: 54,
      itemWidth: 100,
      moveIndex: null,
      movableViewY: 0,
      movableViewX: 0,
      moveEndIndex: null,
      sorts: [],
      newPositionId: null
    }
  },
  methods: {
    getCurrentSort() {
      const sort = this.childrenList.findIndex(item => item.key === this.newPositionId)
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
            if (item.key !== 'newPositionId') {
              sortList.push({
                storehousePositionsId: item.key,
                sort: childrenList.length - index
              })
            }
          })

          if (sortList.length > 0) {
            Storehouse.positionsSortV2_0({
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
    }
  }
}
</script>

<style lang="scss">

.StoreHouseStructure-movableArea {
  background-color: #FFFFFF;
}

.storeItem {
  //padding: 12px 0;
  height: 54px;
  border-bottom: 1px solid #EDEDED;
  display: flex;
  align-items: center;
  gap: 8px;

  .storeItemContent {
    flex-grow: 1;
    display: flex;
    align-items: center;
    gap: 8px;
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

.actionButtons {
  display: flex;
  align-items: center;
  gap: 4px;
  min-width: 180px;
}

.positionStructure-title {
  max-width: calc(100vw - 24px - 10px - 20px - 180px - 40px - 8px)
}
</style>
