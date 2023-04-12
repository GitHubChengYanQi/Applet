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
          <view
              v-for="(item,index) in isArray(detail.planDetailResults)"
              :key="index"
              class="skuItem"
          >
            <view class="sku">
              <SkuItem :sku-result="item.skuResult"  :other-data="['版本号：'+item.partsResult.name]" />
            </view>
            <view>
              x {{ item.planNumber }}
            </view>
          </view>
          <view class="progress">
            <view class="progressItem">
              <view class="total">
                <view class="totalItem">
                  出库中：
                  <view class="num" style="color:#007aff">{{ outProgress(detail).makingNumber }} ({{ 100 }}%)</view>
                </view>
                <view class="totalItem">
                  已出库：
                  <view class="num" style="color:#19be6b">{{ outProgress(detail).makingNumber }} ({{ 100 }}%)</view>
                </view>
              </view>
              <view class="percentage">
                <Progress
                    :progress="outProgress(detail).data"
                    :total="outProgress(detail).total"
                />
              </view>
            </view>
            <view class="progressItem">
              <view class="total">
                <view class="totalItem">
                  BOM完成：
                  <view class="num" style="color:#007aff">{{ doneProgress(detail).makingNumber }} ({{ 100 }}%)</view>
                </view>
                <view class="totalItem">
                  计划完成：
                  <view class="num" style="color:#19be6b">{{ doneProgress(detail).makingNumber }} ({{ 100 }}%)</view>
                </view>
              </view>
              <view class="percentage">
                <Progress
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
<!--                <image v-if="true" src="../../static/page-ing.png" />-->
                <image src="../../static/page-ok.png" />
                <view class="status">
                  进行中
                </view>
                <view class="coding">
                  {{ item.cardCoding }}
                </view>
              </view>
              <view class="cardProgress">
                <view class="total">
                  <view class="num">
                    总物料数：
                    <view>50</view>
                  </view>
                  <view class="num">
                    已生产物料数：
                    <view style="color: #19be6b">50</view>
                  </view>
                </view>
                <u-line-progress :percentage="50"></u-line-progress>
              </view>
            </view>
            <view class="action">
              <LinkButton>查看</LinkButton>
              <view style="color: #e1ebf6">|</view>
              <LinkButton>分享</LinkButton>
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
import {isArray} from "../../util/Tools";
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
      loading: false,
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
  },
  methods: {
    outProgress(item) {
      const {planNumber, makingNumber} = item
      let data = [
        {
          number: 4,
          color: '#007aff'
        },
        {
          number: 2,
          color: '#19be6b'
        }
      ]
      return {
        total: 10,
        data,
        makingNumber: 99999
      }
    },
    doneProgress(item) {
      let total = 50;
      let data = [
        {
          number: 12,
          color: '#007aff'
        },
        {
          number: 20,
          color: '#19be6b'
        }
      ]
      return {
        total,
        data,
        makingNumber: 99999
      }
    },
    getDetail() {
      this.loading = true
      Production.productionPlanDetail({
        data: {productionPlanId: this.productionPlanId}
      }).then((res) => {
        this.detail = res.data || {}
      }).catch(() => {
        this.error = true
      }).finally(() => {
        this.loading = false
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
      padding: 12px 0;
      display: flex;
      align-items: center;
      justify-content: space-evenly;
    }
  }
}
</style>
