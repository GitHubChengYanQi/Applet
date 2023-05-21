<template>
  <view v-else class="selectUser">
    <view class="header">
      <uni-breadcrumb separator="/">
        <uni-breadcrumb-item v-for="(route,index) in page" :key="index">
          <view @click="$emit('pageClick',route)">
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
      height:`${list.length * itemHeight + (page.length > 1 ? 68 : 20)}px`,
      width: `${itemWidth * 3}px`,
      marginLeft:`-${itemWidth}px`,
    }"
      >
        <movable-view
            v-if="page.length > 1"
            direction="all"
            :x="movableViewX"
            :style="{ width: `${itemWidth}px`,height:`${itemHeight}px`}"
            :class="{movableView:true,inItem:inIndex === -1}"
            :disabled="true"
            @click="$emit('pageClick',page[page.length - 2])"
        >
          <view class="item">
            <view class="deptIcon">
              <Icon icon="icon-fanhui" size="20" />
            </view>
            <view class="backDept">返回上级仓库</view>
          </view>
        </movable-view>

        <Empty
            :style="{paddingTop:`${itemHeight}px`}"
            v-if="list.length === 0"
            description="暂无数据"
        />

        <movable-view
            v-for="(item,index) in list"
            :key="index"
            @click="$emit('onCheck',item)"
            :damping="0"
            :out-of-bounds="true"
            :animation="false"
            :disabled="isMove !== index"
            :style="{
                top:`${itemHeight * index+(page.length > 1 ? 0 : 10)}px`,
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
              <Icon icon="icon-pandiankuwei1" size="30" />
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
              v-if="inIndex === null  && moveIndex === list.length && index === list.length-1"
          />
        </movable-view>

        <view
            class="item moveFixItem" v-if="isMove !== null"
            :style="{
                top:`${itemHeight * isMove + (page.length > 1 ? itemHeight : 10)}px`,
                left:`${itemWidth}px`,
                height:`${itemHeight}px`
              }"
        >
          <view class="deptIcon" style="margin-left:0">
            <Icon icon="icon-pandiankuwei1" size="30" />
          </view>
          {{ list[isMove].title }}
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
import {addChildren, delChildren, sortChildren} from "../../index";

export default {
  name: 'PositionManage',
  components: {Modal, Icon, Empty},
  props: [
    'page',
    'list',
    'itemWidth',
    'movableViewY',
    'movableViewX',
    'admin',
    'tree'
  ],
  data() {
    return {
      safeAreaHeight,
      isMove: null,
      itemHeight: 48,
      moveIndex: null,
      inIndex: null,
      startDrag: false
    }
  },
  methods: {
    showStatus() {
      return this.$refs.modal.showStatus();
    },
    close() {
      return this.$refs.modal.close();
    },
    move(e, index) {
      if (!e.detail.source) {
        return
      }
      const y = this.page.length > 1 ? e.detail.y - this.itemHeight : e.detail.y
      let newY = 0
      if (y < this.itemHeight && y > -this.itemHeight) {
        newY = y
      } else {
        newY = y + newY
      }

      const moveIndex = parseInt(newY / this.itemHeight)
      let endIndex = (moveIndex + index)
      if (endIndex > this.list.length - 1) {
        endIndex = this.list.length - 1
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
      this.startDrag = true
      setTimeout(() => {
        this.startDrag = false
      }, 500)
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
      const moveItem = this.list[thisIndex]
      this.$nextTick(function () {
        if (this.inIndex !== null) {
          const inIndex = this.inIndex
          const inItem = this.list[this.inIndex]
          this.listChange(this.list)
          const _this = this
          const top = _this.page[_this.page.length - 2]
          this.$refs.modal.dialog({
            title: '确认要把' + moveItem.title + '移动到' + (inItem ? inItem.title + '下级' : top.name) + '吗？',
            only: false,
            onConfirm() {
              return new Promise(async (resolve) => {
                Storehouse.positionsEdit({
                  data: {
                    storehousePositionsId: moveItem.key,
                    pid: inItem ? inItem.key : top.key
                  }
                }).then(() => {
                  let newTree
                  const tree = delChildren(moveItem.key, _this.tree)
                  if (inIndex === -1) {
                    const Key = _this.page[_this.page.length - 2].key
                    if (Key === '0') {
                      newTree = [...tree, moveItem]
                    } else {
                      newTree = addChildren(Key, moveItem, tree)
                    }
                  } else {
                    newTree = addChildren(inItem ? inItem.key : top.key, moveItem, tree)
                  }
                  _this.listChange(_this.list.filter((item, index) => index !== thisIndex))
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
        } else if (this.moveEndIndex !== null) {
          const list = this.list.map((item, index) => {
            if (moveIndex > 0) {
              if (index < this.moveEndIndex && index >= thisIndex) {
                return {...this.list[index + 1]}
              } else if (index === this.moveEndIndex) {
                return {...this.list[thisIndex]}
              }
            } else {
              if (index > this.moveEndIndex && index <= thisIndex) {
                return {...this.list[index - 1]}
              } else if (index === this.moveEndIndex) {
                return {...this.list[thisIndex]}
              }
            }
            return item
          })
          this.listChange(list)
          const thisKey = this.page[this.page.length - 1].key
          if (thisKey === '0') {
            this.$emit('treeChange', list)
          } else {
            this.$emit('treeChange', sortChildren(thisKey, list, this.tree))
          }

          Storehouse.positionsSortV2_0({
            data: {
              sortList: list.map((item, index) => ({
                storehousePositionsId: item.key,
                sort: list.length - 1 - index
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

.startDrag {
  animation: startDrag .5s ease-in-out infinite;
  //animation-iteration-count: 1;
}


@keyframes startDrag {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 0.5;
  }
}

.moveLine {
  height: 1px;
  background-color: rgba(0, 122, 255, 0.50);
  position: fixed;
  width: 100%;
}

.moveItem {
  opacity: 0.5;
  background-color: #fff;
  box-shadow: 0 1px 10px rgba(34, 33, 81, 0.15);
  z-index: 1;
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
