<template>
  <view>
    <view v-if="!childrenAction()">
      <view class="shenglue" @click="openAll" v-if="showParent">
        <u-divider
            textPosition="left"
            :customStyle="{padding: '16px 0 0 0',margin: 0,}"
            text="查看上级"
            textColor="#2979ff"
        />
      </view>
      <ProductionCardBom
          v-for="(detailItem,index) in isArray(bom.children)"
          :ref="`childrenId${detailItem.productionTaskId}`"
          :key="index"
          :bom="detailItem"
          @check="check"
          @openChange="openChange"
          :checkList="checkList"
      />
    </view>
    <Card
        v-else
        no-left-border
        body-style="padding-top:0;margin-top:8px;padding:0"
        class="bomItem"
        :style="{paddingBottom: !(bom.parentId === 0 && isArray(bom.children).length === 0) && 0}"
    >
      <view slot="title" class="sku" @click="()=>(complete ? bom.parentId ===0 : true) && check(bom)">
        <Check
            v-if="showCheck()"
            :value="checked()"
        />
        <view class="skuItem">
          <SkuItem
              :maxWidth="bom.parentId === 0 ? null : '230px'"
              :width="bom.parentId === 0 ? null : '230px'"
              :number="bom.number"
              no-view
              img-size="74"
              extra-width="100px"
              :sku-result="isObject(bom.skuResult)"
              :other-data="bom.done !== 1 ? ['版本号：'+bom.version] : []"
          >
            <view v-if="bom.done === 1" style="padding-top: 4px" slot="otherData">
              <view class="action">
                <view style="font-size: 12px">
                  操作人：
                  <span style="font-weight: bold">{{ bom.userResult && bom.userResult.name || '-' }}</span>
                  <span v-if="complete ? bom.parentId ===0 : true" style="color: #007aff;padding-left: 8px">重新提交</span>
                </view>
                <view style="font-size: 12px;color: rgba(0,0,0,0.6)">
                  操作时间:
                  {{timeDifference(bom.lastTime)}}
                </view>
              </view>
            </view>
          </SkuItem>
        </view>
      </view>
      <view slot="default" class="details" v-if="complete || bom.done !== 1">
        <view v-if="isArray(bom.children).length > 0" class="line"></view>
        <view
            v-for="(detailItem,index) in isArray(bom.children)"
            :key="detailItem.skuId"
            class="detail"
        >
          <view :class="{
            detailItem:true,
            first:index === 0,
            end:index === isArray(bom.children).length - 1,
            haveCheck:showCheck(),
            haveCheckEnd:index === isArray(bom.children).length - 1 && showCheck()
          }">
            <ProductionCardBom
                :show="show"
                :complete="complete"
                :defaultOpen="open"
                :bom="detailItem"
                @check="check"
                :checkList="checkList"
            />
          </view>
        </view>
      </view>
    </Card>

    <Modal ref="modal" />

  </view>
</template>

<script>
import Card from "../../../../components/Card";
import Check from "../../../../components/Check";
import SkuItem from "../../../../components/SkuItem";
import {isArray, isObject, timeDifference} from "../../../../util/Tools";
import ProductionCardBom from './index'
import {Message} from "../../../../components/Message";
import LinkButton from "../../../../components/LinkButton";
import {Production} from "MES-Apis/lib/Production/promise";
import UserName from "../../../../components/UserName";
import Modal from "../../../../components/Modal";

export default {
  name: 'ProductionCardBom',
  props: ['bom', 'checkList', 'defaultOpen', 'complete', 'show'],
  components: {Modal, UserName, LinkButton, SkuItem, Check, Card, ProductionCardBom},
  data() {
    return {
      isObject,
      isArray,
      timeDifference,
      open: false,
      showParent: false
    }
  },
  created() {
    this.open = this.defaultOpen
  },
  methods: {
    checked() {
      return isArray(this.checkList).find(item => item.productionTaskId === this.bom.productionTaskId)
    },
    showCheck() {
      if (this.complete || this.show) {
        return false
      }
      return this.bom.done !== 1 && this.childrenOk(this.bom)
    },
    childrenOk(bom) {
      if (bom) {
        return isArray(bom.children).filter(item => item.done !== 1).length === 0
      } else {
        return false
      }
    },
    openAll() {
      this.open = true
      this.$emit('openChange')
    },
    childrenAction() {
      if (this.open || this.complete || this.show) {
        return true
      }
      const open = this.childrenOk(this.bom)
      if (open) {
        this.$emit('openChange')
      }
      return open
    },
    color() {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      return `rgb(${r},${g},${b})`;
    },
    openChange() {
      this.showParent = true
    },
    check(bom) {
      if (bom.done === 1) {
        const _this = this
        this.$refs.modal.dialog({
          title: '任务已完成，是否重新提交？',
          only: false,
          confirmText: '重新提交',
          onConfirm() {
            return new Promise((resolve) => {
              Production.doneTask({
                data: {
                  taskIds: [bom.productionTaskId]
                }
              }).then(() => {
                _this.$refs.modal.dialog({
                  title: '提交成功！'
                })
                resolve(true)
              })
            })
          }
        })
      } else if (this.childrenOk(bom)) {
        this.$emit('check', bom)
      }
    }
  }
}
</script>

<style lang="scss">
.bomItem {
  background-color: #fff;
  padding-bottom: 4px;

  .sku {
    display: flex;
    align-items: center;

    .skuItem {
      min-width: 200px;
    }
  }
}

.extra {
  display: flex;
  align-items: center;
  gap: 8px;
}

.details {
  padding-left: 10px;

  .line {
    padding: 8px;
    border-left: solid 1px #cacaca;
    margin: -14px 0px 0px;
  }

  .detail {
    position: relative;


    .detailItem {
      display: flex;
      align-items: center;
      padding: 6px 0;

      .detailStatus {
        padding-top: 4px;

        .complete {
          color: $primary-color;
        }

        .noComplete {
          color: red;
        }
      }

      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 1px;
        height: 100%;
        background-color: #cacaca;
        margin: auto;
      }

      &::after {
        content: "";
        position: absolute;
        left: 0;
        width: 12px;
        height: 1px;
        background-color: #cacaca;
        top: 54px;
      }
    }


    .first {
      &::before {

      }
    }

    .haveCheck {
      &::before {
        top: -39px;
        height: calc(100% + 39px);
      }
    }

    .end {
      &::before {
        height: 54px;
      }
    }

    .haveCheckEnd {
      &::before {
        top: -39px;
        height: 94px;
      }
    }


  }
}

.shenglue {
  padding-left: 12px;
}

.action {
  display: flex;
  //align-items: center;
  flex-direction: column;
  //gap: 2px;
}
</style>
