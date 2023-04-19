<template>
  <view :style="{paddingBottom: `${60+safeAreaHeight(this,)}px`}">
    <Card title="采购订单">
      <view v-if="order.orderId">
        <view class="header">
          <view class="headerItem">
            <span class="label">编码</span>：
            <view style="height: 19px;">
              <Elliptsis width="calc(100vw - 125px)">{{ order.coding }}</Elliptsis>
            </view>

          </view>
          <view class="headerItem">
            <span class="label">主题</span>：
            <view style="height: 19px;">
              <Elliptsis width="calc(100vw - 125px)">{{ order.theme || '无' }}</Elliptsis>
            </view>
          </view>
          <view class="headerItem">
            <span class="label">供应商</span>：
            <view style="height: 19px;">
              <Elliptsis width="calc(100vw - 125px)">
                {{ order.sellerResult && order.sellerResult.customerName || '无' }}
              </Elliptsis>
            </view>
          </view>
          <view class="headerItem" style="align-items: center">
            <span class="label">入库进度</span>：
            <u-line-progress :percentage="percentage"></u-line-progress>
          </view>
        </view>
      </view>
    </Card>
    <Card title="采购物料列表" style="margin:0" />
    <view style="padding: 0 12px;background-color: #fff">
      <Search
          placeholder='请输入关键字搜索采购订单'
          :value="searchValue"
          @onChange="(value)=>searchValue = value"
          @onSearch="onSearch"
      />
    </view>
    <view>
      <Loading :skeleton="true" v-if="loading" />
      <Empty v-else-if="list.length === 0" description="暂无物料" />
      <view v-else class="detail">
        <view
            v-for="(item,index) in list"
            :key="index"
            @click="$emit('onCheck',item)"

        >
          <view class="detailListItem">
            <view class="skuItem">
              <SkuItem
                  extra-width="100px"
                  :sku-result="item.skuResult"
              >
                <template slot="otherData">
                  <view class="number">
                    采购 {{ item.purchaseNumber || 0 }} 个，到货 {{ item.arrivalNumber || 0 }} 个
                  </view>
                  <view class="inStockNumber">
                    入库 {{ item.inStockNumber || 0 }} 个，
                    <span :style="{color:isArray(item.bindPositions).length <= 0 && 'red'}">
                      库位：
                      {{
                        isArray(item.bindPositions).length > 0 ? isArray(item.bindPositions).map(positionBindItem => positionBindItem.name).join('、') : '未绑定库位'
                      }}
                   </span>
                  </view>
                </template>
              </SkuItem>
            </view>
            <ShopNumber :min="0" :value="item.number" @onChange="(number)=>updateSkuListNumber(number,item)" />
          </view>

          <view class="action" @click="oneInStock(item)">
            单独入库
          </view>

        </view>
      </view>

    </view>

    <uni-popup ref="inputDialog" type="dialog">
      <uni-popup-dialog
          title="是否进行入库操作?"
          mode="input"
          confirmText="确认入库"
          @confirm="confirm"
      >
        入库数量：
        <ShopNumber
            :value="inStockItem.number"
            @onChange="(value)=>inStockItem.number = value"
        />
      </uni-popup-dialog>
    </uni-popup>

    <Loading :loading="submitLoading" />

    <BottomButton
        only=""
        text="一键入库"
        @onClick="inStock"
    />
  </view>
</template>

<script>
import Card from "../../../components/Card";
import LinkButton from "../../../components/LinkButton";
import Empty from "../../../components/Empty";
import BottomButton from "../../../components/BottomButton";
import Popup from "../../../components/Popup";
import {InStock} from "MES-Apis/lib/InStock/promise";
import List from "../../../components/List/indx";
import SkuItem from "../../../components/SkuItem";
import ShopNumber from "../../../components/ShopNumber";
import Search from "../../../components/Search";
import {isArray, queryString, safeAreaHeight} from "../../../util/Tools";
import Loading from "../../../components/Loading";
import {SkuResultSkuJsons} from "../../../Sku/sku";
import {Message} from "../../../components/Message";
import {Init} from "MES-Apis/lib/Init";
import {Sku} from "MES-Apis/lib/Sku/promise";
import Elliptsis from "../../../components/Ellipsis";

export default {
  name: 'InStockAsk',
  components: {Elliptsis, Loading, Search, ShopNumber, SkuItem, List, Popup, BottomButton, Empty, LinkButton, Card},
  props: ['order'],
  data() {
    return {
      safeAreaHeight,
      loading: false,
      inStockItem: 0,
      InStock,
      list: [],
      listAll: [],
      searchValue: '',
      isArray,
      percentage: 0,
      submitLoading: false
    }
  },
  mounted() {
    this.getDetailList(this.order.orderId);
  },
  methods: {
    async confirm() {
      this.submitLoading = true
      await this.submit(true, this.inStockItem)
      this.submitLoading = false
    },
    oneInStock(item) {
      this.$refs.inputDialog.open()
      this.inStockItem = item
    },
    onSearch(value) {
      this.list = this.listAll.filter(item => {
        const sku = SkuResultSkuJsons({skuResult: item.skuResult}) || '';
        return queryString(value, sku);
      })
    },
    onCheck(order) {
      this.searchValue = ''
      this.getDetailList(order.orderId)
      this.order = order
      this.show = false
    },
    async getDetailList(orderId) {
      this.loading = true
      const res = await InStock.showOrderDetailListV2_0({
        data: {orderId}
      })

      const skuMediaUrls = await Sku.getMediaUrls({
        mediaIds: isArray(res.data).map(item => item.skuResult?.images?.split(',')[0]),
        option: 'image/resize,m_fill,h_74,w_74',
      })

      let purchaseNumber = 0
      let inStockNumber = 0

      const data = isArray(res.data).map(item => {
        const media = isArray(skuMediaUrls.data).find(mediaItem => mediaItem.mediaId === item.skuResult?.images?.split(',')[0]) || {};
        purchaseNumber += item.purchaseNumber
        inStockNumber += (item.inStockNumber || 0)
        return {
          ...item,
          number: item.purchaseNumber - (item.inStockNumber || 0) > 0 ? item.purchaseNumber - (item.inStockNumber || 0) : 0,
          skuResult: {...item.skuResult, thumbUrl: media.thumbUrl}
        }
      })
      this.percentage = Math.round((inStockNumber / purchaseNumber) * 100) || 0

      this.list = data
      this.listAll = data
      this.loading = false
    },
    updateSkuListNumber(number, detailListItem) {
      this.list = this.list.map((item) => {
        if (item.detailId === detailListItem.detailId) {
          return {...item, number: number}
        }
        return item
      })

      this.listAll = this.listAll.map((item) => {
        if (item.detailId === detailListItem.detailId) {
          return {...item, number: number}
        }
        return item
      })
    },
    inStock() {
      const _this = this
      Message.dialog({
        title: '是否执行一键入库操作？',
        confirmText: '开始入库',
        only: false,
        onConfirm: () => {
          return _this.submit()
        },
        onCancel: () => {

          return true
        }
      })
    },
    submit(one, sku) {
      return new Promise((resolve) => {
        InStock.autoInStockV2_0({
          data: {
            orderId: this.order.orderId,
            detailParams: one ? [{
              detailId: sku.detailId,
              number: sku.number,
              skuId: sku.skuId,
              customerId: sku.customerId,
              brandId: sku.brandId
            }] : this.listAll.map((item) => {
              return {
                detailId: item.detailId,
                number: item.number,
                skuId: item.skuId,
                customerId: item.customerId,
                brandId: item.brandId
              }
            }).filter(item => item.number > 0)
          }
        }).then((res) => {
          resolve(true)
          Message.dialog({
            content: '入库完成！',
            confirmText: '查看凭证',
            cancelText: '返回',
            only: false,
            onConfirm: () => {
              uni.redirectTo({
                url: `/Erp/InStock/InStockVoucher/index?taskId=${res.data}`
              })
              return true
            },
            onCancel: () => {
              uni.navigateBack();
              return true
            }
          })
        }).catch(() => {
          const message = Init.getNewErrorMessage()
          if (message) {
            Message.dialog({
                  title: message
                }
            )
          }
          resolve(true)
        })
      })
    }
  }
}
</script>

<style lang="scss">

.header {
  display: flex;
  flex-direction: column;
  gap: 4px;

  .headerItem {
    display: flex;
    align-items: flex-end;
  }
}

.selectOrder {
  height: 100vh;
  background-color: #fff;
}

.detailListItem {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-bottom: solid 1px #f5f5f5;
  background-color: #fff;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;

  .skuItem {
    flex-grow: 1;
  }
}

.label {
  width: 60px;
  text-align: justify;
  text-align-last: justify;
  display: inline-block;
  color: #9d9d9d;
}

.number {
  margin-top: 2px;
  color: $primary-color;
  max-width: calc(100vw - 74px - 13px - 100px);
}

.inStockNumber {
  color: $success-color;
  max-width: calc(100vw - 74px - 13px - 100px);
}

.action {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 24px;
  border-top: solid 1px #F5F5F5;
  padding: 8px;
  background-color: #fff;
  margin-bottom: 4px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  //font-size: 16px;
  font-weight: bold;
  color: $primary-color;
}

.detail {
  background-color: $body-color;
  padding: 4px;
}
</style>
