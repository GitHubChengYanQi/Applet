<template>
  <view>
    <Loading :loading="createCodeLoading" />
    <view class='myPicking'>
      <view class='content'>
        <view class='top'>
          <view class='skuNumber'>
            可领物料：
            <span class='blue'>{{ data.length }}</span>类
            <span class='blue'>{{ checkData().total }}</span>件
          </view>
          <view>
            <LinkButton @click="select">
              <van-icon name="location-o" />
              {{ storehouse.name || '全部' }} >
            </LinkButton>
          </view>
        </view>
      </view>
      <van-empty v-if="data.length === 0" />
      <OutItem
          v-for="(item,index) in data"
          extraWidth='180px'
          :action='storehouse.storehouseId'
          :key='index'
          :skuItem="{ ...item, skuResult:itemSkuResult(item) }"
          :skuIndex='index'
          @dataChange='dataChange'
      />
      <div class='bottom' v-if="storehouse.storehouseId">
        <div class='all' @click="checkAll">
          <van-checkbox
              :value="data.length === checkData().checkSku.length"
              shape="square"
          >
            {{ data.length === checkData().checkSku.length ? '取消全选' : '全选' }}
          </van-checkbox>
          <span>已选中 {{ checkData().checkSku.length }} 类</span>
        </div>
        <van-button
            custom-class="button"
            :disabled='checkData().checkSku.length === 0'
            type='info'
            @click="click"
        >
          确认
        </van-button>
      </div>
    </view>
  </view>
</template>

<script>
import {OutStock} from "MES-Apis/src/OutStock/promise";
import LinkButton from "../../../../components/LinkButton";
import OutItem from "./components";
import Loading from "../../../../components/Loading";
import {Sku} from "MES-Apis/src/Sku/promise";
import {isArray} from "@/util/Tools";

export default {
  name: 'MyPicking',
  components: {Loading, OutItem, LinkButton},
  props: ['pickListsId'],
  data() {
    return {
      loading: false,
      createCodeLoading: false,
      data: [],
      details: [],
      skuMediaUrls: [],
      storehouse: {},
    }
  },
  mounted() {
    this.getCartDetail();
  },
  methods: {
    getCartDetail() {
      this.loading = true
      OutStock.getOutStockCarts({
        pickListsId: this.pickListsId
      }, {
        onSuccess: (res) => {
          this.details = res.data
          this.initData(res.data);
        }
      }).finally(() => {
        this.loading = false
      })
    },
    initData(res, storehouseId) {
      Sku.getMediaUrls({
        mediaIds: isArray(res).map(item => item.skuResult?.images?.split(',')[0]),
        option: 'image/resize,m_fill,h_74,w_74',
      }, {
        onSuccess: (res) => {
          this.skuMediaUrls = res.data
        }
      })
      const newData = [];
      const newStorehouse = [];
      let total = 0;
      isArray(res).forEach(item => {
        const cartResults = item.cartResults || [];
        let collectable = 0;
        cartResults.forEach(cartItem => {
          if (storehouseId) {
            if (storehouseId === cartItem.storehouseId) {
              collectable += cartItem.number;
            }
          } else {
            const storeIds = newStorehouse.map(item => item.storehouseId);
            const storeIndex = storeIds.indexOf(cartItem.storehouseId);
            if (storeIndex === -1) {
              newStorehouse.push({
                ...cartItem.storehouseResult,
                type: [item.pickListsDetailId],
                number: cartItem.number,
              });
            } else {
              const store = newStorehouse[storeIndex];
              const type = store.type || [];
              newStorehouse[storeIndex] = {
                ...store,
                type: type.includes(item.pickListsDetailId) ? type : [...type, item.pickListsDetailId],
                number: Number(store.number) + Number(cartItem.number),
              };
            }
            collectable += cartItem.number;
          }
        });
        if (collectable > 0) {
          total += collectable;
          newData.push({
            ...item,
            key: item.pickListsDetailId,
            collectable,
            outNumber: collectable,
            checked: false,
          });
        }
      });
      if (storehouseId) {
        this.data = newData
        return
      }
      if (newStorehouse.length === 1) {
        this.storehouse = newStorehouse[0]
      }
      this.stores = newStorehouse
      this.data = newData
      return {
        type: newData.length,
        total,
      };
    },
    dataChange(key, params) {
      this.data = this.data.map(item => {
        if (item.key === key) {
          return {...item, ...params};
        } else {
          return item;
        }
      })
    },
    itemSkuResult(item) {
      const media = isArray(this.skuMediaUrls).find(mediaItem => mediaItem.mediaId === item.skuResult?.images?.split(',')[0]);
      const itemSku = item.skuResult || {};
      return {
        spuResult: {
          name: itemSku.spuName,
        },
        skuName: itemSku.skuName,
        specifications: itemSku.specifications,
        imgResults: media ? [{thumbUrl: media.thumbUrl}] : [],
        stockNumber:itemSku.stockNum
      }
    },
    checkData() {
      let total = 0;
      const checkSku = [];
      this.data.forEach(item => {
        total += item.collectable;
        if (item.checked) {
          checkSku.push(item);
        }
      });
      return {
        total,
        checkSku
      }
    },
    click() {
      const cartIds = []
      const cartsParams = [];
      this.checkData().checkSku.map(skuItem => {
        const cartResults = skuItem.cartResults || [];
        const brandIds = [];
        cartResults.forEach(item => {
          if (!brandIds.includes(item.brandId)) {
            brandIds.push(item.brandId || '0');
          }
          if (item.storehouseId === this.storehouse.storehouseId) {
            cartIds.push(item.pickListsCart)
          }

          cartsParams.push({
            storehouseId: this.storehouse.storehouseId,
            skuId: skuItem.skuId,
            pickListsId: skuItem.pickListsId,
            number: skuItem.outNumber,
            brandIds,
          });
        });
      });
      this.createCodeLoading = true
      OutStock.createPickCodeV2_0({
        cartIds,
        cartsParams,
      }, {
        onSuccess: (res) => {
          this.$emit('onSuccess', res.data)
        }
      }).finally(() => {
        this.createCodeLoading = false
      })
    },
    checkAll() {
      this.data = this.data.map(item => ({...item, checked: !(this.data.length === this.checkData().checkSku.length)}))
    },
    select() {
      const current = this
      const list = this.stores.map(item => {
        const type = item.type || [];
        return {
          text: item.name + '（可领' + type.length + '类' + item.number + '件）',
          key: item.storehouseId, name: item.name,
        };
      })
      uni.showActionSheet({
        itemList: list.map(item => item.text),
        success(res) {
          // 选择其中任意一项后，获取其索引（res.tapIndex），从0开始
          current.initData(current.details, list[res.tapIndex].key);
          current.storehouse = {name: list[res.tapIndex].text, storehouseId: list[res.tapIndex].key}
        },
      })
    }
  },
}
</script>

<style lang="scss">
.myPicking {
  background-color: #fff;
  display: flex;
  flex-direction: column;

  .content {
    flex-grow: 1;
    overflow: auto;
    max-height: 80vh;

    .top {
      position: sticky;
      top: 0;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #E1EBF6;
      padding: 8px 12px;
      z-index: 1;
      background-color: #fff;

      .skuNumber {
        flex-grow: 1;
      }
    }
  }

  .status {
    display: flex;
    align-items: center;

    .statusItem {
      margin-left: 8px;
      display: flex;
      align-items: center;

      .radius {
        width: 8px;
        height: 8px;
        border-radius: 100%;
        margin: 4px;
      }
    }
  }

  .bottom {
    background-color: $body-color;
    display: flex;
    height: 48px;
    align-items: center;
    padding-right: 12px;

    .all {
      flex-grow: 1;
      display: flex;
      align-items: center;
      font-size: 14px;
      gap: 8px;
      padding: 12px;

      :global .adm-checkbox {
        --icon-size: 18px;
        --font-size: 14px;
      }
    }
  }
}

.button {
  padding: 4px 12px !important;
  font-size: 14px !important;
  border-radius: 2px !important;
  height: fit-content !important;
}
</style>
