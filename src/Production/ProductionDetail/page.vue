<template>
  <view class="detail">
    <Empty v-if="error" type="error" description="获取生产计划详情异常" />
    <Loading :skeleton="true" skeleton-type="page" v-else-if="loading" />
    <view v-else>
      <List
          :max-height="`calc(100vh - ${safeAreaHeight(this,8)}px)`"
          @request="Production.productionCardList"
          :default-params="{sourceId: productionPlanId}"
          @listSource="(newList)=> cardList = newList"
          :list="cardList"
      >
        <Card title="基本信息" style="border-bottom: solid 1px #F5F5F5">
          <view class="info">
            <view>
              <span class="label">计划编码：</span>{{ detail.coding }}
            </view>
            <view>
              <span class="label">创建人：</span>{{ detail.createUserResult && detail.createUserResult.name }}
            </view>
            <view>
              <span class="label">创建时间：</span>{{ detail.createTime }}
            </view>
          </view>
        </Card>

        <Card title="生产信息" style="border-bottom: solid 1px #F5F5F5">
          <view class="skuItem">
            <view class="sku">
              <SkuItem :sku-result="detail.skuResult" :other-data="['版本号：'+detail.partsResult.version]" />
            </view>
            <view>
              x {{ detail.planNumber }}
            </view>
          </view>
          <view class="progress">
            <u-divider
                :text="`物料总数 ${detail.skuCount}`"
                lineColor="#2979ff"
                textPosition="left"
                :customStyle="{margin: '8px 0'}"
            />
            <view class="progressItem">
              <view class="total">
                <view class="totalItem">
                  出库中：
                  <view class="num" style="color:#007aff">{{ outProgress(detail).outing }}
                    ({{ outProgress(detail).outIngRate }})
                  </view>
                </view>
                <view class="totalItem">
                  已出库：
                  <view class="num" style="color:#19be6b">{{ outProgress(detail).outed }}
                    ({{ outProgress(detail).outedRate }})
                  </view>
                </view>
              </view>
              <view class="percentage">
                <Progress
                    :height="12"
                    :progress="outProgress(detail).data"
                    :total="outProgress(detail).total"
                />
              </view>
            </view>
            <u-divider
                :text="`BOM总数 ${detail.bomCount}个`"
                lineColor="#2979ff"
                textPosition="left"
                :customStyle="{margin: '8px 0'}"
            />
            <view class="progressItem">
              <view class="total">
                <view class="totalItem">
                  生产数：
                  <view class="num" style="color:#19be6b">
                    {{ doneProgress(detail).doneBomCount }}
                    ({{ doneProgress(detail).doneBomCountRate }})
                  </view>
                </view>
              </view>
              <view class="percentage">
                <Progress
                    :height="12"
                    :progress="doneProgress(detail).data"
                    :total="doneProgress(detail).total"
                />
              </view>
            </view>
          </view>
        </Card>

        <Card title="生产卡片">
          <view
              v-for="(item,index) in cardList"
              :key="index"
              class="cardItem"
          >
            <view class="cardInfo">
              <view class="cardCoding">
                <image v-if="item.status === 99" src="../../static/page-ing.png" />
                <image v-else src="../../static/page-ok.png" />
                <view class="status">
                  {{ item.status === 0 ? '进行中' : '已完成' }}
                </view>
                <view class="coding">
                  {{ item.cardCoding }}
                </view>
              </view>
              <view class="cardProgress">
                <view class="total">
                  <view class="num">
                    Bom总数：
                    <view>{{ detail.bomCount / cardList.length }}</view>
                  </view>
                  <view class="num">
                    已生产：
                    <view style="color: #f0ad4e">{{ item.doneBomCount || 0 }}</view>
                  </view>
                </view>
                <view style="padding: 0 10%">
                  <u-line-progress
                      :height="10"
                      activeColor="#f0ad4e"
                      :percentage="rateTool((item.doneBomCount || 0),detail.bomCount / cardList.length,true)"
                  />
                </view>
              </view>
            </view>
            <view class="action">
              <view class="actionItem" @click="goToCardDetail(item.productionCardId)">查看</view>
              <view style="color: #e1ebf6">|</view>
              <view class="actionItem">
                <button
                    open-type="share"
                    :id="item.productionCardId"
                    :data-cardCoding="item.cardCoding"
                    :data-skuImg="skuImg(detail.skuResult)"
                >
                  分享
                </button>
              </view>
            </view>
          </view>
        </Card>
      </List>
    </view>
  </view>
</template>

<script>
import Card from "../../components/Card";
import {Production} from "MES-Apis/lib/Production/promise";
import Empty from "../../components/Empty";
import Loading from "../../components/Loading";
import {isArray, rateTool} from "../../util/Tools";
import SkuItem from "../../components/SkuItem";
import Progress from "../../components/Progress";
import List from "../../components/List/indx";
import LinkButton from "../../components/LinkButton";
import {safeAreaHeight} from '../../util/Tools';

export default {
  props: ['productionPlanId'],
  components: {LinkButton, List, Progress, SkuItem, Loading, Empty, Card},
  data() {
    return {
      rateTool,
      loading: true,
      error: false,
      detail: {},
      isArray,
      Production,
      cardList: [],
      safeAreaHeight
    }
  },
  mounted() {
    this.getDetail()
    const _this = this
    uni.$on('doneProductionTask', (data) => {
      const {cardId, doneNum} = data || {}
      _this.detail.doneBomCount = (_this.detail.doneBomCount || 0) + doneNum
      this.cardList = _this.cardList.map(item => {
        if (item.productionCardId === cardId) {
          return {
            ...item,
            doneBomCount: (item.doneBomCount || 0) + doneNum,
            status: ((item.doneBomCount || 0) + doneNum) === (_this.detail.bomCount / _this.cardList.length) ? 99 : 0
          }
        }
        return item
      })
    })
  },
  methods: {
    skuImg(skuResult) {
      if (skuResult && skuResult.images) {
        const imgResult = isArray(skuResult.imgResults).find(item => item.mediaId === skuResult.images.split(',')[0])
        if (imgResult) {
          return imgResult.thumbUrl
        }
      }
      return ''
    },
    outProgress(item) {
      const outing = item.numberCount
      const outed = item.receivedCount
      const total = item.skuCount
      let data = [
        {
          number: outing,
          color: '#007aff'
        },
        {
          number: outed,
          color: '#19be6b'
        }
      ]
      return {
        total,
        data,
        outing,
        outed,
        outIngRate: rateTool(outing, total),
        outedRate: rateTool(outed, total)
      }
    },
    doneProgress(item) {
      const doneBomCount = item.doneBomCount
      const total = item.bomCount
      let data = [
        {
          number: doneBomCount,
          color: '#19be6b'
        }
      ]
      return {
        total,
        data,
        doneBomCount,
        doneBomCountRate: rateTool(doneBomCount, total),
      }
    },
    getDetail() {
      this.loading = true
      Production.productionPlanDetail({
        data: {productionPlanId: this.productionPlanId}
      }).then((res) => {
        const data = res.data || {}
        const planDetailResults = isArray(data.planDetailResults)[0] || {}
        this.detail = {
          ...res.data,
          skuResult: planDetailResults.skuResult || {},
          partsResult: planDetailResults.partsResult || {},
          planNumber: planDetailResults.planNumber
        }
      }).catch(() => {
        this.error = true
      }).finally(() => {
        this.loading = false
      })
    },
    goToCardDetail(cardId) {
      uni.navigateTo({
        url: `/Production/ProductionCardDetail/index?cardId=${cardId}`
      })
    }
  }
}
</script>

<style lang="scss">
.detail {
  background-color: #fff;
  min-height: 100vh;

  .info {
    view {
      padding: 4px 0;
    }
  }

  .label {
    color: #a9a9a9;
  }

  .skuItem {
    display: flex;
    align-items: center;

    .sku {
      flex-grow: 1;
    }
  }

  .progress {

    .progressItem {
      padding-top: 8px;
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;

      .total {
        text-align: center;
        display: flex;
        align-items: center;
        gap: 24px;
        padding-bottom: 4px;
        width: 100%;
        justify-content: center;

        .totalItem {
          display: flex;
        }
      }

      .percentage {
        width: 100%;
      }

    }
  }

  .cardItem {
    //display: flex;
    //align-items: center;
    //gap: 16px;
    //padding: 12px 8px;
    margin-bottom: 8px;
    border: solid 1px $body-color;
    border-radius: 4px;

    .cardInfo {

      //flex-grow: 1;

      .cardCoding {
        padding: 12px 8px;
        border-bottom: solid 1px $body-color;
        position: relative;
        text-align: center;

        image {
          position: absolute;
          top: 9px;
          left: -4px;
          width: 73px;
          height: 24px;
        }

        .status {
          position: absolute;
          z-index: 1;
          flex-grow: 1;
          color: #fff;
        }

        .coding {
          font-weight: bold;
          font-size: 16px;
        }
      }

      .cardProgress {
        padding: 12px 8px;
        border-bottom: solid 1px $body-color;

        .total {
          display: flex;
          align-items: center;
          padding-bottom: 4px;
          justify-content: space-around;

          .num {
            display: flex;
            align-items: center;

            view {
              font-size: 18px;
              font-weight: bold;
            }
          }
        }
      }
    }

    .action {
      display: flex;
      align-items: center;
      //justify-content: space-evenly;

      .actionItem {
        flex-grow: 1;
        color: $primary-color;
        padding: 12px 0;
        text-align: center;

        button {
          background-color: #fff;
          border: none;
          border-radius: 0;
          box-shadow: none;
          color: unset;
          font-size: unset;
          line-height: unset;

          &::after {
            border: none;
          }
        }
      }
    }
  }
}
</style>
