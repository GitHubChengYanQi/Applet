<template>
  <view>

    <List
        ref="listRef"
        :max-height="`calc(100vh - ${safeAreaHeight(this)}px)`"
        @request="Production.productionPlanList"
        @listSource="(newList)=> list = newList"
        :list="list"
    >
      <view
          v-for="(item,index) in list"
          :key="index"
      >
        <Card
            class-name="productionCard"
            header-class-name="header"
            :title="item.coding"
            :extra="timeDifference(item.createTime)"
            extra-class-name="createTime"
        >
          <view @click="goToDetail(item)">
            <view class="skuContent">
              <view class="skuItem">
                <SkuItem
                    no-view
                    extra-width="100px"
                    :sku-result="format(item).skuResult"
                    :other-data="['版本号：'+(format(item).partsResult.version || '-')]"
                />
              </view>

              <view>
                x {{ format(item).planNumber }}
              </view>
            </view>
            <u-divider
                :text="`物料总数 ${item.skuCount}`"
                lineColor="#2979ff"
                textPosition="left"
                :customStyle="{margin: '8px 0'}"
            />
            <view class="progress">
              <view class="progressItem">
                <view class="total">
                  <view class="totalItem">
                    出库中：
                    <view class="num" style="color:#007aff">
                      {{ outProgress(item).outing }}
                      ({{ outProgress(item).outIngRate }})
                    </view>
                  </view>
                  <view class="totalItem">
                    已出库：
                    <view class="num" style="color:#19be6b">{{ outProgress(item).outed }}
                      ({{ outProgress(item).outedRate }})
                    </view>
                  </view>
                </view>
                <view class="percentage">
                  <Progress
                      :progress="outProgress(item).data"
                      :total="outProgress(item).total"
                  />
                </view>
              </view>
              <u-divider
                  :text="`BOM总数 ${item.bomCount}`"
                  lineColor="#2979ff"
                  textPosition="left"
                  :customStyle="{margin: '8px 0'}"
              />
              <view class="progressItem">
                <view class="total">
                  <view class="totalItem">
                    生产数：
                    <view class="num" style="color:#19be6b">
                      {{ doneProgress(item).doneBomCount }}
                      ({{ doneProgress(item).doneBomCountRate }})
                    </view>
                  </view>
                </view>
                <view class="percentage">
                  <Progress
                      :progress="doneProgress(item).data"
                      :total="doneProgress(item).total"
                  />
                </view>
              </view>
            </view>
          </view>
          <view class="otherActions">
            <view class="createUser">
              创建人:
              <Avatar size="24" :src="item.createUserResult.miniAppAvatar" />
              {{ item.createUserResult.name }}
            </view>
            <view>
              <LinkButton :disabled="format(item).number === 0" @click="create(format(item))">创建出库任务</LinkButton>
            </view>
          </view>
        </Card>
      </view>
    </List>

    <CreateOutStockTask ref="createOutStockTask" @refresh="refresh" />



  </view>
</template>

<script>
import List from "../../components/List/index";
import {Production} from "MES-Apis/lib/Production/promise";
import Card from "../../components/Card";
import SkuItem from "../../components/SkuItem";
import LinkButton from "../../components/LinkButton";
import UserName from "../../components/UserName";
import Avatar from "../../components/Avatar";
import {isObject, rateTool, safeAreaHeight, timeDifference} from "../../util/Tools";
import Popup from "../../components/Popup";
import ShopNumber from "../../components/ShopNumber";
import BottomButton from "../../components/BottomButton";
import {Message} from "../../components/Message";
import Progress from "../../components/Progress";
import Modal from "../../components/Modal";
import CreateOutStockTask from "./components/CreateOutStockTask";

export default {
  options: {
    styleIsolation: 'shared'
  },
  name: 'ProductionList',
  components: {
    CreateOutStockTask,
    Modal, Progress, BottomButton, ShopNumber, Popup, Avatar, UserName, LinkButton, SkuItem, Card, List
  },
  data() {
    return {
      timeDifference,
      Production,
      list: [],
      safeAreaHeight,
      isObject
    }
  },
  mounted() {
    const _this = this
    uni.$on('doneProductionTask', (data) => {
      const {doneNum, planId} = data || {}
      this.list = _this.list.map(item => {
        if (item.productionPlanId === planId) {
          return {...item, doneBomCount: (item.doneBomCount || 0) + doneNum}
        }
        return item
      })
    })
  },
  methods: {
    outProgress(item) {
      const outing = item.numberCount || 0
      const outed = item.receivedCount || 0
      const total = item.skuCount || 0
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
      const doneBomCount = item.doneBomCount || 0
      const total = item.bomCount || 0
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
    goToDetail(item) {
      uni.navigateTo({
        url: `/Production/ProductionDetail/index?id=${item.productionPlanId}`
      })
    },
    create(item) {
      this.$refs.createOutStockTask.create(item)
    },
    format(item) {
      const planDetailResult = item.planDetailResults[0] || {}
      return {
        ...item,
        skuResult: planDetailResult.skuResult || {},
        planNumber: planDetailResult.planNumber || 0,
        partsResult: planDetailResult.partsResult || {},
        makingNumber: planDetailResult.makingNumber || 0,
        number: (planDetailResult.planNumber || 0) - (planDetailResult.makingNumber || 0)
      }
    },
    refresh({productionPlanId, number}) {
      this.$refs.listRef.submit()
    }
  }
}
</script>

<style lang="scss">

.productionCard {
  padding-bottom: 0;
}

.header {
  padding-bottom: 8px;
  border-bottom: solid 1px #f0f0f0;
}

.createTime {
  color: #ccc;
  font-size: 12px;
}

.skuContent {
  display: flex;
  align-items: center;

  .planNumber {
    text-decoration-line: line-through;
    text-decoration-thickness: initial;
    text-decoration-style: initial;
    text-decoration-color: initial;
  }

  .skuItem {
    flex-grow: 1;
  }
}

.progress {

  .progressItem {
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

.otherActions {
  padding-top: 8px;
  display: flex;
  justify-content: space-between;
  border-top: solid 1px #f0f0f0;
  margin-top: 8px;

  .createUser {
    display: flex;
    align-items: center;
    gap: 8px;
  }
}

</style>
