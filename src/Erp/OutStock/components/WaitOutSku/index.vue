<template>
  <view>
    <view class='sys'>
      <span>数量：{{ allSkus.length }} 类</span>
      <LinkButton :disabled='outTypeData().noSys' @click='sys = !sys'>{{ sys ? '退出管理' : '管理' }}</LinkButton>
    </view>
    <view class='content'>
      <Empty v-if="data.length === 0" />
      <view
          v-for="(cartItem, cartIndex) in data"
          :key='cartIndex'
      >
        <view class='skuItem' @click="()=>sys && check(checkedSkus().includes(cartItem.key),cartItem)">
          <span v-if="sys">
          <Check :value="checkedSkus().includes(cartItem.key)" />
          </span>
          <div class='item'>
            <SkuItem
                no-view
                :number='cartItem.stockNumber'
                :skuResult='cartItem.skuResult'
                :imgSize='60'
                extraWidth='148px'
                :otherData="[cartItem.brandResult && cartItem.brandResult.brandName || '无品牌']"
            />
          </div>
          <view>
            <LinkButton v-if="outTypeData(cartItem).skuAction" @click="showError">查看异常件</LinkButton>
            <view>x {{ cartItem.number }}</view>
          </view>
        </view>
      </view>
    </view>
    <view class='bottom'>
      <view class='all'>
        <view v-if="sys" @click="returnSkus = (allChecked() ? [] : allSkus)">
          <Check
              :value="allChecked()"
          >
            {{ allChecked() ? '取消全选' : '全选' }}
            <span style="padding-left: 8px">已选中 {{ returnSkus.length }} 类</span>
          </Check>
        </view>
        <view v-else>
          {{ `领料人：${user.userName || ''}` }}
        </view>
      </view>
      <view class='buttons'>
        <MyButton custom-class="button" v-if="sys" type="error" :disabled='returnSkus.length=== 0' @click='remove'>
          移出
        </MyButton>
        <MyButton custom-class="button" v-if="!sys" @click="$emit('confirm')">
          出库确认
        </MyButton>
        <MyButton
            :loading="sendLoading"
            :disabled="allSkus.length === 0"
            v-if="!sys"
            type="primary"
            @click='send'
        >
          通知领料
        </MyButton>
      </view>
    </view>
  </view>
</template>

<script>
import LinkButton from "../../../../components/LinkButton";
import SkuItem from "../../../../components/SkuItem";
import {OutStock} from "MES-Apis/lib/OutStock/promise";
import {Message} from "../../../../components/Message";
import Empty from "../../../../components/Empty";
import Check from "../../../../components/Check";
import MyButton from "../../../../components/MyButton";

export default {
  name: 'WaitOutSku',
  components: {MyButton, Check, Empty, SkuItem, LinkButton},
  props: [
    'pickListsId',
    'outType',
    'taskId',
    'user',
    'data',
    'allSkus',
  ],
  data() {
    return {
      sys: false,
      returnSkus: [],
      errorSku: [],
      sendLoading: false
    }
  },
  mounted() {

  },
  methods: {
    outTypeData() {
      switch (this.outType) {
        case 'StocktakingErrorOutStock':
          return {
            noSys: true,
            skuAction: true
          };
        default:
          return {};
      }
    },
    check(checked, cartItem) {
      if (checked) {
        this.returnSkus = this.returnSkus.filter(item => item.key !== cartItem.key)
      } else {
        this.returnSkus = [...this.returnSkus, cartItem]
      }
    },
    showError() {
      // setErrorSku({
      //   skuId: item.skuId,
      //   brandId: item.brandId,
      //   skuResult: item.skuResult,
      //   pickListsId: id,
      // });
    },
    remove() {
      const productionPickListsCartParams = this.returnSkus.map(item => {
        return {
          pickListsId: item.pickListsId,
          skuId: item.skuId,
          brandId: item.brandId,
        };
      });
      OutStock.shopBack({productionPickListsCartParams}, {
        onSuccess: () => {
          Message.successToast('移出成功!');
          this.$emit('listRefresh')
          this.$emit('refresh', this.returnSkus)
          this.returnSkus = []
        }
      })
    },
    send() {
      this.sendLoading = true
      OutStock.send({userId: this.user.userId, taskId: this.taskId}, {
        onSuccess: () => {
          Message.successToast('提醒成功!');
        }
      }).finally(() => {
        this.sendLoading = false
      })
    },
    checkedSkus() {
      return this.returnSkus.map(item => item.key)
    },
    allChecked() {
      return this.returnSkus.length === this.allSkus.length
    }
  }
}
</script>

<style lang="scss">
.header {
  font-size: 18px;
  padding: 12px;
  text-align: center;
  border-bottom: 1px solid #EEEEEE;
}

.sys {
  padding: 12px;
  background: #F5F5F5;
  display: flex;
  align-items: center;

  span {
    flex-grow: 1;
  }
}

.content {
  max-height: 50vh;
  overflow: auto;

  svg {
    font-size: 18px;
  }
}

.user {
  display: flex;
  padding: 12px;
  align-items: center;
  font-size: 14px;
  border-bottom: 1px solid #F5F5F5;

  span {
    flex-grow: 1;
    display: flex;
    gap: 8px;
    align-items: center;
  }
}

.orderData {
  padding: 12px;
  font-size: 14px;
  color: #333333;
  border-bottom: 1px solid #F5F5F5;
  font-weight: bold;
  display: flex;
  gap: 8px;
  align-items: center;
  margin-left: 8px;
}

.skuItem {
  display: flex;
  align-items: center;
  padding: 12px;
  gap: 8px;
  border-bottom: 1px solid #F5F5F5;

  .item {
    flex-grow: 1;
  }
}

.bottom {
  background-color: var(--body--background--color);
  display: flex;
  padding: 12px;

  .all {
    flex-grow: 1;
    display: flex;
    align-items: center;
    font-size: 14px;
    gap: 8px;

    :global .adm-checkbox {
      --icon-size: 18px;
      --font-size: 14px;
    }
  }

  .buttons {
    display: flex;
    gap: 8px;

    button {
      padding: 4px 12px;
      font-size: 14px;
      border-radius: 2px;
    }
  }
}

.button {
  height: fit-content;
  padding: 6px 0;
}


</style>
