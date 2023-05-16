<template>
  <view v-else class="selectUser">
    <view class="header">
      <uni-breadcrumb separator="/">
        <uni-breadcrumb-item v-for="(route,index) in storeHousePage" :key="index">
          <view @click="$emit('storeHousePageClick',route)">
            {{ route.name }}
          </view>
        </uni-breadcrumb-item>
      </uni-breadcrumb>
    </view>
    <view
        class="users"
        :style="{height: `calc(100vh - ${47+safeAreaHeight(this,8)}px - 36px)`}"
    >
      <movable-area
          class="movableArea"
          :style="{
      height:`${storeHouseList.length * itemHeight + (storeHousePage.length > 1 ? 68 : 20)}px`,
      width: `${itemWidth * 3}px`,
      marginLeft:`-${itemWidth}px`,
    }"
      >
        <movable-view
            v-if="storeHousePage.length > 1"
            direction="all"
            :x="movableViewX"
            :style="{ width: `${itemWidth}px`,height:`${itemHeight}px`}"
            :class="{movableView:true,inItem:inIndex === -1}"
            :disabled="true"
            @click="$emit('storeHousePageClick',storeHousePage[storeHousePage.length - 2])"
        >
          <view class="item">
            <view class="deptIcon">
              <Icon icon="icon-fanhui" size="20" />
            </view>
            <view class="backDept">返回上级仓库</view>
          </view>
        </movable-view>

        <Empty
            v-if="storeHouseList.length === 0"
            description="暂无数据"
        />

        <movable-view
            v-for="(item,index) in storeHouseList"
            :key="index"
            @click="$emit('onCheckStoreHouse',item)"
            :damping="0"
            :out-of-bounds="true"
            :animation="false"
            :disabled="isMove !== index"
            :style="{
                top:`${itemHeight * index+(storeHousePage.length > 1 ? 0 : 10)}px`,
                width: `${itemWidth}px`,
                height:`${itemHeight}px`
                }"
            :y="movableViewY"
            :x="movableViewX"
            direction="all"
            @change="(e)=>move(e,index)"
            @touchend="(e)=>moveEnd(e,index)"
            :class="{movableView:true,inItem:inIndex === index,moveItem:isMove === index}"
        >
          <view class="moveLine" v-if="inIndex === null && moveIndex === index" />
          <view class="item">
            <view class="deptIcon">
              <Icon icon="icon-cangkuguanli1" size="30" />
            </view>
            <view class="itemTitle">
              {{ item.title }}
            </view>
            <view v-if="admin" class="drag" @longpress="moveStart(e,index)">
              <u-icon name="list" />
            </view>
          </view>
          <view
              class="moveLine"
              v-if="inIndex === null  && moveIndex === storeHouseList.length && index === storeHouseList.length-1"
          />
        </movable-view>

        <view
            class="item moveFixItem" v-if="isMove !== null"
            :style="{
                top:`${itemHeight * isMove + (storeHousePage.length > 1 ? itemHeight : 10)}px`,
                left:`${itemWidth}px`,
                height:`${itemHeight}px`
              }"
        >
          <view class="deptIcon" style="margin-left:0">
            <Icon icon="icon-cangkuguanli1" size="30" />
          </view>
          {{ storeHouseList[isMove].title }}
        </view>
      </movable-area>


    </view>

    <Modal ref="modal" />
  </view>
</template>

<script>
import {safeAreaHeight} from "../../../../util/Tools";
import Empty from "../../../../components/Empty";
import Icon from "../../../../components/Icon";
import {Init} from "MES-Apis/lib/Init";
import {Storehouse} from "MES-Apis/lib/Storehouse/promise";
import Modal from "../../../../components/Modal";
import {addStoreHouseChildren, delStoreHouseChildren, sortStoreHouseChildren} from "../../index";

export default {
  name: 'StoreHouseManage',
  components: {Modal, Icon, Empty},
  props: [
    'storeHousePage',
    'storeHouseList',
    'itemWidth',
    'movableViewY',
    'movableViewX',
    'admin',
  ],
  data() {
    return {
      safeAreaHeight,
      isMove: null,
      itemHeight: 48,
      moveIndex: null,
      inIndex: null,
    }
  },
  methods: {
    move(e, index) {
      if (!e.detail.source) {
        return
      }
      const y = this.storeHousePage.length > 1 ? e.detail.y - this.itemHeight : e.detail.y
      let newY = 0
      if (y < this.itemHeight && y > -this.itemHeight) {
        newY = y
      } else {
        newY = y + newY
      }

      const moveIndex = parseInt(newY / this.itemHeight)
      let endIndex = (moveIndex + index)
      if (endIndex > this.storeHouseList.length - 1) {
        endIndex = this.storeHouseList.length - 1
      } else if (endIndex < 0) {
        endIndex = 0
      }
      this.moveEndIndex = endIndex
      if (moveIndex === 0) {
        this.moveIndex = null
      } else {
        this.moveIndex = (moveIndex > 0 ? endIndex + 1 : endIndex)
      }

      const box = y % this.itemHeight
      const yu = newY % this.itemHeight
      const other = yu > 0 ? (yu > (this.itemHeight - 10) && yu < (this.itemHeight + 10)) : (yu < -(this.itemHeight - 10) && yu > -(this.itemHeight + 10))
      const inMoveIndex = parseInt(newY / this.itemHeight) + (other ? (yu > 0 ? 1 : -1) : 0)
      const inIndex = (inMoveIndex + index)
      if (inMoveIndex > 0) {
        if (box < 10) {
          if (e.detail.source === 'touch-out-of-bounds') {
            this.inIndex = null
          } else {
            this.inIndex = inIndex
          }
        } else if (box > this.itemHeight - 10) {
          this.inIndex = inIndex
        } else {
          this.inIndex = null
        }
      } else if (inMoveIndex < 0) {
        if (box > -10) {
          this.inIndex = inIndex
        } else if (box < -this.itemHeight + 10) {
          this.inIndex = inIndex
        } else {
          this.inIndex = null
        }
      } else {
        this.inIndex = null
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
      const moveItem = this.storeHouseList[thisIndex]
      this.$nextTick(function () {
        if (this.inIndex !== null) {
          const inStoreHouse = this.storeHouseList[this.inIndex]
          this.listChange(this.storeHouseList)
          const _this = this
          const top = _this.storeHousePage[_this.storeHousePage.length - 2]
          this.$refs.modal.dialog({
            title: '确认要把' + moveItem.title + '移动到' + (inStoreHouse ? inStoreHouse.title + '下级' : top.name) + '吗？',
            onConfirm() {
              return new Promise(async (resolve) => {
                Storehouse.storeHouseEditV2_0({
                  data: {
                    storehouseId: moveItem.key,
                    pid: inStoreHouse ? inStoreHouse.key : top.key
                  }
                }).then(() => {
                  let newTree
                  const tree = delStoreHouseChildren(moveItem.key, _this.deptTree)
                  if (_this.inIndex === -1) {
                    const deptKey = _this.storeHousePage[_this.storeHousePage.length - 2].key
                    newTree = addStoreHouseChildren(deptKey, moveItem, tree)
                  } else {
                    newTree = addStoreHouseChildren(inStoreHouse ? inStoreHouse.key : top.key, moveItem, tree)
                  }
                  _this.listChange(_this.storeHouseList.filter((item, index) => index !== thisIndex))
                  _this.$emit('treeChange', newTree)
                  resolve(true)
                }).catch(() => {
                  resolve(true)
                  _this.$refs.modal.dialog({
                    title: Init.getNewErrorMessage() || '移动失败！'
                  })
                })
              })
            }
          })
          this.moveActionData = {...this.storeHouseList[thisIndex], thisIndex, inIndex: this.inIndex}
        } else if (this.moveEndIndex !== null) {
          const storeHouseList = this.storeHouseList.map((item, index) => {
            if (moveIndex > 0) {
              if (index < this.moveEndIndex && index >= thisIndex) {
                return {...this.storeHouseList[index + 1]}
              } else if (index === this.moveEndIndex) {
                return {...this.storeHouseList[thisIndex]}
              }
            } else {
              if (index > this.moveEndIndex && index <= thisIndex) {
                return {...this.storeHouseList[index - 1]}
              } else if (index === this.moveEndIndex) {
                return {...this.storeHouseList[thisIndex]}
              }
            }
            return item
          })
          this.listChange(storeHouseList)
          const thisKey = this.storeHousePage[this.storeHousePage.length - 1].key
          if (thisKey === '0') {
            this.$emit('treeChange', storeHouseList)
          } else {
            this.$emit('treeChange', sortStoreHouseChildren(thisKey, storeHouseList, this.deptTree))
          }

            Storehouse.storeHouseSortV2_0({
              data: {
                sortList: storeHouseList.map((item, index) => ({
                  storehouseId: item.key,
                  sort: storeHouseList.length - index
                }))
              }
            }).catch(() => {
              this.$refs.modal.dialog({
                title: Init.getNewErrorMessage() || '排序失败!'
              })
            })
        }

        this.$nextTick(function () {
          this.moveEndIndex = null
          this.moveIndex = null
          this.inIndex = null
        })


      })
    },
    listChange(list) {
      this.$emit('listChange', list)
      // this.resetSkuMove()
    },
  }
}
</script>

<style lang="scss">
.drag {
  height: 47px;
  display: flex;
  align-items: center;
  padding: 0 24px 0;
}

.moveLine {
  height: 1px;
  background-color: rgba(0, 122, 255, 0.50);
  position: fixed;
  width: 100%;
}

.moveItem {
  opacity: 0.5;
  background-color: #f5f5f5;
}

.inItem {
  background-color: rgba(0, 122, 255, 0.50);
}

.moveFixItem {
  opacity: 0.3;
  position: absolute;
  width: 100%;
}

</style>
