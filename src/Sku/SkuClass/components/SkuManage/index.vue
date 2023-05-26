<template>
  <view>
    <uni-swipe-action ref="uni-swipe-action">
      <view class="header" v-if="skuIsMove === null">
        <uni-breadcrumb separator="/">
          <uni-breadcrumb-item v-for="(route,index) in skuClassPage" :key="index">
            <view @click="$emit('skuClassPageClick',route)">
              {{ route.name }}
            </view>
          </uni-breadcrumb-item>
        </uni-breadcrumb>
      </view>
      <List
          :disabled="isMove !== null || skuIsMove !== null"
          @request="requestSkuList"
          :list="skuList"
          no-empty
          :default-limit="20"
          @onLoading="(newLoading)=> skuListLoading = newLoading"
          ref="skuList"
          @listSource="skuListSource"
          :height="`calc(100vh - ${47+safeAreaHeight(this,8)}px - ${skuIsMove === null ?36:0}px)`"
          width="100%"
          :default-params="{categoryId:'0'}"
      >
        <view style="margin-left:-12px" class="header" v-if="skuIsMove !== null">
          <uni-breadcrumb separator="/">
            <uni-breadcrumb-item v-for="(route,index) in skuClassPage" :key="index">
              <view @click="$emit('skuClassPageClick',route)">
                {{ route.name }}
              </view>
            </uni-breadcrumb-item>
          </uni-breadcrumb>
        </view>
        <view
            v-if="skuIsMove !== null"
            class="moveSkuBox"
        >
          <view class="make"></view>
          <u-transition mode="fade" :show="skuIsMove !== null" :duration="500">
            <view :class="{removeSku:true,startRemoveSku:removeSku}">
              <u-icon name="trash" :color="removeSku ? 'red' : '#fff'" size="28" />
            </view>
            <view class="moveSkuBoxSkuClass">
              <view
                  v-if="skuClassPage.length > 1"
                  :class="{item:true,skuMove:skuMoveIndex === 0}"
                  :style="{border:skuClassList.length ===0 && 'none'}"
              >
                <view class="deptIcon">
                  <Icon icon="icon-gaojizujian" size="20" />
                </view>
                <view class="itemTitle">
                  {{
                    skuClassPage[skuClassPage.length - 2].key !== '0' ? skuClassPage[skuClassPage.length - 2].name : '顶级'
                  }}
                </view>
              </view>
              <view
                  v-for="(item,index) in skuClassList"
                  :key="index"
              >
                <view
                    :class="{item:true,skuMove:skuMoveIndex === (skuClassPage.length > 1 ? index + 1 : index)}"
                    :style="{border:index === skuClassList.length - 1 && 'none'}"
                >
                  <view class="deptIcon">
                    <Icon icon="icon-gaojizujian" size="20" />
                  </view>
                  <view class="itemTitle">
                    {{ item.title }}
                  </view>
                </view>
              </view>
            </view>
          </u-transition>
        </view>
        <movable-area
            class="movableArea"
            :style="{
      height:`${skuClassList.length * itemHeight + (skuClassPage.length > 1 ? 68 : 20)}px`,
      width: `${itemWidth * 3}px`,
      marginLeft:`-${itemWidth}px`,
    }"
        >
          <movable-view
              v-if="skuClassPage.length > 1"
              direction="all"
              :x="movableViewX"
              :style="{ width: `${itemWidth}px`,}"
              :class="{movableView:true,inItem:inIndex === -1}"
              :disabled="true"
              @click="$emit('skuClassPageClick',skuClassPage[skuClassPage.length - 2])"
          >
            <view class="item">
              <view class="deptIcon">
                <Icon icon="icon-fanhui" size="20" />
              </view>
              <view class="backDept">返回上级分类</view>
            </view>
          </movable-view>
          <Empty
              style="padding-top: 48px"
              v-if="!skuListLoading && skuClassList.length === 0 && skuList.length === 0"
              description="暂无数据"
          />
          <movable-view
              :damping="0"
              :out-of-bounds="true"
              :animation="false"
              v-for="(item,index) in skuClassList"
              :key="index"
              :disabled="isMove !== index"
              :id="`movableView${index}`"
              :style="{top:`${itemHeight * index+(skuClassPage.length > 1 ? 0 : 10)}px`, width: `${itemWidth}px`,}"
              :y="movableViewY"
              :x="movableViewX"
              direction="all"
              @change="(e)=>move(e,index)"
              @touchend="(e)=>moveEnd(e,index)"
              :class="{movableView:true,moveItem:isMove === index}"
          >
            <Swipe
                :disabled="!tenantAdmin || isMove !== null"
                @click="(key)=>swipeClick(key,item)"
            >
              <view class="moveLine" style="top:0" v-if="inIndex === null && moveIndex === index" />
              <view
                  :class="{item:true,inItem:inIndex === index}"
                  @click="sys ? $emit('onCheckSkuClass',item) :$emit('skuClassClick',item)"
              >
                <Check
                    :disabled="item.number > 0"
                    v-if="sys"
                    :value="checkSkuClass.find(checkSkuClas=>checkSkuClas.key === item.key)"
                />
                <view class="deptIcon">
                  <Icon icon="icon-gaojizujian" size="20" />
                </view>
                <view class="itemTitle">
                  {{ item.title }}
                </view>
                <view
                    v-if="tenantAdmin && !sys"
                    :style="{height:itemHeight}" class="drag"
                    @longpress="moveStart(e,index)"
                >
                  <u-icon name="list" />
                </view>
              </view>
              <view
                  class="moveLine"
                  style="bottom:0"
                  v-if="inIndex === null  && moveIndex === skuClassList.length && index === skuClassList.length-1"
              />
            </Swipe>
            <u-swipe-action-item

            >

            </u-swipe-action-item>
          </movable-view>

          <view
              class="item moveFixItem" v-if="isMove !== null"
              :style="{top:`${itemHeight * isMove + (skuClassPage.length > 1 ? itemHeight : 10)}px`,left:`${itemWidth}px`}"
          >
            <view class="deptIcon">
              <Icon icon="icon-gaojizujian" size="20" />
            </view>
            {{ skuClassList[isMove].title }}
          </view>
        </movable-area>

        <Loading skeleton v-if="skuList.length === 0 && skuListLoading" />
        <movable-area
            :class="{skuMovableArea:true}"
            :style="{
      height:`${(skuClassList.length * itemHeight) + (skuClassPage.length > 1 ? itemHeight : 0) + 46 + (skuList.length * skuItemHeight)}px`,
      width: `${itemWidth * 3}px`,
      marginLeft:`-${itemWidth}px`,
      marginTop:`-${((skuClassList.length * itemHeight) + (skuClassPage.length > 1 ? itemHeight : 0) + 56)}px`,
      minHeight:`calc(100vh - ${47+safeAreaHeight(this,8)}px - ${skuIsMove === null ?36:0}px)`
    }"
        >
          <movable-view
              :out-of-bounds="true"
              :animation="false"
              v-for="(item,index) in skuList"
              :key="index"
              :disabled="skuIsMove !== index"
              :style="{
            top:`${skuItemHeight * index + (skuClassList.length * itemHeight + (skuClassPage.length > 1 ? itemHeight : 0) + 46)}px`,
            width: `${itemWidth}px`,
            height:`${skuItemHeight}px`
          }"
              :y="skuMovableViewY"
              :x="skuMovableViewX"
              direction="all"
              @change="(e)=>skuMove(e,index)"
              @touchend="(e)=>skuMoveEnd(e,index)"
              :class="{skuMovableView:true,skuMoveIng:skuIsMove === index}"
          >
            <Swipe
                noEdit
                :disabled="!tenantAdmin || isMove !== null"
                @click="(key)=>skuSwipeClick(key,index)"
            >
              <view class="skuItem" @click="!(item.stockNum > 0) && $emit('onCheckSkus',item)">
                <Check
                    :disabled="item.stockNum > 0"
                    v-if="sys"
                    :value="checkSkus.find(checkSku=>checkSku.skuId === item.skuId)"
                />
                <view class="sku">
                  <SkuItem :no-view="sys" hidden-number :sku-result="skuResultFormat(item)" img-size="40" />
                </view>
                <view
                    v-if="tenantAdmin && !sys"
                    :style="{height:skuItemHeight}"
                    class="drag"
                    :id="`skuMoveItem${index}`"
                    @longpress="skuMoveStart(e,index)"
                >
                  <u-icon name="list" />
                </view>
              </view>
            </Swipe>
          </movable-view>
        </movable-area>
      </List>
    </uni-swipe-action>

    <u-action-sheet
        :title="moveActionData.title"
        cancelText="取消"
        :actions="moveActionList"
        :show="moveActionShow"
        @close="moveActionShow = false"
        @select="moveActionSelect"
    />

    <Modal ref="modal" />

    <Loading :loading="loading" />

  </view>
</template>

<script>
import Icon from "../../../../components/Icon";
import Empty from "../../../../components/Empty";
import {addSkuClassChildren, delSkuClassChildren, sortSkuClassChildren} from "../../SkuClassList";
import {Sku} from "MES-Apis/lib/Sku/promise";
import SkuItem from "../../../../components/SkuItem";
import Loading from "../../../../components/Loading";
import {isArray, safeAreaHeight} from "../../../../util/Tools";
import Modal from "../../../../components/Modal";
import {SkuResultSkuJsons} from "../../../sku";
import List from "../../../../components/List/indx";
import axios from "axios";
import {Init} from "MES-Apis/lib/Init";
import Swipe from "../../../../components/Swipe/index.vue";
import Check from "../../../../components/Check/index.vue";

export default {
  options: {
    styleIsolation: 'shared'
  },
  name: 'SkuManage',
  components: {Check, Swipe, List, Modal, Loading, SkuItem, Empty, Icon},
  props: [
    'skuClassList',
    'skuClassPage',
    'tree',
    'movableViewY',
    'movableViewX',
    'itemWidth',
    'skuList',
    'checkSkus',
    'sys',
    'checkSkuClass'
  ],
  data() {
    return {
      Sku,
      safeAreaHeight,
      tenantAdmin: true,
      skuClassId: '',
      movableView: 0,
      skuItemHeight: 55,
      skuListLoading: false,
      itemHeight: 48,
      moveIndex: null,
      inIndex: null,
      isMove: null,
      isMoveEnd: false,
      scrollTop: 0,
      moveEndIndex: null,
      moveActionShow: false,
      moveActionData: {},
      moveActionList: [
        {
          name: '移动分类',
          key: 'move',
        },
        {
          name: '拷贝并移动',
          key: 'copy',
        },
      ],
      skuIsMove: null,
      skuMovableViewY: 0,
      skuMovableViewX: 0,
      skuMoveIndex: null,
      removeSku: false,
      requestSkuListPromise: null,
      loading: false,
      removeSkuIds: [],
      skuImages: []
    }
  },
  mounted() {
    // const miniProgram = uni.getAccountInfoSync().miniProgram
    // request({
    //   url: `/wxma/messageCallBack/${miniProgram.appId}`,
    //   method: 'POST'
    // })
    this.tenantAdmin = this.$store.state.userInfo.tenant.admin
  },
  watch: {
    skuClassPage: {
      deep: true,
      handler(skuClassPage) {
        const thisSkuClass = skuClassPage[skuClassPage.length - 1]
        if (thisSkuClass.key !== this.skuClassId) {
          this.skuClassId = thisSkuClass.key
          this.submitSkuList({categoryId: thisSkuClass.key})
        }
      }
    }
  },
  methods: {
    showStatus() {
      return this.$refs.modal.showStatus() || this.moveActionShow;
    },
    close() {
      this.$refs.modal.close();
      this.moveActionShow = false
    },
    skuResultFormat(item) {
      const media = this.skuImages.find(mediaItem => mediaItem.mediaId === item.images?.split(',')[0]) || {}
      return {
        ...item,
        thumbUrl: media.thumbUrl
      }
    },
    requestSkuList(service, params) {
      const CancelToken = axios.CancelToken;
      let cancel;
      Sku.listV1_1({
        ...service,
        cancelToken: new CancelToken(function executor(c) {
          // executor 函数接收一个 cancel 函数作为参数
          cancel = c;
        })
      }, params)
      this.cancel = cancel
    },
    async submitSkuList({categoryId}) {
      if (this.skuListLoading) {
        this.cancel()
      }
      this.skuImages = []
      this.removeSkuIds = []
      this.$refs.skuList.submit({categoryId})
    },
    async skuListSource(list, newSkuList) {
      this.$emit('skuListChange', list.filter(item => !this.removeSkuIds.find(removeItem => removeItem.skuId === item.skuId)))
      this.resetSkuMove()
      if (newSkuList.length > 0) {
        await Sku.getMediaUrls({
          mediaIds: newSkuList.map(item => item.images?.split(',')[0]),
          option: 'image/resize,m_fill,h_48,w_48',
        }).then((res) => {
          isArray(res?.data).map(item => {
            this.skuImages.push(item)
          })
        }).catch(() => {
        })
      }
    },
    async moveActionSelect({key}) {
      let newTree = []
      const thisSkuClass = this.skuClassList[this.moveActionData.thisIndex]
      this.loading = true
      switch (key) {
        case 'move':
          const tree = delSkuClassChildren(thisSkuClass.key, this.tree)
          if (this.moveActionData.inIndex === -1) {
            const skuClassKey = this.skuClassPage[this.skuClassPage.length - 2].key
            await Sku.spuClassEdit({
              data: {
                spuClassificationId: thisSkuClass.key,
                pid: skuClassKey
              }
            }).then(() => {
              if (skuClassKey === '0') {
                newTree = [...tree, thisSkuClass]
              } else {
                newTree = addSkuClassChildren(skuClassKey, thisSkuClass, tree)
              }
              this.skuClassListChange(this.skuClassList.filter((item, index) => index !== this.moveActionData.thisIndex))
            }).catch(() => {
              this.$refs.modal.dialog({
                title: Init.getNewErrorMessage() || '移动失败!'
              })
            })
          } else {
            const skuClass = this.skuClassList[this.moveActionData.inIndex]
            await Sku.spuClassEdit({
              data: {
                spuClassificationId: thisSkuClass.key,
                pid: skuClass.key
              }
            }).then(() => {
              newTree = addSkuClassChildren(skuClass.key, thisSkuClass, tree)
              this.skuClassListChange(this.skuClassList.filter((item, index) => index !== this.moveActionData.thisIndex))
            }).catch(() => {
              this.$refs.modal.dialog({
                title: Init.getNewErrorMessage() || '移动失败!'
              })
            })
          }
          break;
        case 'copy':
          if (this.moveActionData.inIndex === -1) {
            const skuClassKey = this.skuClassPage[this.skuClassPage.length - 2].key
            await Sku.spuClassAdd({
              data: {
                name: thisSkuClass.title,
                pid: skuClassKey
              }
            }).then((res) => {
              const newSkuClass = {
                key: res.data,
                children: [],
                title: thisSkuClass.title
              }
              if (skuClassKey === '0') {
                newTree = [...this.tree, newSkuClass]
              } else {
                newTree = addSkuClassChildren(skuClassKey, newSkuClass, this.tree)
              }
            }).catch(() => {
              this.$refs.modal.dialog({
                title: Init.getNewErrorMessage() || '拷贝失败!'
              })
            })
          } else {
            const skuClass = this.skuClassList[this.moveActionData.inIndex]
            await Sku.spuClassAdd({
              data: {
                name: thisSkuClass.title,
                pid: skuClass.key
              }
            }).then((res) => {
              const newSkuClass = {
                key: res.data,
                children: [],
                title: thisSkuClass.title
              }
              newTree = addSkuClassChildren(skuClass.key, newSkuClass, this.tree)
            }).catch(() => {
              this.$refs.modal.dialog({
                title: Init.getNewErrorMessage() || '拷贝失败!'
              })
            })

          }
          break
      }
      this.loading = false
      this.$emit('treeChange', newTree)
    },
    move(e, index) {
      if (!e.detail.source) {
        return
      }
      const y = this.skuClassPage.length > 1 ? e.detail.y - this.itemHeight : e.detail.y
      let newY = 0
      if (y < this.itemHeight && y > -this.itemHeight) {
        newY = y
      } else {
        newY = y + newY
      }

      const moveIndex = parseInt(newY / this.itemHeight)
      let endIndex = (moveIndex + index)
      if (endIndex > this.skuClassList.length - 1) {
        endIndex = this.skuClassList.length - 1
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
      this.isMove = null
      const y = this.movableView
      let newY = 0
      if (y < this.itemHeight && y > -this.itemHeight) {
        newY = 0
      } else {
        newY = y
      }
      let moveIndex = parseInt(newY / this.itemHeight)

      this.$nextTick(function () {
        if (this.inIndex !== null) {
          this.moveActionShow = true
          this.moveActionData = {...this.skuClassList[thisIndex], thisIndex, inIndex: this.inIndex}
          this.skuClassListChange(this.skuClassList)
        } else if (this.moveEndIndex !== null) {
          const skuClassList = this.skuClassList.map((item, index) => {
            if (moveIndex > 0) {
              if (index < this.moveEndIndex && index >= thisIndex) {
                return {...this.skuClassList[index + 1]}
              } else if (index === this.moveEndIndex) {
                return {...this.skuClassList[thisIndex]}
              }
            } else {
              if (index > this.moveEndIndex && index <= thisIndex) {
                return {...this.skuClassList[index - 1]}
              } else if (index === this.moveEndIndex) {
                return {...this.skuClassList[thisIndex]}
              }
            }
            return item
          })
          this.skuClassListChange(skuClassList)
          const thisKey = this.skuClassPage[this.skuClassPage.length - 1].key
          if (thisKey === '0') {
            this.$emit('treeChange', skuClassList)
          } else {
            this.$emit('treeChange', sortSkuClassChildren(thisKey, skuClassList, this.tree))
          }

          Sku.categorySort({
            data: {
              sortParam: skuClassList.map((item, index) => ({
                spuClassificationId: item.key,
                sort: skuClassList.length - 1 - index
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
    skuMoveStart(e, index) {
      this.$refs["uni-swipe-action"].closeAll()
      this.skuIsMove = index
      this.removeSku = false
      this.skuMoveIndex = null
    },
    skuMove(e, index) {
      if (typeof this.skuIsMove !== 'number') {
        return
      }

      const query = uni.createSelectorQuery().in(this);
      query.select(`#skuMoveItem${index}`).boundingClientRect(data => {
        const top = data.top - 64
        this.removeSku = data.top <= 50
        if (data.top > 64 && data.left > 24 && data.right > 24 && top < this.itemHeight * (this.skuClassPage.length > 1 ? this.skuClassList.length + 1 : this.skuClassList.length)) {
          this.skuMoveIndex = parseInt(top / this.itemHeight)
        } else {
          this.skuMoveIndex = null
        }
      }).exec();

    },
    skuMoveEnd(e, thisIndex) {

      if (typeof this.skuIsMove !== 'number') {
        return
      }

      if (this.removeSku) {
        this.onRemoveSku(thisIndex)
        return;
      }
      if (this.skuMoveIndex !== null) {
        const _this = this
        let title = ''
        let skuClassId = 0
        if (this.skuClassPage.length > 1) {
          if (_this.skuMoveIndex === 0) {
            const key = _this.skuClassPage[_this.skuClassPage.length - 2].key
            title = '确认将物料移动到' + (key !== '0' ? _this.skuClassPage[_this.skuClassPage.length - 2].name : '顶级') + '吗？'
            skuClassId = key
          } else {
            title = '确认将物料移动到' + _this.skuClassList[_this.skuMoveIndex - 1].title + '吗？'
            skuClassId = _this.skuClassList[_this.skuMoveIndex - 1].key
          }
        } else {
          title = '确认将物料移动到' + _this.skuClassList[_this.skuMoveIndex].title + '吗？'
          skuClassId = _this.skuClassList[_this.skuMoveIndex].key
        }
        const sku = this.skuList[thisIndex]
        this.$refs.modal.dialog({
          title,
          content: SkuResultSkuJsons({skuResult: sku}),
          only: false,
          onConfirm: () => {
            return new Promise((resolve) => {
              Sku.edit({
                data: {
                  images: sku.images,
                  unitId: sku.unitId,
                  spu: {categoryId: skuClassId, name: sku.spuName, spuId: sku.spuId},
                  skuId: sku.skuId,
                  spuClass: skuClassId,
                  skuName: sku.skuName
                }
              }).then(() => {
                this.setRemoveSkuIds([sku.skuId])
                _this.$emit('skuListChange', _this.skuList.filter(item => item.skuId !== sku.skuId))
                resolve(true)
              }).catch(() => {
                resolve(false)
                _this.$refs.modal.dialog({
                  title: Init.getNewErrorMessage() || '移动失败!'
                })
              })
            })
          }
        })
      }

      this.resetSkuMove()

    },
    setRemoveSkuIds(ids) {
      this.removeSkuIds = [...this.removeSkuIds, ...ids]
    },
    onRemoveSku(thisIndex) {
      const _this = this
      this.$refs.modal.dialog({
        title: '确认删除物料吗？',
        only: false,
        content: SkuResultSkuJsons({skuResult: _this.skuList[thisIndex]}),
        confirmError: true,
        onConfirm: () => {
          return new Promise((resolve) => {
            Sku.del({
              data: {
                skuId: _this.skuList[thisIndex].skuId,
              }
            }).then(() => {
              this.setRemoveSkuIds([_this.skuList[thisIndex].skuId])
              _this.$emit('skuListChange', _this.skuList.filter(item => item.skuId !== _this.skuList[thisIndex].skuId))
              resolve(true)
            }).catch(() => {
              resolve(false)
              _this.$refs.modal.dialog({
                title: Init.getNewErrorMessage() || '删除失败!'
              })
            })
          })
        }
      })
    },
    skuClassListChange(skuClassList) {
      this.$emit('skuClassListChange', skuClassList)
      // this.resetSkuMove()
    },
    resetSkuMove() {
      this.skuMovableViewX = this.itemWidth - 0.1
      this.skuMovableViewY = 0.1
      this.$nextTick(function () {
        this.skuIsMove = null
        this.skuMoveIndex = null
        this.skuMovableViewX = this.itemWidth
        this.skuMovableViewY = 0
      })
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
    skuSwipeClick(key, index) {
      switch (key) {
        case 'delete':
          this.onRemoveSku(index)
          break;
        case 'edit':
          break
      }
    }
  }
}
</script>

<style lang="scss">

.scrollList {
  overflow: hidden auto;
  background-color: #fff;
}

.skuMoveAreaBox {
  //position: fixed;
}

.skuMoveArea {
  top: 0;
  position: fixed;
  height: 100vh;
}

.moveSkuBox {
  position: fixed;
  top: 0;
  width: 100vw;
  height: 100%;
  z-index: 2;

  .make {
    position: fixed;
    top: 0;
    width: 100vw;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
  }

  .removeSku {
    z-index: 1;
    margin: 0 -24px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    background-color: rgba(0, 0, 0, 0.5);
    margin-bottom: 24px;
    border-bottom-right-radius: 4px;
    border-bottom-left-radius: 4px;
  }

  .startRemoveSku {
    background-color: rgba(255, 0, 0, 0.5);
  }

  .moveSkuBoxSkuClass {
    z-index: 1;
    background-color: #fff;
    border-radius: 8px;
    margin: 0 24px;
  }
}

.skuMovableView {
  width: 100%;
}

.skuItem {
  display: flex;
  align-items: center;
  padding: 6px 0 6px 12px;
  border-bottom: solid 1px #f5f5f5;

  .sku {
    flex-grow: 1;
  }
}

.skuMove {
  background-color: rgba(0, 122, 255, 0.50);
}

.skuMoveIng {
  width: fit-content;
  z-index: 99;

  .skuItem {
    border: none;
    background-color: rgba(255, 255, 255, 0.6);
  }
}
</style>
