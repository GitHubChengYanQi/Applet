<template>
  <view v-else class="selectUser">
    <uni-swipe-action ref="uni-swipe-action">
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
          :style="{height: `calc(100vh - ${admin ? 47+safeAreaHeight(this,8) : 0}px - 36px)`}"
      >
        <movable-area
            class="movableArea"
            :style="{
      height:`${list.length * itemHeight + (page.length > 1 ? (20 + itemHeight) : 20)}px`,
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
              @click="!sys && isMove===null && $emit('pageClick',page[page.length - 2])"
          >
            <view class="item" :style="{height:`${itemHeight - 1}px`}">
              <view class="deptIcon">
                <Icon icon="icon-fanhui" size="20" />
              </view>
              <view class="backDept">返回上级库位</view>
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
            <Swipe
                :disabled="!admin || isMove !== null"
                @click="(key)=>swipeClick(key,item)"
            >
              <view class="moveLine" v-if="inIndex === null && moveIndex === index" />
              <view
                  class="item"
                  :style="{height:`${itemHeight - 1}px`}"
                  @click="sys ? $emit('onCheckList',item) :(isMove===null && $emit('onCheck',item))"
              >
                <Check
                    :disabled="item.number > 0"
                    v-if="sys"
                    :value="checkList.find(checkItem=>checkItem.key === item.key)"
                />
                <view class="deptIcon">
                  <Icon icon="icon-pandiankuwei1" size="55" />
                </view>
                <view class="itemTitle">
                  <view>{{ item.title }}</view>
                  <view class="itemOther" v-if="isArray(item.children).length === 0">
                    <view
                        v-if="isArray(item.object).length > 0"
                        class="itemDescribe"
                        :style="{maxWidth:`calc(100vw - ${12 + 55 + 12 + 12 + (admin ? 40 : 0) + ((sys || !admin) ? 0 : 56) + 12 + (sys ? (24 + 12) : 0)}px)`}"
                    >
                      {{ isArray(item.object).join('、') }}
                    </view>
                    <view v-if="admin && !sys" class="bindClass" @click.stop="bindSku($event,item)">
                      <LinkButton>绑定物料</LinkButton>
                    </view>
                  </view>
                </view>
                <view v-if="admin && !sys" class="drag" @longpress="moveStart(e,index)">
                  <u-icon name="list" />
                </view>
              </view>
              <view
                  style="bottom: 0"
                  class="moveLine"
                  v-if="inIndex === null  && moveIndex === list.length && index === list.length-1"
              />
            </Swipe>
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
              <Icon icon="icon-pandiankuwei1" size="55" />
            </view>
            {{ list[isMove].title }}
          </view>
        </movable-area>

      </view>
    </uni-swipe-action>

    <Modal ref="modal" />
  </view>
</template>

<script>
import {findThisInTree, isArray, safeAreaHeight} from "../../../../util/Tools";
import Empty from "../../../../components/Empty";
import Icon from "../../../../components/Icon";
import {Init} from "MES-Apis/lib/Init";
import {Storehouse} from "MES-Apis/lib/Storehouse/promise";
import Modal from "../../../../components/Modal";
import {addChildren, delChildren, sortChildren} from "../../index";
import Swipe from "../../../../components/Swipe/index.vue";
import Check from "../../../../components/Check/index.vue";
import SkuItem from "../../../../components/SkuItem/index.vue";
import Loading from "../../../../components/Loading/index.vue";
import {Message} from "../../../../components/Message";
import LinkButton from "../../../../components/LinkButton/index.vue";

export default {
  options: {
    styleIsolation: 'shared'
  },
  name: 'PositionManage',
  components: {LinkButton, Loading, SkuItem, Check, Swipe, Modal, Icon, Empty},
  props: [
    'page',
    'list',
    'itemWidth',
    'movableViewY',
    'movableViewX',
    'admin',
    'tree',
    'itemHeight',
    'checkList',
    'sys'
  ],
  data() {
    return {
      isArray,
      safeAreaHeight,
      isMove: null,
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
      this.$refs["uni-swipe-action"].closeAll()
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
      const y = this.movableView
      let newY = 0
      if (y < this.itemHeight && y > -this.itemHeight) {
        newY = 0
      } else {
        newY = y
      }
      let moveIndex = parseInt(newY / this.itemHeight)
      const moveItem = findThisInTree(this.list[thisIndex].key, this.tree)
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
          setTimeout(() => {
            this.isMove = null
          }, 0)
        })


      })
    },
    listChange(list) {
      this.$emit('listChange', list)
      // this.resetSkuMove()
    },
    swipeClick(key, item) {
      switch (key) {
        case 'delete':
          this.$emit('onDelete', {name: item.title, key: item.key})
          break;
        case 'edit':
          this.$emit('onEdit', {name: item.title, key: item.key})
          break
      }
    },
    skuSwipeClick(key, item) {
      switch (key) {
        case 'delete':
          const _this = this
          this.$refs.modal.dialog({
            title: '删除后不可恢复，确定删除绑定吗？',
            only: false,
            onConfirm() {
              return new Promise((resolve) => {
                Storehouse.positionsBindDelete({
                  data: {bindId: item.bindId}
                }).then(() => {
                  _this.skuList = _this.skuList.filter(listItem => listItem.bindId !== item.bindId)
                  resolve(true)
                }).catch(() => {
                  Message.errorToast('删除失败！')
                  resolve(false)
                })
              })
            }
          })
          break;
        case 'edit':

          break
      }
    },
    async bindSku(event, item) {
      this.$emit('bindSku', {name: item.title, key: item.key})
      event.stopPropagation();
    },
  }
}
</script>

<style lang="scss">
.drag {
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 12px 0;
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
