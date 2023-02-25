<template>
  <view>
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
      <van-tabs swipeable border color="#007aff" :active="type" @change="onChange">
        <van-tab
            v-for="(typeItem,typeIndex) in types"
            :key="typeIndex"
            :title="typeItem.title"
            :name="typeItem.name"
        >
          <view class="box">
            <view class="skuHeader">
              <view class="skuTitle">物料</view>
              <view>申请数量</view>
            </view>
            <view class="divider" />
            <view v-if="loading">
              <Loading :skeleton="true" />
            </view>
            <view v-if="total().num">
              <view
                  v-for="(item,index) in data"
                  :key="index"
              >
                <view
                    :class="['skuContent', item.complete && type === 'all' && 'complete']"
                    v-if="skuNumberShow(item)"
                >
                  <view class="sku">
                    {{
                      SkuResultSkuJsons({
                        skuResult: {
                          spuResult: {
                            name: item.skuResult.spuName,
                          },
                          skuName: item.skuResult.skuName,
                          specifications: item.skuResult.specifications,
                        },
                      })
                    }}
                  </view>
                  <view>
                    X {{ skuNumberShow(item) }}
                  </view>
                </view>
              </view>
            </view>
            <Empty v-else description='暂无物料' />


            <view class='total'>
              合计：&nbsp;&nbsp;{{ total().num }}类&nbsp;&nbsp;{{ total().number }}件
            </view>
          </view>
        </van-tab>
      </van-tabs>
    </view>
    <view class="bottom"></view>
    <BottomButton
        v-if="action"
        :only="true"
        text='一键备料'
        @onClick='onClick'
    />
  </view>
</template>

<script>
import {SkuResultSkuJsons} from "../../../../Sku/sku";
import Loading from "../../../../../components/Loading";
import {getOutType} from "../../../outStock";
import {isArray, MyDate} from "../../../../../util/Tools";
import {OutStock} from "MES-Apis/src/OutStock/promise";
import {outPickListFormatSort} from "../../index";
import BottomButton from "../../../../../components/BottomButton";
import {Message} from "../../../../../components/Message";
import Empty from "../../../../../components/Empty";

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
        {title: '已备', name: 'perpare'},
        {title: '未备', name: 'notPrepared'},
        {title: '已领', name: 'received'}
      ]
    }
  },
  mounted() {
    this.detailList()
  },
  methods: {
    async detailList() {
      if (!this.pickListsId) {
        return
      }
      this.loading = true
      const res = await OutStock.outStockDetailList({pickListsId: this.pickListsId}).finally(() => {
        this.loading = false
      })
      const {countNumber, array} = outPickListFormatSort(isArray(res.data), true);
      this.countNumber = countNumber
      this.data = array.map(item => ({
        ...item,
        complete: item.notPrepared === 0,
        skuResult: item.skuResult || {}
      }))
    },
    onClick() {
      Message.dialog({
        content: '该操作会按照申请数量进行备料，库存不足按照库存数量备料。',
        confirmText: '开始备料',
        only: false,
        onConfirm: () => {
          return new Promise((resolve, reject) => {
            OutStock.autoPick({pickListsId: this.pickListsId, taskId: this.taskId}).then((res) => {
              resolve(true)
              this.autoPick(res.data)
            }).catch(() => {
              resolve(false)
            })
          })
        },
      })
    },
    async autoPick(res) {

      const all = this.data.filter(item => item.notPrepared > 0).length;
      this.$store.dispatch('bouncing/jump', {
        name: 'outStockShop',
        number: all - res.length,
        after: () => {
          this.detailList();
          Message.dialog({
            title: '备料成功',
            content: `已备${all - res.length}个,库存不足${res.length}个`,
            only: true,
          });
        }
      })
    },
    refresh() {
      this.detailList()
    },
    onChange({detail: {name}}) {
      this.type = name
    },
    skuNumberShow(item) {
      switch (this.type) {
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
    total() {
      switch (this.type) {
        case "all":
          return {
            num: this.data.length,
            number: this.countNumber
          }
        case 'perpare':
        case 'notPrepared':
        case 'received':
          let number = 0
          const num = this.data.filter(item => {
            const skuNumber = this.skuNumberShow(item)
            number += skuNumber
            return skuNumber
          }).length
          return {
            num,
            number
          }
        default:
          break;
      }
    }
  }
}
</script>

<style lang="scss">
.batchPrepare {
  background-color: #fff;
  padding: 0 12px 60px;

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
    font-size: 16px;
    padding: 8px 0;

    .sku {
      flex-grow: 1;
      padding-right: 12px;
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
</style>
