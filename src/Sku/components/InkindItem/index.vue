<template>
  <view>
    <van-dialog
        use-slot
        :show="showSkuErWeiMa"
        show-cancel-button
        cancel-button-text="取消"
        cancel-button-color="#2680EB"
        confirm-button-text="打印"
        confirm-button-color="#2680EB"
        @close="skuErWeiMa"
        width="280px"
    >
      <view v-if="showSkuErWeiMa" style='text-align: center;padding-top: 12px'>
        <view class='codeTitle'>{{ codeTitle }}</view>
        <view class="dialogContent">
          <view style="padding-top: 19px">
            <canvas id="canvas" canvas-id="canvas"
                    style="width: 187px;height: 187px;display: inline-block"></canvas>
          </view>
        </view>
      </view>
    </van-dialog>

    <view style="height: 60vh; top: 0;padding: 0 12px 12px; overflow:auto">
      <view class="positionItem" v-for="pos in position" :key="pos.positionId">
        <view class="positionName">
          <view class="name">
            {{ pos.name }}
          </view>
          <LinkButton style="padding: 0;height: fit-content;" @click="showStoreList(pos.positionId)">
            <uni-icons :type=" pos.hidden===true ? 'bottom' : 'top' " color="#2680EB"></uni-icons>
          </LinkButton>
        </view>
        <view v-if="!pos.hidden">
          <view class="inkindItem" v-for="sku in pos.skuList" :key="sku.inkindId">
            <view class="inkindData">
              <view class="inkindId">
                {{ sku.title }}
                <view class="erWeiMaClick" @click="skuErWeiMa(sku.inkindId)">
                  <uni-icons custom-prefix="icon-font" type="icon-erweima" color="#2680EB" size="21"></uni-icons>
                </view>
                <view>× {{ sku.number }}</view>
              </view>
              <view class="brand">{{ sku.brand }}</view>
            </view>
            <view class="otherData">
              <view class="flex">
                <view class="flexGrow">
                  入库时间：{{ sku.time }}
                </view>
                <view>{{ sku.user }}</view>
              </view>
            </view>
            <view class="otherData" style="padding-bottom: 8px">
              <view class="flex">
                <view class="flexGrow">
                  上次养护：{{ sku.maintain }}
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="scroll">
        --- 我是有底线的 ---
      </view>
    </view>
  </view>
</template>

<script>

import LinkButton from "@/components/LinkButton";
import UQRCode from "uqrcodejs";

export default {
  name: "InkindItem",
  components: {LinkButton},
  data() {
    return {
      codeTitle: '是否打印实物码',
      inkindItemHidden: false,
      showSkuErWeiMa: false,
      position: [
        {
          name: 'Z1-3-2 / 南坡大库 (359)',
          positionId: 1,
          hidden: false,

          skuList: [
            {
              title: '实物码',
              inkindId: 1,
              number: 1,
              time: '01月31日 11:18',
              user: '宋正飞',
              maintain: '暂无',
              brand: '无品牌'
            },
            {
              title: '实物码',
              inkindId: 2,
              number: 1,
              time: '02月02日 11:18',
              user: '孙嘉龙',
              maintain: '暂无',
              brand: '无品牌'
            }
          ]
        },
        {
          name: '东1 / 车间现场库 (1)',
          positionId: 2,
          hidden: false,

          skuList: [
            {
              title: '实物码',
              inkindId: 3,
              number: 1,
              time: '02月03日 11:18',
              user: '孙嘉龙',
              maintain: '暂无',
              brand: '无品牌'
            },
            {
              title: '实物码',
              inkindId: 4,
              number: 1,
              time: '03月09日 11:18',
              user: '宋正飞',
              maintain: '暂无',
              brand: '浑河库存'
            }
          ]
        },
        {
          name: '东1 / 车间现场库 (1)',
          positionId: 3,
          hidden: false,

          skuList: [
            {
              title: '实物码',
              inkindId: 3,
              number: 1,
              time: '02月03日 11:18',
              user: '孙嘉龙',
              maintain: '暂无',
              brand: '无品牌'
            },
            {
              title: '实物码',
              inkindId: 4,
              number: 1,
              time: '03月09日 11:18',
              user: '宋正飞',
              maintain: '暂无',
              brand: '浑河库存'
            }
          ]
        },
        {
          name: '东1 / 车间现场库 (1)',
          positionId: 4,
          hidden: false,

          skuList: [
            {
              title: '实物码',
              inkindId: 3,
              number: 1,
              time: '02月03日 11:18',
              user: '孙嘉龙',
              maintain: '暂无',
              brand: '无品牌'
            },
            {
              title: '实物码',
              inkindId: 4,
              number: 1,
              time: '03月09日 11:18',
              user: '宋正飞',
              maintain: '暂无',
              brand: '浑河库存'
            }
          ]
        }
      ]
    }
  },
  methods: {
    showStoreList(positionId) {
      this.position.forEach(pos => {
        if (pos.positionId === positionId) {
          pos.hidden = !pos.hidden
        }
      })
      // this.position.hidden =  !this.position.hidden
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