<template>
  <view>
    <Empty v-if="error" type="error" description="获取BOM信息异常" />
    <view v-else class="boms">
      <view class="header">
        <Card title="生产数量">
          <template slot="extra">
            <ShopNumber action-show :value="number" @click="visible = true" />
          </template>
        </Card>
      </view>

      <Loading :skeleton="true" v-if="loading" />
      <view v-else>
        <Card title="生产信息" style="border-bottom: solid 1px #F5F5F5" />
        <view
            class="productionCardBom"
            :style="{maxHeight: `calc(100vh - 110px - ${37 + safeAreaHeight(this,8)}px)`,overflow:'auto'}"
        >
          <ProductionCardBom
              :bom="parentBom"
              show
          />
        </view>
        <BottomButton
            :loading="submitLoading"
            only
            text="创建生产任务"
            @onClick="submit"
        />
      </view>

      <keybord
          :visible='visible'
          @visiblChange="(value)=>visible = value"
          :value='number'
          :min='1'
          @onChange="onChange"
      />
    </view>
  </view>

</template>
<script>
import {Bom} from "MES-Apis/lib/Bom/promise";
import {isArray, isObject, safeAreaHeight} from "../../util/Tools";
import SkuItem from "../../components/SkuItem";
import ShopNumber from "../../components/ShopNumber";
import Loading from "../../components/Loading";
import Card from "../../components/Card";
import BottomButton from "../../components/BottomButton";
import LinkButton from "../../components/LinkButton";
import Keybord from "../../components/Keybord";
import {Production} from "MES-Apis/lib/Production/promise";
import {Message} from "../../components/Message";
import {Sku} from "MES-Apis/lib/Sku/promise";
import ProductionCardBom from "../ProductionCardDetail/components/ProductionCardBom";
import Empty from "../../components/Empty";

export default {
  name: 'BomDetailList',
  components: {Empty, ProductionCardBom, Keybord, LinkButton, BottomButton, Card, Loading, ShopNumber, SkuItem},
  props: ['bomId'],
  data() {
    return {
      safeAreaHeight,
      boms: [],
      isArray,
      isObject,
      loading: true,
      open: null,
      number: 1,
      submitLoading: false,
      visible: false,
      error: false,
      parentBom: {},
    }
  },
  mounted() {
    this.getBoms(1)
  },
  methods: {
    submit() {
      this.submitLoading = true
      Production.productionPlanAddByBom({
        data: {
          "productionPlanDetailParams": [
            {
              "partsId": this.bomId,
              "planNumber": this.number
            }
          ]
        }
      }).then(() => {
        Message.dialog({
          title: '创建生产任务成功！',
          onConfirm() {
            uni.navigateBack()
            return true
          }
        })
      }).catch(() => {
        Message.dialog({
          title: '创建生产任务失败！'
        })
      }).finally(() => {
        this.submitLoading = false
      })
    },
    getBoms(number) {
      this.loading = true
      Bom.bomGetByBomIdV2_0({
        data: {
          bomId: this.bomId,
          number
        }
      }).then(async (res) => {
        const boms = isArray(res.data)
        const newBoms = await this.getSkuImgs(boms)
        const parentBom = newBoms.find(item => item.parentId === 0) || {}
        this.parentBom = this.formatBoms(parentBom, newBoms)
        this.loading = false
      }).catch(() => {
        this.error = false
        this.loading = false
      })
    },
    formatBoms(bom, boms) {
      return {
        ...bom,
        children: boms.filter(item => item.parentId === bom.bomId).map(item => {
          return this.formatBoms(item, boms)
        })
      }
    },
    async getSkuImgs(list) {
      return new Promise((resolve, reject) => {
        Sku.getMediaUrls({
          mediaIds: list.map(item => item.skuResult?.images?.split(',')[0]),
          option: 'image/resize,m_fill,h_74,w_74',
        }).then((res) => {
          return resolve(list.map(item => {
            return this.skuResultFormat(item, res?.data)
          }))
        }).catch(() => {
          reject()
        })
      })
    },
    skuResultFormat(item, skuImages) {
      const skuResult = item.skuResult || {}
      const media = skuImages.find(mediaItem => mediaItem.mediaId === skuResult.images?.split(',')[0]) || {}
      return {
        ...item,
        skuResult: {
          ...skuResult,
          thumbUrl: media.thumbUrl
        }
      }
    },
    onChange(number) {
      this.number = number
    },
    selectUser(bomId, user) {
      uni.navigateTo({
        url: `/User/SelectUser/index?id=${bomId}&type=radio`,
        success: function (res) {
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('clickDept', {
            checkUsers: user ? [user] : [],
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">

.boms {
  //background-color: #fff;

  .header {
    background-color: #fff;
  }
}

.bomItem {
  background-color: #fff;
  padding-bottom: 4px;
}

.user {
  padding-top: 4px;
  display: flex;
  align-items: center;
}

.extra {
  display: flex;
  align-items: center;
  gap: 8px;
}

.details {
  padding-left: 12px;

  .line {
    padding: 8px;
    border: solid 1px #cacaca;
    border-top: none;
    margin: -12px -14px 0 -26px;
  }

  .detail {
    position: relative;


    .detailItem {
      display: flex;
      align-items: center;
      padding: 6px 0;

      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: -12px;
        width: 1px;
        height: 100%;
        background-color: #cacaca;
        margin: auto;
      }

      &::after {
        content: "";
        position: absolute;
        left: -12px;
        width: 12px;
        height: 1px;
        background-color: #cacaca;
        margin: auto;
      }

      .skuItem {
        flex-grow: 1;
      }
    }


    .first {
      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: -12px;
        width: 1px;
        height: 100%;
        background-color: #cacaca;
        margin: auto;
      }
    }

    .end {
      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: -12px;
        width: 1px;
        height: 50%;
        background-color: #cacaca;
        margin: auto;
      }
    }
  }
}


</style>
