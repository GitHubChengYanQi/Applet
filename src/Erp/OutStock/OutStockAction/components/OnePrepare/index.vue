<template>
  <view>
    <view v-if="loading">
      <Loading skeleton="" />
    </view>
    <van-empty v-else-if="defaultData.length === 0" description="物料全部出库完成" />
    <view class="onePrepare" v-else>
      <view style="padding: 0 8px">
        <Search
            placeholder='请输入物料名称查询'
            @onChange="(value)=> searchValue = value"
            @onSearch='search'
            :value="searchValue"
       />
      </view>
      <scroll-view
          :scroll-y="scroll"
          class="scroll-Y"
          @scrolltolower="lower"
      >
        <view
            v-for="(item,index) in data.filter((item, dataIndex) => dataIndex < showCount)"
            :key="item.pickListsDetailId"
        >
          <Slide
              :swipeId="'outStockItem'+index"
              :disabled="!action || !item.action"
              @onLeft="openPrepare(item)"
              @onRight="openPrepare(item)"
          >
            <OutStockItem
                :item="itemFormat(item)"
                :index='index'
                :dataLength='data.length - 1'
                :key={index}
                :received='item.received || 0'
                :collectable='item.collectable || 0'
                :notPrepared='item.notPrepared || 0'
                :success-percent="Number((((item.received || 0) / item.number)).toFixed(2)) * 100"
                :percent="Number((((item.collectable || 0) / item.number)).toFixed(2)) * 100"
            />
          </Slide>
        </view>
        <uni-load-more :status="hasMore ? moreStatus : 'noMore'"></uni-load-more>
      </scroll-view>
    </view>

    <van-popup
        :z-index="999"
        :show="show"
        position="bottom"
        @close="closePrepare"
    >
      <PrePare
          :taskId='taskId'
          :pickId='pickListsId'
          :skuItem='skuItem'
          @onSuccess="(detail)=>onPrepare(detail)"
          @onClose="closePrepare"
      />
    </van-popup>
  </view>
</template>

<script>
import Search from "../../../../../components/Search";
import {OutStock} from "MES-Apis/src/OutStock/promise";
import {outPickListFormatSort} from "../../index";
import {isArray, queryString} from "../../../../../util/Tools";
import {Sku} from "MES-Apis/src/Sku/promise";
import OutStockItem from "../../../components/OutStockItem";
import {SkuResultSkuJsons} from "../../../../Sku/sku";
import Loading from "../../../../../components/Loading";
import Slide from "../../../../../components/Slide";
import PrePare from "../../../components/Prepare";

export default {
  components: {PrePare, Slide, Loading, OutStockItem, Search},
  props: [
    'action',
    'pickListsId',
    'taskId',
    'positionIds'
  ],
  data() {
    return {
      loading: false,
      show: false,
      skuItem: {},
      showCount: 0,
      data: [],
      defaultData: [],
      hasMore: false,
      moreStatus: 'more',
      searchValue: ''
    }
  },
  watch: {
    show(show) {
      this.$store.commit('dialog/openChange', show)
    }
  },
  mounted() {
    if (!this.pickListsId) {
      return
    }
    this.getDetailList()
  },
  computed: {
    scroll() {
      return !this.$store.state.dialog.show
    }
  },
  methods: {
    outStockAction(newDefaultData) {
      let collectable = 0
      let received = 0

      newDefaultData.forEach(item => {
        collectable += item.collectable
        received += item.received
      })
      uni.$emit('outStockAction', {
        taskId: this.taskId,
        collectable: collectable,
        received: received
      })
    },
    openPrepare(item) {
      this.$emit('openPrepare')
      this.show = true
      this.skuItem = item
    },
    closePrepare() {
      this.$emit('closePrepare')
      this.show = false
      this.skuItem = {}
    },
    lower() {
      if (!this.hasMore || this.moreStatus === 'loading') {
        return
      }
      this.moreStatus = 'loading'
      this.getImgs(this.showCount + 10, 10, this.data);
      setTimeout(() => {
        this.moreStatus = 'more'
        const newData = this.data.filter((item, index) => index >= (this.showCount + 10) && index < (this.showCount + 20));
        this.hasMore = newData.length === 10
        this.showCount = this.showCount + 10
      }, 1000)
    },
    onPrepare(detail) {
      const format = (item) => {
        if (item.pickListsDetailId === detail.pickListsDetailId) {
          const received = Number(item.receivedNumber) || 0;
          const collectable = item.collectable + detail.number;
          const notPrepared = item.notPrepared - detail.number;
          const stockNumber = item.stockNumber - detail.number;
          const action = !(item.number === (received + collectable) || !(stockNumber));
          return {
            ...item,
            action,
            stockNumber,
            perpareNumber: collectable,
            notPrepared,
            collectable,
          };
        } else {
          return item;
        }
      };
      this.$store.dispatch('bouncing/jump', {
        name: 'outStockShop',
        after: () => {
          const newDefaultData = this.defaultData.map(format);
          const newData = this.data.map(format);
          this.defaultData = newDefaultData
          this.data = newData

          this.outStockAction(newDefaultData)
        }
      })
    },
    async getDetailList(data) {
      this.loading = true
      const res = await OutStock.outStockDetailList({
        pickListsId: this.pickListsId,
        ...data
      }).finally(() => {
        this.loading = false
      })

      const {array} = outPickListFormatSort(isArray(res.data), true);
      this.showCount = 10
      const newData = array.filter(item => {
        return this.searchSkuName(this.searchValue, item);
      });
      this.data = newData
      this.defaultData = array
      this.getImgs(0, 20, array);
      this.hasMore = newData.length > 10
    },
    searchSkuName(value, item) {
      const itemSku = item.skuResult || {};
      const skuResult = {
        spuResult: {
          name: itemSku.spuName,
        },
        skuName: itemSku.skuName,
        specifications: itemSku.specifications,
        imgResults: item.imgUrl ? [{thumbUrl: item.imgUrl}] : [],
      };
      const sku = SkuResultSkuJsons({skuResult}) || '';
      return queryString(value, sku);
    },
    async getImgs(startIndex, count, skus) {
      const {newSkus} = await Sku.loadSkuImgs({
        startIndex,
        count,
        skus,
        mediaIdKey: (item) => item.skuResult?.images?.split(',')[0],
      });
      this.data = newSkus
    },
    itemFormat(item) {
      const sku = item.skuResult || {};
      const skuResult = {
        spuResult: {
          name: sku.spuName,
        },
        skuName: sku.skuName,
        specifications: sku.specifications,
        imgResults: item.imgUrl ? [{thumbUrl: item.imgUrl}] : [],
        unitName: sku.unitName
      };
      return {...item, skuResult}
    },
    outStockAfter() {
      this.getDetailList()
    },
    refresh(returnSkus) {
      const format = (item) => {
        let number = 0;
        const skus = isArray(returnSkus).filter(returnSku => {
          const equal = returnSku.pickListsDetailId === item.pickListsDetailId;
          if (equal) {
            number += returnSku.number;
          }
          return equal;
        });
        if (skus.length > 0) {
          const received = Number(item.receivedNumber) || 0;
          const collectable = item.collectable - number;
          const notPrepared = item.notPrepared + number;
          const stockNumber = item.stockNumber + number;
          const action = !(item.number === (received + collectable) || !(stockNumber));
          return {
            ...item,
            action,
            stockNumber,
            perpareNumber: collectable,
            notPrepared,
            collectable,
          };
        } else {
          return item;
        }
      };
      const newData = this.data.map(format);
      const newDefaultData = this.defaultData.map(format);
      this.data = newData
      this.defaultData = newDefaultData
      this.outStockAction(newDefaultData)
    },
    search(value) {
      const newData = this.defaultData.filter(item => {
        return this.searchSkuName(value, item);
      });
      this.data = newData
      this.showCount = 10
      this.getImgs(0, 20, newData);
      this.hasMore = newData.length > 10
    }
  }
}
</script>

<style lang="scss">
.onePrepare {
  background-color: #fff;
  padding: 12px 0;
}

.scroll-Y {
  max-height: calc(100vh - 140px);
}
</style>
