<template>
  <view>
    <view class="float">
      <view id='pickShop' class='actions'>
        <view class='action' @click='click'>
          <view class='actionButton'>
            <Bouncing
                ref='shopRef'
                :size='32'
                :height='24'
                :img='outShop'
                :number='loading? undefined : allSkus.length'
                @addAfter='addAfter'
            />
          </view>
        </view>
      </view>
    </view>

    <Popup
        :show="show"
        @close="close"
        title='待出物料'
    >
      <WaitOutSku
          v-if="show"
          @listRefresh='getOutStockShop'
          :taskId='taskId'
          :outType='outType'
          :pickListsId='pickListsId'
          @refresh="(returnSkus) => refreshOrder = returnSkus"
          :user='user'
          :data='data'
          :allSkus='allSkus'
      />
    </Popup>
  </view>
</template>

<script>
import Bouncing from "../../../../components/Bouncing";
import outShop from '../../../../static/outShop.png'
import {OutStock} from "MES-Apis/src/OutStock/promise";
import {isArray} from "../../../../util/Tools";
import Popup from "../../../../components/Popup";
import WaitOutSku from "../components/WaitOutSku";

export default {
  name: 'OutStockShop',
  components: {WaitOutSku, Popup, Bouncing},
  props: [
    'outType',
    'pickListsId',
    'taskId',
  ],
  data() {
    return {
      outShop,
      loading: false,
      allSkus: [],
      user: {},
      data: [],
      show: false,
      refreshOrder: false,
    }
  },
  mounted() {
    this.getOutStockShop()
  },
  methods: {
    close() {
      if (this.refreshOrder) {
        this.$emit('refresh', this.refreshOrder)
        this.refreshOrder = false;
      }
      this.show = false
    },
    jump(after, num) {
      this.$refs.shopRef.jump(after, num)
    },
    click() {
      this.getOutStockShop();
      this.show = true
    },
    getOutStockShop() {
      if (!this.pickListsId) {
        return
      }
      this.loading = true
      OutStock.outStockShop({pickListsId: this.pickListsId}, {
        onSuccess: (res) => {
          const newData = [];
          const sku = [];
          isArray(res.data).map(userItem => {
            const pickListsResults = userItem.pickListsResults || [];
            pickListsResults.map(item => {
              const cartResults = item.cartResults || [];
              if (cartResults.length > 0) {
                cartResults.forEach(item => {
                  const data = {
                    ...item,
                    userId: userItem.userId,
                    key: item.skuId + item.brandId + item.pickListsDetailId,
                  };
                  sku.push(data);
                  newData.push(data);
                });
              }
              return null;
            });
            return null;
          });
          this.allSkus = sku
          this.user = isArray(res.data)[0] || {}
          this.data = newData
        }
      }).finally(() => {
        this.loading = false
      })
    },
    addAfter() {
      this.getOutStockShop();
    }
  }
}
</script>


<style lang="scss">
.float {
  position: fixed;
  bottom: 100px;
  right: 24px;

  .actions, .action {
    display: flex;
    flex-direction: column;
    font-size: 10px;
    align-items: center;
    color: #3D3D3D;
    gap: 8px;

    :global .ant-avatar {
      background-color: $body-color;
    }

    .actionButton {
      border-radius: 100%;
      background-color: $body-color;
      width: 42px;
      height: 42px;
      display: flex;
      align-items: center;
      justify-content: center;

      svg {
        font-size: 24px;
      }
    }


    .text {
      padding: 4px 0 6px;
    }

    .dimension {
      width: 24px;
      height: 24px;
      //background-color: var(--body--background--color);
    }
  }

}


.content {
  max-height: 80vh;
  display: flex;
  flex-direction: column;

  .header {
    padding: 12px;
    text-align: center;
    font-size: 18px;
    border-bottom: 1px solid #EEEEEE;

    span {
      float: right;
    }
  }

  .screen {
    padding: 12px;
    border-bottom: 1px solid #E1EBF6;
  }

  .skuList {
    flex-grow: 1;
    overflow: auto;
    //margin-bottom: 12px;

    .skuItem {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px;
      border-bottom: 1px solid #F5F5F5;

      .check {
        svg {
          font-size: 16px;
        }
      }

      .sku {
        flex-grow: 1;
      }

      .edit {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .inStock {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        height: 74px;

        .error {
          color: var(--adm-color-danger);
        }

        button {
          padding: 4px;
          font-size: 12px;
          text-align: center;
          min-width: 60px;
        }
      }
    }

    .errorAction {
      padding: 0 12px 12px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #F5F5F5;
      color: #000000;

      .number {
        flex-grow: 1;
        display: flex;
        align-items: center;

        .red {
          color: var(--adm-color-danger);
        }

        .yellow {
          color: #FA8F2B;
        }

        .black {
          color: #000;
        }

        span {
          flex-grow: 1;
        }

      }
    }
  }

  .bottom {
    display: flex;
    padding: 8px;
    background-color: var(--body--background--color);

    .all {
      flex-grow: 1;
      display: flex;
      align-items: center;
      font-size: 14px;
      gap: 8px;
    }

    .buttons {
      display: flex;
      gap: 8px;

      button {
        padding: 4px 12px;
        font-size: 16px;
      }
    }
  }


}

.position {
  font-size: 14px;
  max-height: 50vh;
  overflow: auto;

  .positionItem {
    padding: 12px;
    display: flex;
    align-items: center;

    .positionName {
      width: 50%;
      display: inline-block;
    }

    .positionAction {
      width: 50%;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .number {
        display: inline-block;
      }

      .remove {
        float: right;
      }
    }
  }
}

.space {
  height: 3px;
  background-color: var(--body--background--color);
}

.addPosition {
  padding: 8px;
  border-top: 1px solid #EEEEEE;;
}

.positionPopup {
  z-index: var(--adm-popup-z-index, 1002);
}


</style>
