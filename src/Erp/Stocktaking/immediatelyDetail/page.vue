<template>
  <view class="white">
    <view class="content">
      <Icon icon="icon-pandiankuwei1" size="20" />
      <view class="text">{{ positionName }}&nbsp;/&nbsp;{{ storehouse }}</view>
    </view>

    <Loading :skeleton="true" v-if="loading" />

    <view v-else class="positionStock">
      <Empty v-if="skus.length === 0" description="此库位暂无物料" />
      <view
          v-for="(item,index) in skus"
          :key="index"
          class="skuItem"
      >
        <SkuItem
            :sku-result="item.skuResult"
            hidden-number
        >
          <template slot="otherData">
            <view class="brand">
              {{ item.brandResult ? item.brandResult.brandName : '无品牌' }}
            </view>
          </template>
        </SkuItem>
        <view class="number">
          <view
              :class="{num:true,error:item.realityNumber !== item.stockNumber}"
              @click="item.realityNumber === item.stockNumber ? update(index,item) : reset(index)"
          >
            库存数
            <view class="update">
              {{ item.stockNumber }}
              <u-icon
                  v-if="item.realityNumber === item.stockNumber"
                  name="edit-pen"
                  color="#2979ff"
                  :size="18"
              />
            </view>
          </view>
          <view v-if="item.realityNumber !== item.stockNumber" class="line">
            <u-icon
                name="arrow-right-double"
                color="#2979ff"
                :size="18"
            />
          </view>
          <view v-if="item.realityNumber !== item.stockNumber" class="num reality" @click="update(index,item)">
            实际数
            <view class="update" @click="update(index,item)">
              {{ item.realityNumber }}
              <u-icon name="edit-pen" color="#2979ff" :size="18"></u-icon>
            </view>
          </view>
        </view>
        <view class="space" />
      </view>
    </view>

    <BottomButton
        only
        :disabled="updateSkus.length === 0"
        text="盘点完成"
        @onClick="onClick"
    />


    <Keybord
        :visible='visible'
        @close="(value)=>visible = value"
        :value='updateSku.realityNumber'
        :min='0'
        @onChange="onChange"
    />

    <Modal ref="modal" />

  </view>
</template>

<script>
import SkuItem from "../../../components/SkuItem";
import Keybord from "../../../components/Keybord";
import {Stocktaking} from "MES-Apis/lib/Stocktaking/promise";
import {getLocalParmas} from "../../../util/Tools";
import Loading from "../../../components/Loading";
import BottomButton from "../../../components/BottomButton";
import {Message} from "../../../components/Message";
import Empty from "../../../components/Empty";
import Icon from "../../../components/Icon";
import Modal from "../../../components/Modal";

export default {
  components: {
    Modal,
    Icon,
    Empty,
    BottomButton,
    Loading,
    Keybord,
    SkuItem
  },
  data() {
    return {
      visible: false,
      updateSku: {},
      updateSkuIndex: null,
      loading: false,
      skus: [],
      positionName: '',
      storehouse: ''
    }
  },
  mounted() {
    this.getPositionSkus()
    const {name, storehouse} = getLocalParmas().search
    this.positionName = name
    this.storehouse = storehouse
  },
  computed: {
    updateSkus() {
      return this.skus.filter((item) => item.stockNumber !== item.realityNumber)
    }
  },
  methods: {
    getPositionSkus() {
      this.loading = true
      const positionId = getLocalParmas().search.positionId
      Stocktaking.getPositionStock({
        data: {positionId}
      }).then((res) => {
        this.skus = (res?.data || []).map(item => {
          const number = (item.number || 0) - (item.lockNumber || 0)
          return {
            ...item,
            stockNumber: number,
            realityNumber: number
          }
        })
      }).finally(() => {
        this.loading = false
      })
    },
    update(index, updateSku) {
      this.updateSku = updateSku
      this.updateSkuIndex = index
      this.visible = true
    },
    reset(resetIndex) {
      this.skus = this.skus.map((item, index) => {
        if (index === resetIndex) {
          return {...item, realityNumber: item.stockNumber}
        } else {
          return item
        }
      })
    },
    onChange(number) {
      this.skus = this.skus.map((item, index) => {
        if (index === this.updateSkuIndex) {
          return {...item, realityNumber: number}
        } else {
          return item
        }
      })
    },
    onClick() {
      const _this = this
      this.$refs.modal.dialog({
        only: false,
        title: '请确认盘点信息',
        content: `本次盘点共有${this.updateSkus.length}个物料进行修改`,
        onConfirm() {
          return new Promise((resolve) => {
            Stocktaking.stockDetailsInventoryCorrection({
              data: {
                "params": _this.updateSkus.map(item => {
                  return {
                    "skuId": item.skuId,
                    "customerId": item.customerId,
                    "positionId": item.positionId,
                    "brandId": item.brandId,
                    "number": item.realityNumber
                  }
                })
              }
            }).then(() => {
              resolve(true)
              _this.$refs.modal.dialog({
                only: false,
                title: '盘点成功！',
                confirmText: '返回',
                cancelText: '继续操作',
                onCancel() {
                  _this.getPositionSkus()
                  return true
                },
                onConfirm() {
                  uni.navigateBack()
                  return true
                }
              })
            }).catch(() => {
              resolve(false)
            })
          })
        },
        onCancel() {
          return true
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.white {
  height: 100vh;
  background-color: #fff;

  .content {
    padding: 12px;
    border-bottom: 1px solid #f5f5f5;
    display: flex;

    .text {
      padding-left: 8px;
      margin: auto 0;
    }
  }

  .positionStock {
    max-height: calc(100vh - 150px);
    overflow: auto;
  }

  .skuItem {
    padding: 8px 12px 0;

    .space {
      height: 4px;
      background-color: $body-color;
      margin: 0 -12px;
    }

    .number {
      margin-top: 8px;
      display: flex;
      align-items: center;
      border-top: solid 1px #eee;

      .line {

      }

      .num {
        flex-grow: 1;
        padding: 8px 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }

      .reality {
        //Combox: $success-Combox;
      }

      .update {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 8px;
        padding-left: 26px;
      }

      .error {
        color: $uni-color-error;

        .update {
          padding-left: 0;
        }
      }
    }

    .brand {
      color: $primary-color;
      padding-top: 8px;
    }
  }
}
</style>
