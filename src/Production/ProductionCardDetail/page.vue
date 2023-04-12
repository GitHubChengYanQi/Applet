<template>
  <view class="productionCardDetail">
    <Empty v-if="error" description="生产卡片不正确" type="error" />
    <Loading :skeleton="true" skeleton-type="page" v-else-if="loading" />
    <view v-else>
      <view
          class="productionCardBom"
          :style="{maxHeight: `calc(100vh - ${37 + safeAreaHeight(this,8)}px)`}"
      >
        <ProductionCardBom
            :bom="parentBom"
            @check="check"
            @reset="reset"
            :checkList="checkList"
            :complete="parentBom.done === 1"
        />
      </view>

      <view class="action" :style="{paddingBottom:`${safeAreaHeight(this,8)}px`}">
        <view class="allCheck" @click="allCheck">
          <Check v-if="false" :value="checkList.length === boms.length">
            全选
          </Check>
          <view>
            <view class="total">
              已选
              <view class="num">{{ this.checkList.filter(item => item.done !== 1).length }}</view>
              个
            </view>
          </view>
        </view>
        <view>
          <MyButton
              :loading="submitLoading"
              :disabled="this.checkList.filter(item => item.done !== 1).length === 0"
              type="primary"
              @click="submit"
          >
            完成计划
          </MyButton>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import {Production} from "MES-Apis/lib/Production/promise";
import Loading from "../../components/Loading";
import Empty from "../../components/Empty";
import Card from "../../components/Card";
import {isArray, isObject, safeAreaHeight} from "../../util/Tools";
import SkuItem from "../../components/SkuItem";
import Check from "../../components/Check";
import BottomButton from "../../components/BottomButton";
import MyButton from "../../components/MyButton";
import Search from "../../components/Search";
import {SkuResultSkuJsons} from "../../Sku/components/SkuResult_skuJsons";
import ProductionCardBom from "./components/ProductionCardBom";
import {Message} from "../../components/Message";

export default {
  components: {ProductionCardBom, Search, MyButton, BottomButton, Check, SkuItem, Card, Empty, Loading},
  props: ['cardId'],
  mounted() {
    this.getCardDetail()
  },
  data() {
    return {
      isObject,
      isArray,
      loading: false,
      submitLoading: false,
      error: false,
      boms: [],
      parentBom: {},
      safeAreaHeight,
      checkList: [],
      SkuResultSkuJsons
    }
  },
  methods: {
    getCardDetail() {
      this.loading = true
      Production.getBomListByCardId({
        data: {
          productionCardId: this.cardId
        }
      }).then((res) => {
        const parentBom = res.data.find(item => item.parentId === 0) || {}
        const boms = res.data || []
        this.parentBom = this.formatBoms(parentBom, boms)
        this.boms = res.data
        this.checkList = boms.filter(item => item.done === 1)
      }).catch(() => {
        this.error = true
      }).finally(() => {
        this.loading = false
      })
    },
    formatBoms(bom, boms) {
      return {
        ...bom,
        children: boms.filter(item => item.parentId === bom.partsId).map(item => {
          return this.formatBoms(item, boms)
        })
      }
    },
    allCheck() {
      if (this.checkList.length === this.boms.length) {
        this.checkList = []
      } else {
        this.checkList = this.boms
      }
    },
    reset(bom) {
      this.checkList = this.checkList.map(item => {
        if (item.productionTaskId === bom.productionTaskId) {
          return {...item, done: item.done === 1 ? 0 : 1}
        }
        return item
      })
    },
    check(bom) {
      if (this.checkList.find(item => item.productionTaskId === bom.productionTaskId)) {
        const parentIds = this.parentIds(bom, this.parentBom, [])
        this.checkList = this.checkList.filter(item => {
          if (item.parentId === 0) {
            return false
          } else if (parentIds.find(id => id === item.productionTaskId)) {
            return false
          }
          return !(item.productionTaskId === bom.productionTaskId)
        })
      } else {
        this.checkList = [...this.checkList, bom]
      }
    },
    parentIds(part, bom, ids = []) {
      const branch = isArray(bom.children).map(item => {
        if (item.productionTaskId === part.productionTaskId) {
          return ids
        } else {
          return this.parentIds(part, item, [...ids, item.productionTaskId])
        }
      })
      const newIds = []
      branch.forEach(item => item.forEach(item => newIds.push(item)))
      return newIds
    },
    submit() {
      this.submitLoading = true
      Production.doneTask({
        data: {
          taskIds: this.checkList.filter(item => item.done !== 1).map(item => {
            return item.productionTaskId
          })
        }
      }).then(() => {
        const _this = this
        Message.dialog({
          title: '提交成功！',
          only: false,
          cancelText: '返回',
          confirmText: '继续操作',
          onConfirm() {
            _this.getCardDetail()
            return true
          },
          onCancel() {
            uni.navigateBack()
            return true
          }
        })
      }).finally(() => {
        this.submitLoading = false
      })
    }
  }
}
</script>

<style lang="scss">

.productionCardDetail {
  height: 100vh;
  background-color: #fff;
}

.productionCardBom {
  overflow: auto;
}

.action {
  display: flex;
  align-items: center;
  position: fixed;
  bottom: 0;
  background-color: #fff;
  width: calc(100% - 24px);
  padding: 8px 12px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.3);

  .allCheck {
    flex-grow: 1;
    display: flex;
    align-items: center;
    gap: 8px;

    .total {
      margin-top: -4px;

      .num {
        display: inline-block;
        color: $primary-color;
        padding: 0 4px;
        font-size: 20px;
      }
    }
  }
}

</style>
