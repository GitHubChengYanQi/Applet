<template>
  <view>
    <Loading v-if="loading" :skeleton="true" />
    <view v-else class='action'>
      <van-empty v-if="brands.length === 0" description="暂无库存" />
      <view
          v-for="(item,index) in brands"
          :key="index"
          :class="['position', !item.show ? 'defaultPosition' : 'show']"
      >
        <view @click="brandClick(item,index)" class='brandName'>
          <van-icon name="medal-o" />
          {{ item.brandName }} ({{ item.num }})
        </view>
        <view v-if="item.show" class='allBrands'>
          <view
              v-for="(positionItem, positionIndex) in (item.positionsResults || [])"
              :class="['brands', positionItem.checked && 'checked']"
              :key='positionIndex'
          >
            <view class='positionName' @click="()=>positionClick(positionItem,positionIndex,index)">
              <van-checkbox :value="positionItem.checked" shape="square" />
              <span class='name'>{{ positionItem.name }} ({{ positionItem.number }})</span>
            </view>

            <view v-if="positionItem.checked">
              <ShopNumber
                  :min="0"
                  :value="positionItem.outStockNumber"
                  @onChange="(num)=>numberChange(num,positionItem,positionIndex,index)"
              />
            </view>

          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import {isArray} from "../../../../util/Tools";
import {Message} from "../../../../components/Message";
import {OutStock} from "MES-Apis/lib/OutStock/promise";
import Loading from "../../../../components/Loading";
import ShopNumber from "../../../../components/ShopNumber";

export default {
  name: 'StockContent',
  components: {ShopNumber, Loading},
  props: [
    'pickId',
    'pickListsDetailId',
    'skuId',
    'customerId',
    'brandId',
    'outStockNumber',
    'className',
    'storehouseId',
    'allocation',
    'inkindRef',
    'storehousePositionsId',
  ],
  data() {
    return {
      brands: [],
      positions: [],
      loading: false
    }
  },
  watch: {
    skuId(skuId) {
      if (!skuId) {
        return
      }
      this.getPositionsAndBrands()
    }
  },
  methods: {
    getPositionsAndBrands() {
      this.loading = true
      OutStock.getPositionsAndBrands({
        skuId: this.skuId,
        brandId: this.brandId,
        storehousePositionsId: this.storehousePositionsId,
        storehouseId: this.storehouseId
      }, {
        onSuccess: (res) => {
          const brands = isArray(res.data);
          const newBrands = brands.map((item) => {
            const positions = item.positionsResults || [];
            const show = brands.length === 1;
            return {
              ...item,
              show,
              positionsResults: positions.map(item => {
                const checked = show && positions.length === 1;
                const number = (checked && show) ? ((typeof this.outStockNumber === 'number' && item.number > this.outStockNumber) ? this.outStockNumber : item.number) : 0;
                return {...item, checked, outStockNumber: number};
              }),
            };
          });
          this.brands = newBrands
          this.outSkuChange(newBrands);
        }
      }).finally(() => {
        this.loading = false
      })
    },
    outNumber() {
      let outNumber = 0
      this.brands.map(item => {
        const positions = item.positionsResults || [];
        return positions.map(item => outNumber += (item.outStockNumber || 0));
      });
      return outNumber
    },
    outSkuChange(newPosition) {
      const array = [];
      newPosition.map(item => {
        const positions = item.positionsResults || [];
        return positions.map((positionItem) => {
          if (positionItem.outStockNumber > 0) {
            const data = {
              skuId: this.skuId,
              pickListsDetailId: this.pickListsDetailId,
              storehouseId: positionItem.storehouseId,
              storehousePositionsId: positionItem.storehousePositionsId,
              brandId: item.brandId || 0,
              customerId: this.customerId,
              number: positionItem.outStockNumber,
              pickListsId: this.pickId,
            }
            if (isArray(positionItem.inkinds).length > 0) {
              isArray(positionItem.inkinds).forEach(inkindItem => {
                array.push({...data, inkindId: inkindItem.inkindId, number: inkindItem.number});
              });
            } else {
              array.push(data);
            }

          }
          return null;
        });
      });
      this.$emit('onChange', array)
    },
    brandChange(currentIndex, data) {
      const newBrands = this.brands.map((item, index) => {
        if (index === currentIndex) {
          return {...item, ...data};
        }
        return item;
      });
      this.brands = newBrands
      this.outSkuChange(newBrands);
    },
    positionChange(positionIndex, brandIndex, data) {
      const newBrands = this.brands.map((item, index) => {
        if (index === positionIndex) {
          const positions = item.positionsResults || [];
          const newPositions = positions.map((item, index) => {
            if (index === brandIndex) {
              return {...item, ...data};
            }
            return item;
          });
          return {...item, positionsResults: newPositions};
        }
        return item;
      });
      this.brands = [...newBrands]
      this.outSkuChange(newBrands);
    },
    brandClick(item, index) {
      let positionsResults = item.positionsResults || [];
      if (item.show) {
        positionsResults = positionsResults.map(item => {
          return {...item, outStockNumber: 0, checked: false};
        });
      }
      this.brandChange(index, {show: !item.show, positionsResults});
    },
    positionClick(positionItem, positionIndex, index) {
      if (!positionItem.checked) {
        const num = typeof this.outStockNumber === 'number' ? (this.outStockNumber - (this.outNumber() + positionItem.number)) > 0 ? positionItem.number : (this.outStockNumber - this.outNumber()) : positionItem.number;
        this.positionChange(index, positionIndex, {checked: true, outStockNumber: num});
      } else {
        this.positionChange(index, positionIndex, {checked: false, outStockNumber: 0});
      }
    },
    numberChange(num, positionItem, positionIndex, index) {
      let number = 0;
      this.brands.map((pItem, pIndex) => {
        const positions = pItem.positionsResults || [];
        const newPositions = positions.filter((bIten, bIndex) => {
          return !(pIndex === index && bIndex === positionIndex);
        });
        return newPositions.map(item => number += (item.outStockNumber || 0));
      });
      if (typeof this.outStockNumber === 'number' && (number + num) > this.outStockNumber) {
        Message.toast(`不能超过${this.allocation ? '调拨' : '出库'}数量！`)
        return;
      }
      if (num > positionItem.num) {
        Message.toast('不能超过库存数量！')
        return;
      }
      this.positionChange(index, positionIndex, {outStockNumber: num, inkinds: []});
    }
  }
}
</script>

<style lang="scss">

.action {
  padding: 12px;
  max-height: 50vh;
  overflow: auto;

  .storeHouseTitle {
    padding-bottom: 12px;
    font-weight: bold;

    .select {
      float: right;
      font-weight: normal;

      svg {
        color: $primary-color;
        font-size: 15px;
        margin-left: 4px;
      }
    }
  }

  .storehouse {
    border: 1px solid $body-color;
    margin-bottom: 12px;
  }

  .storeItem {
    display: flex;
    align-items: center;
    margin-bottom: 12px;

    button {
      margin: 0 16px 0 0;
      padding: 0;
      height: 30px;
      width: 50vw;
    }

    .number {
      height: 30px;
      line-height: 30px;
    }
  }

  .storehouseItem {
    padding: 12px;
    border-bottom: 1px solid $body-color;

    .remove {
      float: right;
    }
  }

  .position {
    border-radius: 2px;
    margin: 4px 0;
    border: 1px solid #D9D9D9;
    padding: 0 8px;

    .brandName {
      padding: 8px 0;
    }
  }

  .defaultPosition {
    border: 1px solid #D9D9D9;
  }

  .show {
    border: 1px solid $primary-color;
  }
}

.allBrands {
  //padding: 6px 0;
  padding-bottom: 8px;

  .storeBrands {
    background-color: $body-color;
    margin-bottom: 8px;
  }

  .storeBrandItem {
    padding: 8px;
    background-color: $body-color;
    display: flex;
    align-items: center;

    div {
      flex-grow: 1;
    }
  }

  .storeBrandPositions {
    //padding: 8px 0;
  }

  .brands {
    background-color: $body-color;
    display: flex;
    padding: 0 8px;
    margin-bottom: 2px;
    align-items: center;
    font-size: 14px;
    border-radius: 2px;
    gap: 8px;
    height: 36px;
    //line-height: 36px;

    .positionName {
      flex-grow: 1;
      display: flex;
      align-items: center;

      .name {
        padding-left: 8px;
      }
    }
  }

  .checked {
    //border: solid 1px var(--adm-Combox-primary);
  }
}

</style>
