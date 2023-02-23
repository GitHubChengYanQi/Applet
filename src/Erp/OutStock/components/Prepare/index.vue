<template>
  <view>
    <Loading :loading="loading" />
    <view class='header'>
      {{ allocation ? '调拨' : '备料' }}
    </view>

    <view class='skuItem'>
      <view class='item'>
        <SkuItem
            imgId='pickSkuImg'
            :number='skuItem.stockNumber'
            :skuResult='skuResult()'
            extraWidth='124px'
            :otherData="[skuItem.brandResult && skuItem.brandResult.brandName || '任意品牌',allocation ? skuItem.positionName : '']"
        />
      </view>
      <view class='scan'>
        <view>x {{
            allocation ? skuItem.number : skuItem.number - parseInt(skuItem.receivedNumber || 0) - skuItem.perpareNumber
          }}
        </view>
      </view>
    </view>

    <view style="padding-bottom: 60px">
      <StockContent
          :allocation='allocation'
          :storehousePositionsId='allocation && skuItem.positionId'
          :inkindRef='inkindRef'
          :customerId='skuItem.customerId'
          :brandId="allocation ? skuItem.brandId : skuItem.brandId && !['0', 0].includes(skuItem.brandId) ? skuItem.brandId : null"
          :pickId='pickId'
          :pickListsDetailId='skuItem.pickListsDetailId'
          :skuId='skuItem.skuId'
          :outStockNumber='allocation ? skuItem.number : skuItem.number - parseInt(skuItem.receivedNumber || 0) - skuItem.perpareNumber'
          @onChange="(array)=>outStockSkus = [...array]"
      />
    </view>

    <BottomButton
        @leftOnClick="$emit('onClose')"
        :rightDisabled='outStockSkus.length === 0'
        rightText='确定'
        @rightOnClick='save'
    />
  </view>
</template>

<script>
import SkuItem from "../../../Sku/components/SkuItem";
import BottomButton from "../../../../components/BottomButton";
import StockContent from "../StockContent";
import {OutStock} from "MES-Apis/src/OutStock/promise";
import {Message} from "../../../../components/Message";
import Loading from "../../../../components/Loading";

export default {
  name: 'PrePare',
  components: {Loading, StockContent, BottomButton, SkuItem},
  props: [
    'pickId',
    'skuItem',
    'taskId',
    'allocation',
  ],
  data() {
    return {
      inkindRef: null,
      outStockSkus: [],
      loading: false
    }
  },
  methods: {
    scanClick() {
      // inkindRef.current.open({
      //   skuId: skuItem.skuId,
      //   brandId: skuItem.brandId,
      //   positionId: allocation && skuItem.positionId,
      //   skuResult,
      // });
    },
    skuResult() {
      const sku = this.skuItem.skuResult || {};
      return {
        spuResult: {
          name: sku.spuName,
        },
        skuName: sku.skuName,
        specifications: sku.specifications,
        imgResults: this.skuItem.imgUrl ? [{thumbUrl: this.skuItem.imgUrl}] : [],
      }
    },
    addShop() {
      const skuItem = this.skuItem
      this.$emit('onClose')
      // const imgUrl = ToolUtil.isArray(skuResult.imgResults)[0]?.thumbUrl || state.homeLogo;
      // addShopCart(imgUrl, 'pickSkuImg');
      setTimeout(()=>{
        let number = 0;
        this.outStockSkus.forEach(item => number += item.number);
        this.$emit('onSuccess', {...skuItem, number})
      },500)
    },
    cartAdd(warning) {
      const current = this
      this.loading = true
      OutStock.cartAdd({productionPickListsCartParams: this.outStockSkus, taskId: this.taskId, warning}, {
        onSuccess: (res) => {
          if (res.errCode === 1001) {
            Message.dialog({
              only: false,
              content: '本次操作会影响其他出库单相同物料备料!',
              confirmText: '继续备料',
              cancelText: '取消备料',
              onConfirm: () => {
                current.cartAdd(true);
                return true
              },
            });
          } else {
            current.addShop();
          }
        }
      }).finally(() => {
        this.loading = false
      });
    },
    save() {
      if (this.allocation) {
        this.$emit('onSuccess', this.outStockSkus)
        return;
      }
      this.cartAdd(false);
    }
  }
}
</script>

<style lang="scss">
.addButton {
  margin-top: 8px;
}

.header {
  font-size: 18px;
  padding: 12px;
  text-align: center;
  border-bottom: 1px solid #EEEEEE;
}

.skuItem {
  display: flex;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #EEEEEE;

  .item {
    flex-grow: 1;
  }

  .scan {
    gap: 8px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}

.content {
  padding: 12px;
}

.count {
  padding: 12px;
  text-align: right;
}
</style>
