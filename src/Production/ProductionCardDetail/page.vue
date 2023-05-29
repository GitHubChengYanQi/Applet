<template>
  <view class="productionCardDetail">
    <Empty v-if="error" description="生产卡片不正确" type="error" />
    <Loading :skeleton="true" skeleton-type="page" v-else-if="loading" />
    <view v-else>

      <Card title="基本信息" style="border-bottom: solid 1px #F5F5F5">
        <view class="info">
          <view class="infoItem">
            <span class="label">卡片编码：</span>{{ detail.cardCoding }}
          </view>
          <view class="infoItem">
            <span class="label">状态：</span>
            <u-tag v-if="detail.status === 0" text="进行中" size="mini"></u-tag>
            <u-tag v-else type="success " text="完成" size="mini"></u-tag>
          </view>
          <view class="infoItem">
            <span class="label">生产进度：</span>
            <u-line-progress
                :percentage="rateTool((detail.doneBomCount || 0),detail.bomCount,true)"
            />
          </view>
        </view>
      </Card>

      <Card title="生产信息" style="border-bottom: solid 1px #F5F5F5" />
      <view
          class="productionCardBom"
          :style="{ maxHeight: `calc(100vh - 200px - ${(parentBom.done !== 1 ? 37 : 0) + safeAreaHeight(this,8)}px)`}"
      >
        <ProductionCardBom
            :bom="parentBom"
            @check="check"
            :checkList="checkList"
            :complete="parentBom.done === 1"
        />
      </view>

      <view v-if="parentBom.done !== 1" class="action" :style="{paddingBottom:`${safeAreaHeight(this,8)}px`}">
        <view class="allCheck">
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

    <Modal ref="modal" />

  </view>
</template>

<script>
import {Production} from "MES-Apis/lib/Production/promise";
import Loading from "../../components/Loading";
import Empty from "../../components/Empty";
import Card from "../../components/Card";
import {isArray, isObject, rateTool, safeAreaHeight} from "../../util/Tools";
import SkuItem from "../../components/SkuItem";
import Check from "../../components/Check";
import BottomButton from "../../components/BottomButton";
import MyButton from "../../components/MyButton";
import Search from "../../components/Search";
import {SkuResultSkuJsons} from "../../Sku/components/SkuResult_skuJsons";
import ProductionCardBom from "./components/ProductionCardBom";
import {Sku} from "MES-Apis/lib/Sku/promise";
import Modal from "../../components/Modal";

export default {
  components: {Modal, ProductionCardBom, Search, MyButton, BottomButton, Check, SkuItem, Card, Empty, Loading},
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
      SkuResultSkuJsons,
      detail: {},
      rateTool
    }
  },
  methods: {
    async getCardDetail() {
      this.loading = true
      await Production.productionCardDetail({
        data: {
          productionCardId: this.cardId
        }
      }).then((res) => {
        this.detail = res.data || {}
      }).catch(() => {
        this.error = true
      })
      const res = await Production.getBomListByCardId({
        data: {
          productionCardId: this.cardId
        }
      }).catch(() => {
        this.error = true
      })

      const boms = isArray(res.data)
      const newBoms = await this.getSkuImgs(boms)
      const parentBom = newBoms.find(item => item.parentId === 0) || {}
      this.parentBom = this.formatBoms(parentBom, newBoms)
      this.checkList = boms.filter(item => item.done === 1)

      this.loading = false
    },
    async getSkuImgs(list) {
      return new Promise((resolve, reject) => {
        Sku.getMediaUrls({
          mediaIds: list.map(item => item.skuResult?.images?.split(',')[0]),
          option: 'image/resize,m_fill,h_74,w_74',
        }).then((res) => {
          return resolve(list.map(item => {
            return this.skuResultFormat(item, res?.data)
          }))
        }).catch(() => {
          reject()
        })
      })
    },
    skuResultFormat(item, skuImages) {
      const skuResult = item.skuResult || {}
      const media = skuImages.find(mediaItem => mediaItem.mediaId === skuResult.images?.split(',')[0]) || {}
      return {
        ...item,
        skuResult: {
          ...skuResult,
          thumbUrl: media.thumbUrl
        }
      }
    },
    formatBoms(bom, boms) {
      return {
        ...bom,
        children: boms.filter(item => item.parentId === bom.bomId).map(item => {
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
        uni.$emit('doneProductionTask', {
          cardId: this.cardId,
          doneNum: this.checkList.filter(item => item.done !== 1).length,
          planId: this.detail.sourceId
        })
        const _this = this
        this.$refs.modal.dialog({
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

.info {
  .infoItem {
    padding: 4px 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }
}

.label {
  color: #a9a9a9;
}

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
