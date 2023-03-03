<template>
  <view>
    <Loading v-if="(loading && query.code) || outStockLoading" :skeleton="true" skeleton-type="page" />
    <view v-else>
      <view v-if="outSkus.length === 0">
        <Loading :loading="loading" />
        <view style="background-color: #fff; height: 100%">
          <CodeNumber open title='请输入领料码' @onSuccess="onSuccess" />
        </view>
      </view>
      <view v-else>
        <view class='skus'>
          <div
              v-for="(item, index) in outSkus"
              :key="index"
              class='skuItem'
          >
            <SkuItem
                class='sku'
                extraWidth='74px'
                :skuResult="item.skuResult"
                :otherData="[isArray(item.brandNames).length === 0 ? '任意品牌' : isArray(item.brandNames).join('、')]"
            />
            <div>
              <ShopNumber show :value='item.number' />
            </div>
          </div>
        </view>
        <BottomButton
            only
            text='确认'
            @onClick="onClick"
        />
      </view>

    </view>

  </view>
</template>

<script>
import ShopNumber from "../../../components/ShopNumber";
import SkuItem from "../../Sku/components/SkuItem";
import {isArray} from '../../../util/Tools';
import BottomButton from "../../../components/BottomButton";
import Loading from "../../../components/Loading";
import CodeNumber from "../../components/CodeNumber";
import {OutStock} from "MES-Apis/src/OutStock/promise";
import {Message} from "../../../components/Message";

export default {
  name: 'OutStockConfirm',
  components: {CodeNumber, Loading, BottomButton, SkuItem, ShopNumber},
  data() {
    return {
      outSkus: [],
      isArray,
      loading: false,
      query: {},
      outStockLoading: false,
    }
  },
  mounted() {
  // setTimeout(()=>{
  //   this.$emit('outStock')
  // },2000)
  },
  methods: {
    onClick() {
      const current = this
      // let received = 0;
      // current.outSkus.map(item => {
      //   received += item.number
      // })
      // uni.$emit('outStockAction', {
      //   receivedAction: true,
      //   pickListsId: current.outSkus[0].pickListsId,
      //   received: received
      // })
      // current.$emit('outStock')
      // return
      this.outStockLoading = true
      OutStock.outStockV1_2({
        code: current.code
      }, {
        onSuccess() {
          Message.successToast('出库成功！',
              () => {
                let received = 0;
                current.outSkus.map(item => {
                  received += item.number
                })
                uni.$emit('outStockAction', {
                  receivedAction: true,
                  pickListsId: current.outSkus[0].pickListsId,
                  received: received
                })
                current.$emit('outStock')
                current.outSkus = []
              },
          );
        }
      }).finally(() => {
        this.outStockLoading = false
      });
    },
    onSuccess(code) {
      this.code = code
      this.loading = true
      const current = this
      OutStock.listByCode({code}, {
        onSuccess(res) {
          current.outSkus = isArray(res.data)
        },
        onError: (res) => {
          Message.errorToast('此领料码未查询到物料或码已被使用')
        },
      }).finally(() => {
        this.loading = false
      });
    }
  }
}
</script>

<style lang="scss">
.skus {
  padding: 8px;
  margin-bottom: 100px;

  .skuItem {
    display: flex;
    align-items: center;
    background-color: #fff;
    padding: 8px;
    margin-bottom: 8px;

    .sku {
      flex-grow: 1;
    }
  }
}

.scan {
  margin-top: 31px;

  .scanStyle {
    width: 80px;
    height: 80px;
    background: #D9D9D9;
    border-radius: 50px;
    box-shadow: 0px -4px 10px 0px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: auto;

    svg {
      font-size: 30px;
      color: #fff;
    }
  }


}
</style>
