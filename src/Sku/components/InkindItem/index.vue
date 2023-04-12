<template>
  <view>
    <van-dialog
        use-slot
        :show="showSkuErWeiMa"
        cancel-button-color="#2680EB"
        confirm-button-text="确认"
        confirm-button-color="#2680EB"
        @close="skuErWeiMa"
        width="280px"
    >
      <view v-if="showSkuErWeiMa" style='text-align: center;padding-top: 12px'>
        <view class='codeTitle'>{{ codeTitle }}</view>
        <view class="dialogContent">
          <view style="padding-top: 19px">
            <canvas
                id="canvas"
                canvas-id="canvas"
                style="width: 187px;height: 187px;display: inline-block"
            />
          </view>
        </view>
      </view>
    </van-dialog>

    <view style="padding: 0 12px 12px">
      <List max-height="50vh" @request="Stock.stockDetailsList" :default-params="{skuId}" @listSource="listSource"
            :list="list">
        <view class="positionItem" v-for="(pos,index) in list" :key="index">
          <view class="positionName">
            <view class="name">
              {{ pos.name }} / {{ pos.storehouseName }} ({{ positionNumber(pos) }})
            </view>
            <LinkButton style="padding: 0;height: fit-content;" @click="showStoreList(pos.positionId)">
              <uni-icons :type=" pos.hidden===true ? 'bottom' : 'top' " color="#2680EB"></uni-icons>
            </LinkButton>
          </view>
          <view v-if="!pos.hidden">
            <view class="inkindItem" v-for="(sku,skuIndex) in isArray(pos.inkindList)" :key="skuIndex">
              <view class="inkindData">
                <view class="inkindId">
                  实物码：
                  <view class="erWeiMaClick" @click="skuErWeiMa(sku.inkindId)">
                    <Icon icon="icon-erweima" color="#2680EB" />
                  </view>
                  <view>× {{ sku.number }}</view>
                </view>
                <view class="brand">{{ isObject(sku.brandResult).brandName || '无品牌' }}</view>
              </view>
              <view class="otherData">
                <view class="flex">
                  <view class="flexGrow">
                    入库时间：{{ MyDate.Show(sku.createTime) }}
                  </view>
                  <view>{{ isObject(sku.user).name }}</view>
                </view>
              </view>
              <view class="otherData" style="padding-bottom: 8px">
                <view class="flex">
                  <view class="flexGrow">
                    上次养护：{{
                      isObject(sku.maintenanceLogResult).createTime ? MyDate.Show(isObject(sku.maintenanceLogResult).createTime) : '暂无'
                    }}
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </List>
    </view>

  </view>
</template>

<script>

import LinkButton from "@/components/LinkButton";
import UQRCode from "uqrcodejs";
import List from "../../../components/List/indx";
import {Stock} from "MES-Apis/lib/Stock/promise";
import {isArray, isObject, MyDate} from "../../../util/Tools";
import Icon from "../../../components/Icon";

export default {
  name: "InkindItem",
  components: {Icon, List, LinkButton},
  props: ['skuId'],
  data() {
    return {
      codeTitle: '实物码',
      inkindItemHidden: false,
      showSkuErWeiMa: false,
      list: [],
      Stock,
      isArray,
      isObject,
      MyDate
    }
  },
  mounted() {

  },
  methods: {
    listSource(list) {
      const newData = [];
      list.forEach(item => {
        const newPositionIds = newData.map(item => item.positionId);
        const newPositionIndex = newPositionIds.indexOf(item.storehousePositionsId);
        if (newPositionIndex !== -1) {
          const newPosition = newData[newPositionIndex];
          newData[newPositionIndex] = {...newPosition, inkindList: [...newPosition.inkindList, item]};
        } else {
          newData.push({
            positionId: item.storehousePositionsId,
            name: isObject(item.storehousePositionsResult).name,
            storehouseName: isObject(item.storehouseResult).name,
            inkindList: [item],
          });
        }
      });
      this.list = newData
    },
    showStoreList(positionId) {
      this.position.forEach(pos => {
        if (pos.positionId === positionId) {
          pos.hidden = !pos.hidden
        }
      })
      // this.position.hidden =  !this.position.hidden
    },
    positionNumber(item) {
      let number = 0;

      isArray(item.inkindList).forEach(item => {
        number += item.number;
      });

      return number
    },
    skuErWeiMa(inkindId) {

      const qr = new UQRCode();
      // 设置二维码内容
      qr.data = inkindId;
      // 设置二维码大小，必须与canvas设置的宽高一致
      qr.size = 187;
      // 调用制作二维码方法
      qr.make();
      // 获取canvas上下文
      // 如果是组件，this必须传入
      // 设置uQRCode实例的canvas上下文
      qr.canvasContext = uni.createCanvasContext('canvas', this);
      // 调用绘制方法将二维码图案绘制到canvas上
      qr.drawCanvas();
      this.showSkuErWeiMa = !this.showSkuErWeiMa;
    },
  },
}
</script>

<style lang="scss">
.positionItem {
  border-radius: 2px;
  margin: 16px 0;
  font-size: 14px;

  .positionName {
    display: flex;
    align-items: center;

    .name {
      flex-grow: 1;
      display: flex;
      align-items: center;
      font-weight: bold;
      gap: 8px;
    }
  }

  .inkindItem {
    margin: 8px 0;
    border-radius: 2px;
    border: 1px solid #E1EBF6;

    .inkindData {
      padding: 8px 12px;
      display: flex;
      align-items: center;
      background-color: #E1EBF6;

      .inkindId {
        display: flex;
        flex-grow: 1;
        align-items: center;
        gap: 8px;
      }

      .brand {
        max-width: 130px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }

    .otherData {
      padding: 8px 12px 0;
      color: #666666;
    }
  }
}


.flex {
  display: flex;
  align-items: center;

  .flexGrow {
    flex-grow: 1;
  }
}

.scroll {
  color: #999999;
  padding: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
}
</style>
