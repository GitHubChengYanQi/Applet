<template>
  <view>
    <view class='out'>
      <view v-if="!ask" :class="['statusName',itemStatus().noAction && 'noStatusName']">
        <view v-if="itemStatus().statusDom === 0">可 <br />备 <br />料</view>
        <view v-if="itemStatus().statusDom === 1">已 <br />领 <br />完</view>
        <view v-if="itemStatus().statusDom === 2">已 <br />备 <br />完</view>
      </view>
      <view class='skuData'>
        <view class='sku' style='padding-bottom: 8px'>
          <view class='skuItem' style='padding-bottom: 8px'>
            <view class='item'>
              <SkuItem
                  :unitName="item.skuResult.unitName"
                  :number='item.stockNumber || 0'
                  :skuResult='item.skuResult'
                  extraWidth='124px'
                  :otherData="[ item.brandResult && item.brandResult.brandName || '任意品牌',isArray(item.positionNames).join('、')]"
              />
            </view>
            <view class='outStockNumber'>
              x {{ item.number }}
            </view>
          </view>
        </view>
        <OutPerogress
            :collectable='collectable'
            :notPrepared='notPrepared'
            :received='received'
            :percent='percent'
            :successPercent='successPercent'
        />
        <view v-if="index !== dataLength" class='space' />
      </view>

    </view>
  </view>
</template>

<script>
import SkuItem from "../../../../components/SkuItem";
import {isArray} from "../../../../util/Tools";
import OutPerogress from "../OutProgress";

export default {
  name: 'outStockItem',
  components: {OutPerogress, SkuItem},
  props: [
    'item',
    'dataLength',
    'index',
    'ask',
    'percent',
    'successPercent',
    'collectable',
    'notPrepared',
    'received',
  ],
  data() {
    return {
      isArray,
    }
  },
  mounted() {

  },
  methods: {
    itemStatus() {
      let statusDom = 0;
      let noAction = true;

      if (this.item.stockNumber) {
        if (this.item.number === this.received) {
          statusDom = 1;
        } else if (this.item.number === this.received + this.collectable) {
          statusDom = 2;
        } else {
          noAction = false;
        }
      }
      return {
        noAction,
        statusDom
      }
    }
  }
}
</script>

<style lang="scss">
.data {
  display: flex;
  font-size: 14px;
  background-color: #fff;
  padding: 12px 16px;
  margin-bottom: 8px;

  .label {
    flex-grow: 1;
    color: #262626;
  }

  .value {
    color: #000000;
  }
}

.skuBorderBottom {
  border-bottom: 1px solid #F5F5F5;
}

.extra {
  color: #000000;
  display: flex;
  gap: 4px;
  align-items: center;
}

.skus {
  background-color: #fff;
  font-size: 14px;
  padding-bottom: 12px;
  margin-bottom: 1px;

  .skuHead {
    padding: 12px 16px;
    display: flex;
    border-bottom: 1px solid #F5F5F5;

    .headTitle {
      flex-grow: 1;
    }
  }

  .skuBorderBottom {
    border-bottom: 1px solid #F5F5F5;
  }

  .skuItems {
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .positions {
    display: inline-block;
    max-width: 100%;
    color: #3D3D3D;
    background-color: #F5F5F5;
    font-size: 12px;
    padding: 2px 11px 1px 11px;
    border-radius: 50px;
  }

}

.out {
  display: flex;
  margin-bottom: 3px;

  .skuData {
    flex-grow: 1;
  }

  .statusName {
    padding: 0 4px;
    display: flex;
    align-items: center;
    color: #fff;
    font-size: 12px;
    background-color: $primary-color;
  }

  .noStatusName {
    background-color: #D9D9D9;
  }
}

.skuItem {
  display: flex;
  align-items: center;
  padding: 12px;

  .inLibrary {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .item {
    flex-grow: 1;
  }

  .skuNumber {
    text-align: right;
    width: 80px;
    padding-right: 14px;

    .shopNumber {
      background-color: var(--body--background--color);
    }

    .error {
      color: var(--adm-color-danger);
    }

    .success {
      color: var(--adm-color-primary);
    }
  }

  .action {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    font-size: 14px;
    gap: 24px;
  }

  .number {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 8px;
  }

  .outStockNumber {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 12px;
  }
}

.allSku {
  color: #808080;
  font-size: 12px;
  margin: 0;
  border-color: #F5F5F5;
}

.dataItem {
  display: flex;
  align-items: center;

  .title {
    flex-grow: 1;
  }
}

.method, .mode {
  display: flex;
  align-items: center;
  gap: 8px;
}

.title {
  span {
    margin-left: 4px;
    color: #EB0F0F;
  }
}

.careful, .note, .file, .dataItem {
  background-color: #fff;
  padding: 12px;
  color: #333333;
  margin-bottom: 1px;

  .remake {
    padding: 8px;
  }

  .files {
    padding: 8px;
  }

  .textArea {
    --font-size: 14px;
    border-bottom: 1px solid #F5F5F5;;
    padding: 8px;
    text-align: center;

    &:focus {
      border-bottom: 1px solid #F5F5F5;;
    }
  }
}

.carefulShow {
  margin: 0 8px;
  display: inline-block;
  padding: 6px;
  background: #F5F5F5;
  max-width: 150px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  border-radius: 2px;
}

.nearMaintenance {
  display: flex;
  align-items: center;
}

.carefulData {
  padding: 12px 0;

  .addCareful {
    margin-top: 8px;
    display: flex;
    gap: 8px;
    border: solid 1px #d9d9d9;
    border-right: none;
    align-items: center;
    height: 30px;
    border-radius: 2px;
    //overflow: hidden;

    .split {
      padding: 4px 0;
      width: 1px;
      height: 50%;
      background-color: rgba(255, 255, 255, 0.3);
    }

    .closeButton {
      color: rgba(255, 255, 255, 0.7);
    }

    .button, .closeButton {
      min-width: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .input {
      flex-grow: 1;
      border-radius: 2px;
      overflow: hidden;
      --font-size: 14px;
      padding: 4px 8px;
    }

    .actions {
      display: flex;
      height: 30px;
      align-items: center;
      background-color: var(--adm-color-primary);
      color: #fff;

      button {
        padding: 0;
        border-radius: 0;
      }
    }

  }

  .selector {
    font-size: 14px;

    :global .adm-selector-item {
      border-radius: 2px;
      background: #F5F5F5;
      border: 1px solid #D9D9D9;
      padding: 0 8px;
      text-align: center;
      height: 27px;
      line-height: 27px;
      max-width: 200px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }

    :global .adm-selector-item-multiple-active {
      border-radius: 2px;
      background: #E1EBF6;
      border: 1px solid #007FFF;
    }
  }
}

.inStockSkuItem {
  padding: 4px 12px;
}

.header {
  display: flex;
  align-items: center;
}

.cardStyle {
  padding: 12px 0 0 0 !important;

  .headerStyle {
    padding: 0 12px !important;
  }

  .borderBottom {
    border-bottom: solid 1px #eee;
  }

  .bodyStyle {
    padding: 0 0 8px 0 !important;
  }

  .instockBody {
    padding: 8px 12px !important;
  }
}

.skuTitle {
  display: flex;
  align-items: center;

  svg {
    margin-left: 16px;
    font-size: 20px;
  }

  .default {

  }

  .check {
    color: var(--adm-color-primary);
  }
}

.status {
  display: flex;
  align-items: center;

  .statusItem {
    padding-right: 16px;
    display: flex;
    align-items: center;
    font-size: 12px;

    .radius {
      width: 8px;
      height: 8px;
      border-radius: 100%;
      margin: 4px;
    }
  }
}

.noPadding {
  padding: 0 !important;
}

.cardHeader {
  padding: 12px;
}

.alignCenter {
  display: flex;
  align-items: center;
  gap: 8px;
}

.codeDialog {
  :global .adm-dialog-body {
    padding-top: 12px;
  }

  .codeTitle {
    font-size: 18px;
    color: #000000;
    border-bottom: solid 1px #EEEEEE;
    padding-bottom: 12px;
  }

  .time {
    padding: 10px 0;
    color: #888888;
  }

  .code {
    width: 184px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 26px;
    font-weight: bold;
    color: #257BDE;
    background: var(--body--background--color);
    margin: auto;
  }


  .getCodeSuccess {
    position: absolute;
    top: 0;
    display: flex;
    flex-direction: column;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    align-items: center;
    justify-content: center;
    color: #fff;

    svg {
      font-size: 64px;
    }
  }
}

.info {
  display: flex;
  align-items: center;
  gap: 8px;

  .skuInfo {
    flex-grow: 1;
  }
}

.radios {
  display: flex;
  align-items: center;
  gap: 8px;
}

.explain {
  padding: 12px;
  background-color: #fff;
  color: #999;
  display: flex;

  div {
    min-width: 70px;
  }
}

.skuPosition {

  display: flex;
  align-items: center;
  gap: 8px;

  .positionItem {
    padding: 4px;
    border-radius: 2px;
    background: #F5F5F5;
    font-size: 12px;
  }

}

.details {
  max-height: 50vh;
  overflow: auto;
}

.space {
  height: 1px;
  background-color: var(--body--background--color);
}

.multiple {
  display: flex;
  flex-wrap: wrap;
  align-items: center;

  .user {
    padding: 4px 8px;
    width: 30%;
  }
}

.addUserIcon {
  font-size: 20px;
}

.tab {
  :global .adm-tabs-tab-wrapper {
    padding: 0 4px;
  }
}

.askContent {
  max-height: 50vh;
  overflow: auto;
}

.dateShow {
  display: flex;
  border-bottom: solid 1px #F5F5F5;

  .show {
    flex-grow: 1;
    padding: 16px;
    display: flex;
    align-items: center;
    justify-content: center;

    .showNumber {
      display: flex;
      flex-direction: column;
      padding-left: 16px;

      .number {
        font-size: 18px;
        margin: 0 4px;
        color: var(--adm-color-primary);
      }
    }

    svg {
      font-size: 26px;
      color: var(--body--background--color);
    }
  }
}

.theme {
  input {
    text-align: right;
  }
}

.carefulItem {
  display: inline-block;
  margin-bottom: 4px;
  margin-right: 8px;
  border-radius: 2px;
  background: #F5F5F5;
  border: 1px solid #D9D9D9;
  padding: 0 8px;
  text-align: center;
  height: 27px;
  line-height: 27px;
  width: 30%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  -webkit-touch-callout: none; /*系统默认菜单被禁用*/

  -webkit-user-select: none; /*webkit浏览器*/

  -khtml-user-select: none; /*早期浏览器*/

  -moz-user-select: none; /*火狐*/

  -ms-user-select: none; /*IE10*/

  user-select: none;
}

.carefulChecked {
  border-radius: 2px;
  background: #E1EBF6;
  border: 1px solid #007FFF;
}

.updateName {
  input {
    text-align: center;
  }
}


</style>
