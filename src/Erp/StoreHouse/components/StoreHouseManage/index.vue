<template>
  <view v-else class="selectUser">
    <uni-swipe-action ref="uni-swipe-action">
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
          :style="{height: `calc(100vh - ${(47+safeAreaHeight(this,8))}px - 36px)`}"
      >
        <movable-area
            class="movableArea"
            :style="{
      height:`${storeHouseList.length * itemHeight + (storeHousePage.length > 1 ? (20 + itemHeight) : 20)}px`,
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
              @click="!sys && isMove===null &&  $emit('storeHousePageClick',storeHousePage[storeHousePage.length - 2])"
          >
            <view class="item" :style="{height:`${itemHeight - 1}px`}">
              <view class="deptIcon">
                <Icon icon="icon-fanhui" size="20" />
              </view>
              <view class="backDept">返回上级仓库</view>
            </view>
          </movable-view>

          <Empty
              :style="{paddingTop:`${itemHeight}px`}"
              v-if="storeHouseList.length === 0"
              description="暂无数据"
          />

          <movable-view
              v-for="(item,index) in storeHouseList"
              :key="index"
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
            <Swipe
                :disabled="!admin || isMove !== null"
                @click="(key)=>swipeClick(key,item)"
            >
              <view class="moveLine" v-if="inIndex === null && moveIndex === index" />
              <view
                  class="item"
                  :style="{height:`${itemHeight - 1}px`}"
                  @click="sys ? $emit('onCheckList',item) :(isMove===null && $emit('onCheckStoreHouse',item))"
              >
                <Check
                    :disabled="item.number > 0"
                    v-if="sys"
                    :value="checkList.find(checkItem=>checkItem.key === item.key)"
                />
                <view class="deptIcon">
                  <Icon icon="icon-cangkutubiao" size="55" />
                </view>
                <view class="itemTitle">
                  <view>{{ item.title }}</view>
                  <view class="itemOther">
                    <view
                        v-if="isArray(item.objects).length > 0"
                        class="itemDescribe"
                        :style="{maxWidth:`calc(100vw - ${12 + 55 + 12 + 12 + (admin ? 40 : 0) + ((sys || !admin) ? 0 : 56) + 12 + (sys ? (24 + 12) : 0)}px)`}"
                    >
                      {{ isArray(item.objects).join('、') }}
                    </view>
                    <view v-if="admin && !sys" class="bindClass" @click.stop="bindClass($event,item)">
                      <LinkButton>绑定分类</LinkButton>
                    </view>
                  </view>
                </view>
                <view v-if="admin && !sys" class="drag" @longpress="moveStart(e,index)">
                  <u-icon name="list" />
                </view>
              </view>
              <view
                  class="moveLine"
                  style="bottom: 0"
                  v-if="inIndex === null  && moveIndex === storeHouseList.length && index === storeHouseList.length-1"
              />
            </Swipe>
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
              <Icon icon="icon-cangkutubiao" size="55" />
            </view>
            {{ storeHouseList[isMove].title }}
          </view>
        </movable-area>


      </view>
    </uni-swipe-action>

    <Loading :loading="getDetailLoading" />

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
import {addStoreHouseChildren, delStoreHouseChildren, sortStoreHouseChildren} from "../../index";
import Swipe from "../../../../components/Swipe/index.vue";
import Loading from "../../../../components/Loading/index.vue";
import SkuItem from "../../../../components/SkuItem/index.vue";
import LinkButton from "../../../../components/LinkButton/index.vue";
import Check from "../../../../components/Check/index.vue";

export default {
  options: {
    styleIsolation: 'shared'
  },
  name: 'StoreHouseManage',
  components: {Check, LinkButton, SkuItem, Loading, Swipe, Modal, Icon, Empty},
  props: [
    'storeHousePage',
    'storeHouseList',
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
      getDetailLoading: false
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
      this.$refs["uni-swipe-action"].closeAll()
      this.isMove = index
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
      const moveItem = findThisInTree(this.storeHouseList[thisIndex].key, this.tree) || {}
      this.$nextTick(function () {
        if (this.inIndex !== null) {
          const inIndex = this.inIndex
          const inStoreHouse = this.storeHouseList[this.inIndex]
          this.listChange(this.storeHouseList)
          const _this = this
          const top = _this.storeHousePage[_this.storeHousePage.length - 2]
          this.$refs.modal.dialog({
            title: '确认要把' + moveItem.title + '移动到' + (inStoreHouse ? inStoreHouse.title + '下级' : top.name) + '吗？',
            only: false,
            onConfirm() {
              return new Promise(async (resolve) => {
                Storehouse.storeHouseEditV2_0({
                  data: {
                    storehouseId: moveItem.key,
                    pid: inStoreHouse ? inStoreHouse.key : top.key
                  }
                }).then(() => {
                  let newTree
                  const tree = delStoreHouseChildren(moveItem.key, _this.tree)
                  if (inIndex === -1) {
                    const storeHouseKey = _this.storeHousePage[_this.storeHousePage.length - 2].key
                    if (storeHouseKey === '0') {
                      newTree = [...tree, moveItem]
                    } else {
                      newTree = addStoreHouseChildren(storeHouseKey, moveItem, tree)
                    }
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
            this.$emit('treeChange', sortStoreHouseChildren(thisKey, storeHouseList, this.tree))
          }

          Storehouse.storeHouseSortV2_0({
            data: {
              sortList: storeHouseList.map((item, index) => ({
                storehouseId: item.key,
                sort: storeHouseList.length - 1 - index
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
    skuClassSwipeClick(key, item) {
      switch (key) {
        case 'delete':
          this.$emit('onDelete', {name: item.title, key: item.key})
          break;
        case 'edit':
          break
      }
    },
    async bindClass(event, item) {
      this.getDetailLoading = true
      const res = await Storehouse.storeHouseDetailV2_0({data: {storehouseId: item.key}}).catch(() => {
        this.getDetailLoading = false
      })
      this.getDetailLoading = false
      this.$emit('bindClass', {
        ...item,
        classList: isArray(res.data?.spuClassResults).map(item => ({key: item.spuClassificationId, title: item.name}))
      })
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
