<template>
  <view>
    <view class="stock">
      <view class="stockSearch">
        <Search placeholder="请输入物料相关信息" :value="value" @onSearch="onSearch"/>
      </view>
      <view v-if="!loading" class="skuClass">
        <scroll-view scroll-x="true" class="scroll-view">
          <view :class="{classItem:true, choose:!screenData.categoryId}" @click="clickSkuClass(null)">
            全部
          </view>
          <view
              v-for="(item,index) in skuClass"
              :key="index"
              :class="{classItem:true, choose:screenData.categoryId === item.value}"
              @click="clickSkuClass(item.value)"
          >
            {{ item.label }}
          </view>
        </scroll-view>
      </view>
      <view class="content">
        <List
            ref="skuList"
            :list="skuList"
            :max-height="`calc(100vh - 103px - ${70 + safeAreaHeight(this)}px)`"
            @request="Sku.listV1_1"
            @listSource="listSource"
            :default-params="{inStock: 1}"
        >
          <view
              v-for="(item,index) in skuList"
              :key="index"
              class="skuItem"
          >
            <view class="sku">
              <SkuItem extra-width="150px" :sku-result="skuResultFormat(item)">
                <template slot="otherData">
                  单价：￥{{ item.outPrice / 100 || 0 }}
                </template>
              </SkuItem>
            </view>
            <ShopNumber
                actionShow
                :min="0"
                :value="skuNumber(item)"
                @click="visible = true;clickSku=item;clickSkuIndex=index"
            />
          </view>
        </List>
      </view>

      <view class="bottomButton" :style="{paddingBottom:`${safeAreaHeight(this)}px`}">
        <view class="cart" @click="show = !show">
          <view class="cartCount">
            <view class="badge">
              <u-badge max="99" :value="shopList.length"/>
            </view>
            <u-icon size="30" name="shopping-cart"/>
            已选
          </view>
        </view>
        <view class='button' @click="complete">
          <u-button type="primary">
            确定
          </u-button>
        </view>
      </view>

      <uni-fab :popMenu="false" horizontal="right" @fabClick="fabClick"/>

      <Popup
          @close="show = false"
          :show="show"
          title="已选物料"
      >
        <view class="checkSkuList">
          <Empty v-if="shopList.length === 0"/>
          <view
              v-for="(item,index) in shopList"
              :key="index"
              class="skuItem"
          >
            <view class="sku">
              <SkuItem
                  extra-width="150px"
                  :sku-result="item.skuResult"
              >
                <template slot="otherData">
                  单价：￥{{ item.skuResult ? item.skuResult.outPrice / 100 : 0 }}
                </template>
              </SkuItem>
            </view>
            <view class="shopActions">
              <u-icon name="trash" color="#dd524d" size="20" @click="onChange(0,item,index)"/>
              <ShopNumber
                  action-show
                  :min="0"
                  :value="item.number"
                  @click="onClickSku(item,index)"
              />
            </view>
          </view>
        </view>
      </Popup>

      <keybord
          :visible='visible'
          @close="visible = false"
          :value='skuNumber(clickSku)'
          :min='0'
          :max="clickSku.stockNum"
          @onChange="(num)=>onChange(num,clickSku,clickSkuIndex)"
      />


      <Modal ref="modal"/>

      <Loading :loading="shopLoading"/>

    </view>
  </view>

</template>

<script>
import SkuItem from '../../../components/SkuItem'
import Search from "../../../components/Search";
import List from "../../../components/List/index";
import {Sku} from "MES-Apis/lib/Sku/promise";
import {isArray, safeAreaHeight} from "@/util/Tools";
import Loading from "../../../components/Loading";
import ShopNumber from "../../../components/ShopNumber/index.vue";
import Popup from "@/components/Popup/index.vue";
import Empty from "@/components/Empty/index.vue";
import {Erp} from "MES-Apis/lib/Erp/promise";
import Modal from "@/components/Modal/index.vue";
import {Init} from "MES-Apis/lib/Init";
import Keybord from "@/components/Keybord/index.vue";

const shopType = 'crmOutStock'
export default {
  props: ['storeId'],
  options: {
    styleIsolation: 'shared'
  },
  name: 'Stock',
  components: {Keybord, Modal, Empty, Popup, ShopNumber, Loading, List, Search, SkuItem},
  data() {
    return {
      safeAreaHeight,
      value: '',
      eventName: 'stock',
      Sku,
      skuList: [],
      skuImages: [],
      skuClass: [],
      loading: false,
      screenData: {},
      show: false,
      shopLoading: false,
      shopList: [],
      visible: false,
      clickSku: {},
      clickSkuIndex: 0
    }
  },
  computed: {},
  mounted() {
    this.getShopList()

    const _this = this;
    _this.getSkuClass()

    uni.$on('skuAddSuccess', _ => {
      _this.getSkuClass()
      _this.refreshList({})
    })
  },
  methods: {
    onClickSku(clickSku, clickSkuIndex) {
      this.visible = true
      this.clickSku = {...clickSku, stockNum: clickSku.skuResult.stockNumber}
      this.clickSkuIndex = clickSkuIndex
    },
    onSearch(value) {
      this.refreshList({keyWord: value})
      this.value = value
    },
    async getSkuClass() {
      this.loading = true
      await Sku.spuClassListSelect({data: {}}).then((res) => {
        this.skuClass = res.data || []
      }).finally(() => {
        this.loading = false
      })
    },
    skuResultFormat(item) {
      const media = this.skuImages.find(mediaItem => mediaItem.mediaId === item.images?.split(',')[0]) || {}
      return {
        ...item,
        thumbUrl: media.thumbUrl
      }
    },
    async listSource(skuList, newSkuList) {
      this.skuList = skuList
      if (newSkuList.length > 0) {
        await Sku.getMediaUrls({
          mediaIds: newSkuList.map(item => item.images?.split(',')[0]),
          option: 'image/resize,m_fill,h_74,w_74',
        }).then((res) => {
          isArray(res?.data).map(item => {
            this.skuImages.push(item)
          })
        }).catch(() => {
        })
      }
    },
    clickSkuClass(checkSkuClass) {
      this.refreshList({categoryId: checkSkuClass})
    },
    refreshList(data) {
      const newScreenData = {
        ...this.screenData,
        ...data,
        inStock: 1
      }
      this.screenData = newScreenData
      this.$refs.skuList.submit(newScreenData)
    },
    async refresh() {
      await this.$refs.skuList.submit(this.screenData)
      await this.getSkuClass()
      uni.stopPullDownRefresh();
    },
    fabClick() {
      uni.navigateTo({
        url: '/Sku/SkuAdd/index'
      })
    },
    complete() {
      uni.navigateBack()
    },
    async getShopList() {
      this.shopLoading = true
      const res = await Erp.shopCartApplyList({
        data: {type: shopType}
      })
      uni.$emit('shopCartApplyList', res.data || [])
      this.shopList = res.data || []
      this.shopLoading = false
    },
    skuNumber(sku) {
      return this.shopList.find(item => item.skuId === sku.skuId)?.number || 0
    },
    async onChange(number, sku) {
      this.shopLoading = true
      const shopSku = this.shopList.find(item => item.skuId === sku.skuId)
      if (number === 0) {
        if (shopSku) {
          await Erp.shopCartDelete({
            data: {ids: [shopSku.cartId]}
          }).catch(() => {
            this.$refs.modal.dialog({
              title: Init.getNewErrorMessage() || '修改失败！'
            })
          })
        } else {
          return
        }
      } else if (shopSku) {
        await Erp.shopCartEdit({
          data: {
            cartId: shopSku.cartId,
            number
          }
        }).catch(() => {
          this.$refs.modal.dialog({
            title: Init.getNewErrorMessage() || '修改失败！'
          })
        })
      } else {
        await Erp.shopCartAdd({
          data: {
            skuId: sku.skuId,
            number,
            type: shopType
          }
        }).catch(() => {
          this.$refs.modal.dialog({
            title: Init.getNewErrorMessage() || '添加失败！'
          })
        })
      }
      this.getShopList()
    }
  }
}
</script>

<style lang="scss">

.navBar {
  .uni-navbar__header {

    > view {
      align-items: flex-end;
    }
  }

  .uni-navbar__content {
    border: none;
  }

  .navLeft {
    font-size: 18px;
    font-weight: bold;
    display: flex;
    align-items: center !important;
    gap: 8px;
    padding-bottom: 9px;
  }
}

.stock {
  background-color: #FFFFFF;
  overflow-x: hidden;
}

.skuClass {
  background-color: $body-color;
}

.stockSearch {
  padding: 0 12px;
}

.scroll-view {
  display: flex;
  justify-content: flex-start;
  white-space: nowrap;
  width: 100%;
  padding: 8px;
}

.classItem {
  display: inline-block;
  padding: 0 8px;
  text-align: center;
  margin: 0 8px;
}

.choose {
  background-color: #257BDE;
  border-radius: 50px;
  color: #fff;
  padding: 4px 12px;
}

.content {

}

.skuItem {
  padding: 8px 12px;
  border-bottom: solid 1px #eee;
  display: flex;
  align-items: center;

  .sku {
    flex-grow: 1;
  }
}

.bottomButton {
  padding: 0 12px;
  z-index: 5;
  width: calc(100% - 24px);
  position: fixed;
  display: flex;
  bottom: 0;
  left: auto;
  right: auto;
  align-items: center;
  background-color: #fff;
  box-shadow: 0 -4px 10px 0 rgba(0, 0, 0, 0.1);
  flex-wrap: wrap;
  height: 70px;

  .cartCount {
    min-width: 100px;
    display: flex;
    align-items: center;
    flex-direction: column;
    position: relative;

    .badge {
      position: absolute;
      top: 0;
      right: 30px;
    }
  }


  .button {
    flex-grow: 1;

    button {
      border-radius: 50px;
      width: 100%;
      height: 40px;
    }
  }
}

.uni-fab__circle {
  bottom: 130px !important;
}

.checkSkuList {
  max-height: 50vh;
  overflow: auto;
}

.shopActions {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: flex-end;
}
</style>
