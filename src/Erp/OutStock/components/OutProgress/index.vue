<template>
  <view>
    <view class='dataNumber'>
      <view class="allProgress">
        <view
            v-for="(item,index) in progress()"
            :key='index'
            class='progress'
            :style="{ backgroundColor: item.color, width: `${item.num}%` }"
        />
      </view>
      <view class='status'>
        <view v-if="received" class='statusItem'>
          <view class='radius' :style="{ backgroundColor: receivedColor }" />
          已领 {{ received }}
        </view>
        <view v-if="collectable" class='statusItem'>
          <view class='radius' :style="{ backgroundColor: collectableColor }" />
          可领 {{ collectable }}
        </view>
        <view v-if="notPrepared" class="statusItem">
          <view class='radius' :style="{ backgroundColor: notPreparedColor }" />
          未备 {{ notPrepared }}
        </view>
      </view>
    </view>

  </view>
</template>

<script>
import {collectableColor, notPreparedColor, receivedColor} from "../../outStock";

export default {
  name: 'outPerogress',
  props: [
    'percent',
    'successPercent',
    'received',
    'collectable',
    'notPrepared',
  ],
  data() {
    return {
      collectableColor,
      notPreparedColor,
      receivedColor
    }
  },
  methods: {
    progress() {
      const total = this.received + this.collectable + this.notPrepared
      const received = Math.round((this.received / total) * 100) || 0
      const collectable = Math.round((this.collectable / total) * 100) || 0
      return [
        {num: received, color: receivedColor},
        {num: collectable, color: collectableColor},
        {
          num: total <= 0 ? 0 : 100 - received - collectable,
          color: notPreparedColor
        },
      ]
    }
  },
  mounted() {

  }
}
</script>

<style lang="scss">

.allProgress {
  border-radius: 100px;
  display: flex;
  overflow: hidden;

  .progress {
    display: inline-block;
    padding: 4px 0;
    background-color: #D8D8D8;
  }
}

.dataNumber {
  padding: 0 12px 8px;

  .number {
    padding-right: calc(2em + 8px);
    display: flex;
    font-size: 12px;

    div {
      text-align: center;
    }
  }
}

.status {
  display: flex;
  align-items: center;
  padding-top: 4px;

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

</style>
