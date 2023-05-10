<template>
  <view>
    <movable-area
        class="movable-area"
        :style="{height:`${skuClassList.length * itemHeight + (skuClassPage.length > 1 ? 48 : 0) + 20}px`}"
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
          v-if="skuClassList.length === 0"
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

      <movable-view
          :damping="0"
          :out-of-bounds="true"
          :animation="false"
          v-for="(item,index) in skuList"
          :key="index"
          :disabled="isMove !== index"
          :id="`movableView${index}`"
          :style="{top:`${48 * index}px`}"
          :y="movableViewY"
          direction="vertical"
          @change="(e)=>move(e,index)"
          @touchend="(e)=>moveEnd(e,index)"
          :class="{movableView:true,inItem:inIndex === index,moveItem:isMove === index}"
      >
        <view>
          <SkuItem hidden-number :sku-result="item" img-size="48" />
        </view>
      </movable-view>
    </movable-area>

    <u-action-sheet
        :title="moveActionData.title"
        cancelText="取消"
        :actions="moveActionList"
        :show="moveActionShow"
        @close="moveActionShow = false"
        @select="moveActionSelect"
    />
  </view>
</template>

<script>
import Icon from "../../../../components/Icon";
import Empty from "../../../../components/Empty";
import {addSkuClassChildren, delSkuClassChildren} from "../../SkuClassList";
import {Sku} from "MES-Apis/lib/Sku/promise";
import SkuItem from "../../../../components/SkuItem";

export default {
  name: 'SkuManage',
  components: {SkuItem, Empty, Icon},
  props: [
    'skuClassList',
    'skuClassPage',
    'tree',
    'movableViewY',
  ],
  data() {
    return {
      skuClassId: '',
      skuList: [],
      movableView: 0,
      itemHeight: 48,
      moveIndex: null,
      inIndex: null,
      isMove: null,
      isMoveEnd: false,
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
      ]
    }
  },
  watch: {
    skuClassPage(skuClassPage) {
      const thisSkuClass = skuClassPage[skuClassPage.length - 1]
      if (thisSkuClass.key !== this.skuClassId) {
        this.skuClassId = thisSkuClass.key
        this.skuListLoading = true
        Sku.listV1_1({data: {categoryId: thisSkuClass.key}}).then((res) => {
          this.skuList = res.data || []
        }).finally(() => {
          this.skuListLoading = false
        })
      }

      this.$nextTick(function () {
        this.moveIndex = null
        this.inIndex = null
      })
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
