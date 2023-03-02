<template>
  <view>
    <Card title="采购订单">
      <view v-if="order.orderId">
        <view class="header">
          <view>
            <span class="label">编码</span>：{{ order.coding }}
          </view>
          <view>
            <span class="label">主题</span>：{{ order.theme || '无' }}
          </view>
          <view>
            <span class="label">供应商</span>：供应商
          </view>
        </view>
      </view>
    </Card>
    <Card title="采购物料列表">
      <Search
          placeholder='请输入关键字搜索采购订单'
          :value="searchValue"
          @onChange="(value)=>searchValue = value"
          @onSearch="onSearch"
      />
      <view style="max-height: calc(100vh - 260px);overflow: auto">
        <Loading :skeleton="true" v-if="loading" />
        <Empty v-else-if="list.length === 0" description="暂无物料" />
        <view v-else>
          <view
              v-for="(item,index) in list"
              :key="index"
              @click="$emit('onCheck',item)"
              class="detailListItem"
          >
            <view class="skuItem">
              <SkuItem
                  extra-width="100px"
                  :sku-result="item.skuResult"
                  :other-data="[
                      isArray(item.bindPositions).length > 0 ? isArray(item.bindPositions).map(positionBindItem=>positionBindItem.name).join('、') : '未绑定库位'
                  ]"
              />
            </view>
            <ShopNumber :min="0" :value="item.purchaseNumber" @onChange="(number)=>updateSkuListNumber(number,item)" />
          </view>
        </view>

      </view>
    </Card>

    <BottomButton
        only
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
import {InStock} from "MES-Apis/src/InStock/promise";
import List from "../../../components/List/indx";
import SkuItem from "../../Sku/components/SkuItem";
import ShopNumber from "../../../components/ShopNumber";
import Search from "../../../components/Search";
import {isArray, queryString} from "../../../util/Tools";
import Loading from "../../../components/Loading";
import {SkuResultSkuJsons} from "../../Sku/sku";
import {Message} from "../../../components/Message";
import {Init} from "MES-Apis/src/Init";
import {Sku} from "MES-Apis/src/Sku/promise";
import Toast from "../../../wxcomponents/toast/toast";

export default {
  name: 'InStockAsk',
  components: {Loading, Search, ShopNumber, SkuItem, List, Popup, BottomButton, Empty, LinkButton, Card},
  props: ['order'],
  data() {
    return {
      loading: false,
      InStock,
      list: [],
      listAll: [],
      searchValue: '',
      isArray
    }
  },
  mounted() {
    this.getDetailList(this.order.orderId);
  },
  methods: {
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

      const data = isArray(res.data).map(item => {
        const media = isArray(skuMediaUrls.data).find(mediaItem => mediaItem.mediaId === item.skuResult?.images?.split(',')[0]);
        return {
          ...item,
          skuResult: {...item.skuResult, thumbUrl: media.thumbUrl}
        }
      })

      this.list = data
      this.listAll = data
      this.loading = false
    },
    updateSkuListNumber(number, detailListItem) {
      this.list = this.list.map((item) => {
        if (item.detailId === detailListItem.detailId) {
          return {...item, purchaseNumber: number}
        }
        return item
      })

      this.listAll = this.listAll.map((item) => {
        if (item.skuId === detailListItem.skuId) {
          return {...item, purchaseNumber: number}
        }
        return item
      })
    },
    inStock() {
      Message.dialog({
        content: '是否执行一键入库操作？',
        confirmText: '开始入库',
        only: false,
        onConfirm: () => {
          return new Promise((resolve) => {
            InStock.autoInStockV2_0({
              data: {
                orderId: this.order.orderId,
                detailParams: this.listAll.map((item) => {
                  return {
                    detailId: item.detailId,
                    number: item.purchaseNumber,
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
        },
        onCancel: () => {

          return true
        }
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
}

.selectOrder {
  height: 100vh;
  background-color: #fff;
}

.detailListItem {
  display: flex;
  align-items: center;
  padding-bottom: 8px;

  .skuItem {
    flex-grow: 1;
  }
}

.label {
  width: 50px;
  text-align: justify;
  text-align-last: justify;
  display: inline-block;
  color: #9d9d9d;
}
</style>
