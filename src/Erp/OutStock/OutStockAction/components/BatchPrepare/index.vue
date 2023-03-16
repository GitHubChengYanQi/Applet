<template>
  <scroll-view style="height:calc(100vh - 130px)" :scroll-y="scroll">
    <view class='batchPrepare'>
      <view class='box'>
        <view>
          <span class="label">主题：</span>{{ theme || '无' }}
        </view>
        <view>
          <span class="label">负责人：</span>{{ detail.userResult && detail.userResult.name || '无' }}
        </view>
        <view>
          <span class="label">类型：</span>{{ getOutType(detail.type) || '' }}
        </view>
        <view>
          <span class="label">注意事项：</span>
          {{
            isArray(detail.announcementsResults).length === 0 ? '无' : isArray(detail.announcementsResults).map(item => item.content).join('、')
          }}
        </view>
        <view>
          <span class="label">备注：</span>{{ detail.note || '无' }}
        </view>
      </view>
      <view class="box">
        <view>
          <span class="label">订单编号：</span>{{ detail.coding || '无' }}
        </view>
        <view>
          <span class="label">申请时间：</span>{{ MyDate.Show(detail.createTime) }}
        </view>
      </view>
      <view class="tabs">
        <van-tabs swipeable border color="#007aff" :active="type" @change="onChange">
          <van-tab
              v-for="(typeItem,typeIndex) in types"
              :key="typeIndex"
              :title="typeItem.title"
              :name="typeItem.name"
          />
        </van-tabs>
      </view>

      <view class="box">
        <view class="skuHeader">
          <view class="skuTitle">物料</view>
          <view>{{ numberTitle() }}</view>
        </view>
        <view class="divider" />
        <view v-if="loading">
          <Loading :skeleton="true" />
        </view>
        <view v-else-if="total().num">
          <view
              v-for="(item,index) in data"
              :key="index"
          >
            <view
                :class="['skuContent', item.complete && type === 'all' && 'complete']"
                v-if="skuNumberShow(item)"
            >
              <view class='img'>
                <image
                    :src='item.thumbUrl || publicInfo.imgLogo'
                    alt=''
                />
                <view class='number'>
                  {{ item.stockNumber || 0 }}{{ item.skuResult.unitName }}
                </view>
              </view>
              <view class="sku">
                <view class="skuShow">
                  {{
                    SkuResultSkuJsons(skuResult(item))
                  }}
                  <br>
                  <view class="askNumber" v-if="type !== 'all'">申请数量：{{ item.number }}</view>
                </view>
              </view>
              <view>
                x {{ skuNumberShow(item) }}
              </view>
            </view>
          </view>
        </view>
        <Empty v-else description='暂无物料' />


        <view class='total'>
          合计：&nbsp;&nbsp;{{ total().num }}类&nbsp;&nbsp;{{ total().number }}件
        </view>
      </view>
    </view>
    <view class="bottom"></view>
    <BottomButton
        v-if="action"
        :only="true"
        text='一键备料'
        @onClick='onClick'
    />
  </scroll-view>
</template>

<script>
import {SkuResultSkuJsons} from "../../../../../Sku/sku";
import Loading from "../../../../../components/Loading";
import {getOutType} from "../../../outStock";
import {isArray, MyDate} from "../../../../../util/Tools";
import {OutStock} from "MES-Apis/src/OutStock/promise";
import {outPickListFormatSort} from "../../index";
import BottomButton from "../../../../../components/BottomButton";
import {Message} from "../../../../../components/Message";
import Empty from "../../../../../components/Empty";
import {Sku} from "MES-Apis/src/Sku/promise";

export default {
  components: {Empty, BottomButton, Loading},
  props: ['detail', 'pickListsId', 'detail', 'action', 'taskId', 'theme', 'shopRef'],
  data() {
    return {
      countNumber: 0,
      data: [],
      SkuResultSkuJsons,
      getOutType,
      MyDate,
      isArray,
      loading: false,
      type: 'notPrepared',
      types: [
        {title: '全部', name: 'all'},
        {title: '未备', name: 'notPrepared'},
        {title: '已备', name: 'perpare'},
        {title: '已领', name: 'received'}
      ]
    }
  },
  mounted() {
    this.detailList()
  },
  computed: {
    scroll() {
      return !this.$store.state.dialog.show
    },
    publicInfo() {
      return this.$store.state.userInfo.publicInfo
    }
  },
  methods: {
    skuResult(item) {
      return {
        skuResult: {
          spuResult: {
            name: item.skuResult.spuName,
          },
          skuName: item.skuResult.skuName,
          specifications: item.skuResult.specifications,
          unitName: item.skuResult.unitName
        },
      }
    },
    async detailList() {
      if (!this.pickListsId) {
        return
      }
      this.loading = true
      const res = await OutStock.outStockDetailList({pickListsId: this.pickListsId})
      const {countNumber, array, receivedTotal, collectableTotal} = outPickListFormatSort(isArray(res?.data), true);
      const skuMediaUrls = await Sku.getMediaUrls({
        mediaIds: array.map(item => item.skuResult?.images?.split(',')[0]),
        option: 'image/resize,m_fill,h_74,w_74',
      }).catch(() => {
      })
      this.countNumber = countNumber
      const data = array.map(item => {
        const media = isArray(skuMediaUrls?.data).find(mediaItem=>  mediaItem.mediaId === item.skuResult?.images?.split(',')[0]);
        return {
          ...item,
          complete: item.notPrepared === 0,
          skuResult: item.skuResult || {},
          thumbUrl: media ? media.thumbUrl : ''
        }
      })
      this.data = data
      this.type = this.types.find(item => {
        if (item.name !== 'all') {
          return this.total(item.name, data).num
        }
        return false
      })?.name || 'all'
      this.loading = false
      return {
        received: receivedTotal,
        collectable: collectableTotal,
      }
    },
    onClick() {
      this.$store.commit('dialog/openChange', true)
      Message.dialog({
        content: '该操作会按照申请数量进行备料，库存不足按照库存数量备料。',
        confirmText: '开始备料',
        only: false,
        onConfirm: () => {
          return new Promise((resolve) => {
            OutStock.autoPick({pickListsId: this.pickListsId, taskId: this.taskId}).then((res) => {
              this.$store.commit('dialog/openChange', false)
              resolve(true)
              this.autoPick(res.data)
            }).catch(() => {
              resolve(false)
            })
          })
        },
        onCancel: () => {
          this.$store.commit('dialog/openChange', false)
          return true
        }
      })
    },
    async autoPick(res) {

      const all = this.data.filter(item => item.notPrepared > 0).length;
      this.$store.dispatch('bouncing/jump', {
        name: 'outStockShop',
        number: all - res.length,
        after: async () => {
          Message.dialog({
            title: '备料成功',
            content: `已备${all - res.length}个,库存不足${res.length}个`,
            only: true,
          });
          const detailInfo = await this.detailList();
          uni.$emit('outStockAction', {
            taskId: this.taskId,
            collectable: detailInfo.collectable,
            received: detailInfo.received
          })
        }
      })
    },
    async refresh() {
      const detailInfo = await this.detailList()
      uni.$emit('outStockAction', {
        taskId: this.taskId,
        collectable: detailInfo.collectable,
        received: detailInfo.received
      })
    },
    onChange({detail: {name}}) {
      this.type = name
    },
    skuNumberShow(item, type) {
      switch (type || this.type) {
        case "all":
          return item.number
        case 'perpare':
          return item.perpareNumber
        case 'notPrepared':
          return item.notPrepared
        case 'received':
          return item.received
        default:
          break;
      }
    },
    total(type, data) {
      switch (type || this.type) {
        case "all":
          return {
            num: this.data.length,
            number: this.countNumber
          }
        case 'perpare':
        case 'notPrepared':
        case 'received':
          let number = 0
          const num = (data || this.data).filter(item => {
            const skuNumber = this.skuNumberShow(item, type)
            number += skuNumber
            return skuNumber
          }).length
          return {
            num,
            number
          }
        default:
          return {}
      }
    },
    numberTitle() {
      if (this.type === 'all') {
        return '申请数量'
      } else {
        return this.types.find(item => item.name === this.type).title + '数量'
      }
    },
  }
}
</script>

<style lang="scss">

.tabs {
  position: sticky;
  top: 0;
  z-index: 1;
}

.batchPrepare {
  background-color: #fff;
  padding: 0 12px 60px;
  //height: 100vh;
  //overflow: auto;

  .box {
    padding: 12px 0;
    border-bottom: black 1px dashed;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .skuHeader {
    display: flex;

    .skuTitle {
      flex-grow: 1;
    }
  }

  .complete {
    text-decoration-line: line-through;
    text-decoration-thickness: initial;
    text-decoration-style: initial;
    text-decoration-color: initial;
  }

  .skuContent {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    padding: 8px 0;

    .sku {
      flex-grow: 1;
      padding-right: 12px;

      .skuShow {
        max-width: 60vw;
      }
    }
  }

  .total {
    padding: 8px 0;
    text-align: right;
  }
}

.divider {
  height: 1px;
  background-color: #eee;
  margin: 8px 0;
}

.label {
  color: #a9a9a9;
}

.bottom {
  margin-bottom: 70px;
}

.img {
  border-radius: 4px;
  border: solid #F1F1F1 1px;
  overflow: hidden;
  position: relative;
  height: 40px;
  width: 40px;

  image {
    filter: grayscale(50%);
    height: 40px;
    width: 40px;
  }

  .number {
    font-size: 12px;
    text-align: center;
    position: absolute;
    bottom: 0;
    width: 100%;
    color: #fff;
    background-color: rgba(27, 27, 27, 0.5);

    .error {
      margin-left: 4px;

      svg {
        font-size: 12px;
      }
    }
  }
}

.askNumber {
  font-size: 12px;
  color: $primary-color
}
</style>
