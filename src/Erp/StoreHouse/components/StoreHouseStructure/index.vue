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
            :x="movableViewX"
            :style="{
                width: `${itemWidth+10}px`,
                height:`${itemHeight}px`
                }"
        >
          <view class="storeItem">
            <Icon icon="icon-cangkutubiao" size="20" />
            {{ storeHouseData.name }}
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
              <Icon icon="icon-cangkutubiao" size="20" />
              {{ item.name }}
              <MyButton
                  v-if="item.storehouseId === newStorehouseId"
                  plain
                  type="primary"
                  @click="$emit('openClass')"
              >
                绑定物料分类
              </MyButton>
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
            <Icon icon="icon-cangkutubiao" size="20" />
            {{ childrenList[isMove].name }}
          </view>
        </view>
      </movable-area>
    </view>

  </view>
</template>


<script>
import {isArray} from "../../../../util/Tools";
import Icon from "../../../../components/Icon";
import MyButton from "../../../../components/MyButton";
import {Storehouse} from "MES-Apis/lib/Storehouse/promise";
import {Init} from "MES-Apis/lib/Init";

export default {
  name: 'StoreHouseStructure',
  components: {MyButton, Icon},
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
      newStorehouseId: null
    }
  },
  methods: {
    getCurrentSort() {
      const sort = this.childrenList.findIndex(item => item.storehouseId === this.newStorehouseId)

      if (sort) {
        return this.childrenList.length - sort
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
    moveEnd(e, thisIndex) {

      if (typeof this.isMove !== 'number') {
        return
      }
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
                sort: childrenList.length - index
              })
            }
          })

          Storehouse.storeHouseSortV2_0({
            data: {sortList}
          }).catch(() => {
            this.$refs.modal.dialog({
              title: Init.getNewErrorMessage() || '排序失败!'
            })
          })

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
  background-color: #f5f5f5;
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
