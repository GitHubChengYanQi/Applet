<template>
  <view>
    <view class="header" v-if="skuIsMove === null">
      <uni-breadcrumb separator="/">
        <uni-breadcrumb-item v-for="(route,index) in skuClassPage" :key="index">
          <view @click="$emit('skuClassPageClick',route)">
            {{ route.name }}
          </view>
        </uni-breadcrumb-item>
      </uni-breadcrumb>
    </view>
    <view
        class="users"
        :style="{
      height: `calc(100vh - ${47+safeAreaHeight(this,8)}px - ${skuIsMove === null ?36:0}px)`,
      width:'calc(100% - 24px)',
    }"
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
        <view :class="{removeSku:true,startRemoveSku:removeSku}">
          <u-icon name="trash" color="red" size="28" />
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
      </view>

      <movable-area
          class="movableArea"
          :style="{height:`${skuClassList.length * itemHeight + (skuClassPage.length > 1 ? 58 : 20)}px`}"
      >
        <movable-view
            v-if="skuClassPage.length > 1"
            direction="vertical"
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
            v-if="skuClassList.length === 0 && skuList.length === 0"
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
            :style="{top:`${48 * index+(skuClassPage.length > 1 ? 0 : 10)}px`}"
            :y="movableViewY"
            direction="vertical"
            @change="(e)=>move(e,index)"
            @touchend="(e)=>moveEnd(e,index)"
            :class="{movableView:true,inItem:inIndex === index,moveItem:isMove === index}"
            @click="$emit('onCheckSkuClass',item)"
        >
          <view class="moveLine" v-if="inIndex === null && moveIndex === index" />
          <view class="item">
            <view class="deptIcon">
              <Icon icon="icon-gaojizujian" size="20" />
            </view>
            <view class="itemTitle">
              {{ item.title }}
            </view>
            <view class="drap" @touchstart="moveStart(e,index)">
              <u-icon name="list" />
            </view>
          </view>
          <view
              class="moveLine"
              v-if="inIndex === null  && moveIndex === skuClassList.length && index === skuClassList.length-1"
          />
        </movable-view>
        <view
            class="item moveFixItem" v-if="isMove !== null"
            :style="{top:`${48 * isMove + (skuClassPage.length > 1 ? 48 : 10)}px`}"
        >
          <view class="deptIcon">
            <Icon icon="icon-gaojizujian" size="20" />
          </view>
          {{ skuClassList[isMove].title }}
        </view>
      </movable-area>

      <Loading skeleton v-if="skuListLoading" />
      <movable-area
          v-else
          :class="{skuMovableArea:true}"
          :style="{
      height:`${(skuClassList.length * itemHeight) + (skuClassPage.length > 1 ? 58 : 20) + 36 + (skuList.length * 66)}px`,
      width: `${itemWidth * 3}px`,
      marginLeft:`-${itemWidth}px`,
      marginTop:`-${(skuClassList.length * itemHeight + (skuClassPage.length > 1 ? 58 : 20) + 36)}px`
    }"
      >
        <movable-view
            :damping="0"
            :out-of-bounds="true"
            :animation="false"
            v-for="(item,index) in skuList"
            :key="index"
            :disabled="skuIsMove !== index"
            :style="{
            top:`${66 * index + (skuClassList.length * itemHeight + (skuClassPage.length > 1 ? 58 : 20) + 36)}px`,
            width: `${itemWidth}px`,
          }"
            :y="skuMovableViewY"
            :x="skuMovableViewX"
            direction="all"
            @change="(e)=>skuMove(e,index)"
            @touchend="(e)=>skuMoveEnd(e,index)"
            :class="{skuMovableView:true,skuMoveIng:skuIsMove === index}"
        >
          <view class="skuItem">
            <view class="sku">
              <SkuItem hidden-number :sku-result="item" img-size="48" />
            </view>
            <view class="drap" :id="`skuMoveItem${index}`" @touchstart="skuMoveStart(e,index)">
              <u-icon name="list" />
            </view>
          </view>
        </movable-view>
      </movable-area>
    </view>


    <u-action-sheet
        :title="moveActionData.title"
        cancelText="取消"
        :actions="moveActionList"
        :show="moveActionShow"
        @close="moveActionShow = false"
        @select="moveActionSelect"
    />

    <Modal ref="modal" />

  </view>
</template>

<script>
import Icon from "../../../../components/Icon";
import Empty from "../../../../components/Empty";
import {addSkuClassChildren, delSkuClassChildren} from "../../SkuClassList";
import {Sku} from "MES-Apis/lib/Sku/promise";
import SkuItem from "../../../../components/SkuItem";
import Loading from "../../../../components/Loading";
import {safeAreaHeight} from "../../../../util/Tools";
import Modal from "../../../../components/Modal";
import {SkuResultSkuJsons} from "../../../sku";

export default {
  options: {
    styleIsolation: 'shared'
  },
  name: 'SkuManage',
  components: {Modal, Loading, SkuItem, Empty, Icon},
  props: [
    'skuClassList',
    'skuClassPage',
    'tree',
    'movableViewY',
  ],
  data() {
    return {
      safeAreaHeight,
      tenant: {},
      skuClassId: '',
      skuList: [],
      movableView: 0,
      skuListLoading: false,
      itemWidth: 404,
      itemHeight: 48,
      moveIndex: null,
      inIndex: null,
      isMove: null,
      isMoveEnd: false,
      skuIsMove: null,
      scrollTop: 0,
      moveEndIndex: 0,
      moveActionShow: false,
      moveActionData: {},
      moveActionList: [
        {
          name: '移动分类',
          key: 'edit',
        },
        {
          name: '拷贝并移动',
          key: 'copy',
        },
      ],
      skuMovableViewY: 0,
      skuMovableViewX: 0,
      removeSku: false,
      skuMoveIndex: null
    }
  },
  mounted() {
    this.itemWidth = this.$store.state.systemInfo.systemInfo.windowWidth - 24
    this.tenant = this.$store.state.userInfo.tenant
  },
  watch: {
    skuClassPage: {
      deep: true,
      handler(skuClassPage) {
        const thisSkuClass = skuClassPage[skuClassPage.length - 1]
        if (thisSkuClass.key !== this.skuClassId) {
          this.skuClassId = thisSkuClass.key
          this.skuListLoading = true
          Sku.listV1_1({data: {categoryId: thisSkuClass.key}}).then((res) => {
            this.skuList = res.data || []
            this.$nextTick(function () {
              this.skuMovableViewX = 0
              this.skuMovableViewY = 0
              this.$nextTick(function () {
                this.skuMovableViewX = this.itemWidth
                this.skuMovableViewY = 0
              })
            })
          }).finally(() => {
            this.skuListLoading = false
          })
        } else if (thisSkuClass.key === '0') {
          this.skuList = []
        }

        this.$nextTick(function () {
          this.moveIndex = null
          this.inIndex = null
        })
      }
    }
  },
  methods: {
    moveActionSelect() {
      const thisSkuClass = this.skuClassList[this.moveActionData.thisIndex]
      const tree = delSkuClassChildren(thisSkuClass.key, this.tree)
      let newTree = []
      if (this.moveActionData.inIndex === -1) {
        const key = this.skuClassPage[this.skuClassPage.length - 2].key
        if (key === '0') {
          newTree = [...tree, thisSkuClass]
        } else {
          newTree = addSkuClassChildren(key, thisSkuClass, tree)
        }
      } else {
        const skuClass = this.skuClassList[this.moveActionData.inIndex]
        newTree = addSkuClassChildren(skuClass.key, thisSkuClass, tree)
      }
      this.$emit('treeChange', newTree)
      this.skuClassListChange(this.skuClassList.filter((item, index) => index !== this.moveActionData.thisIndex))
    },
    move(e, index) {
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

      // this.movableViewY = y

      this.$nextTick(function () {
        if (this.inIndex !== null) {
          this.moveActionShow = true
          this.moveActionData = {...this.skuClassList[thisIndex], thisIndex, inIndex: this.inIndex}
          this.skuClassListChange(this.skuClassList)
        } else {
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
        }

      })
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
        // console.log("节点离页面顶部的距离为" + data.top);
      }).exec();

    },
    skuMoveStart(e, index) {
      this.skuIsMove = index
    },
    skuMoveEnd(e, thisIndex) {

      if (typeof this.skuIsMove !== 'number') {
        return
      }
      if (this.removeSku) {
        const _this = this
        this.$refs.modal.dialog({
          title: '确认删除物料吗？',
          only: false,
          content: SkuResultSkuJsons({skuResult: _this.skuList[thisIndex]}),
          confirmError: true,
          onConfirm: () => {
            return true
          }
        })
      }
      if (this.skuMoveIndex !== null) {
        const _this = this
        let title = ''
        if (this.skuClassPage.length > 1) {
          if (_this.skuMoveIndex === 0) {
            const key = _this.skuClassPage[_this.skuClassPage.length - 2].key
            title = '确认移动物料到' + (key !== '0' ? _this.skuClassPage[_this.skuClassPage.length - 2].name : '顶级') + '吗？'
          } else {
            title = '确认移动物料到' + _this.skuClassList[_this.skuMoveIndex - 1].title + '吗？'
          }
        } else {
          title = '确认移动物料到' + _this.skuClassList[_this.skuMoveIndex].title + '吗？'
        }
        this.$refs.modal.dialog({
          title,
          only: false,
          confirmError: true,
          onConfirm: () => {
            return true
          }
        })
      }
      this.skuIsMove = null
      this.skuMoveIndex = null
      this.$nextTick(function () {
        this.skuMovableViewX = 0
        this.skuMovableViewY = 0
        setTimeout(() => {
          this.skuMovableViewX = this.itemWidth
          this.skuMovableViewY = 0
        }, 0)
      })

    },
    skuClassListChange(skuClassList) {
      this.$emit('skuClassListChange', skuClassList)
      this.$nextTick(function () {
        this.moveIndex = null
        this.inIndex = null
      })
    }
  }
}
</script>

<style lang="scss">

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
  width: calc(100% - 48px);
  height: 100%;
  margin-left: -12px;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 2;
  padding: 0 24px;

  .removeSku {
    margin: 0 -24px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    background-color: rgba(255, 0, 0, 0.3);
    margin-bottom: 24px;
  }

  .startRemoveSku {
    background-color: rgba(255, 0, 0, 0.5);
  }

  .moveSkuBoxSkuClass {
    background-color: #fff;
    border-radius: 8px;
  }
}

.skuMovableView {
  width: 100%;
  height: 66px;
}

.skuItem {
  display: flex;
  align-items: center;
  padding: 8px 6px;
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
