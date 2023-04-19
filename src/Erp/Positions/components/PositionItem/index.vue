<template>
  <view :class="{
      positionItem:true,
      topPositionItem:top,
      positionTree:!top,
      endPositionItem:end
    }">
    <view class="info">
      <view class="nameAction" @click="openPosition(position)">
        <view v-if="!lastPosition">
          <Icon v-if="open()" icon="icon-pandiankuwei1" size="24" />
          <Icon v-else icon="icon-pandiankuwei1-copy" size="24" />
        </view>
        <view class="name">
          <span class="sort">{{ position.sort || 0 }}.</span>{{ position.title }}
        </view>
      </view>

      <view class="action" @click="setting(position)">
        <u-icon name="setting" color="#2680EB" size="18" />
      </view>
    </view>
    <view class="positions" v-if="open()">
      <PositionItem
          v-for="(item,index) in isArray(position.children)"
          :key="index"
          :opens="opens"
          :end="index === isArray(position.children).length - 1"
          :position="item"
          @openPosition="openPosition"
          @setting="setting"
      />
    </view>
  </view>
</template>

<script>
import Icon from "../../../../components/Icon";
import {isArray} from "../../../../util/Tools";
import PositionItem from './index'
import LinkButton from "../../../../components/LinkButton";

export default {
  name: 'PositionItem',
  components: {LinkButton, Icon, PositionItem},
  props: ['position', 'top', 'end', 'opens'],
  computed: {},
  data() {
    return {
      isArray,
      lastPosition: false
    }
  },
  mounted() {
    this.lastPosition = isArray(this.position.children).length === 0
  },
  methods: {
    open() {
      return isArray(this.opens).find(id => id === this.position.key)
    },
    openPosition(position) {
      if (!this.lastPosition) {
        this.$emit('openPosition', position)
      }
    },
    setting(position) {
      this.$emit('setting', position)
    }
  }
}
</script>
<style lang="scss">
.positionItem {
  padding: 16px 0 16px 16px;
  position: relative;

  .info {
    display: flex;
    align-items: center;
    gap: 4px;

    .nameAction {
      flex-grow: 1;
      display: flex;
      align-items: center;
      gap: 4px;

      .name {
        display: flex;
        align-items: flex-end;
        gap: 4px;

        .sort {
          font-size: 12px;
          color: #cccccc;
        }
      }
    }

  }
}

.topPositionItem {
  margin-bottom: 4px;
  background-color: #fff;
  border-radius: 4px;
  padding-right: 12px;
}

.positionTree {
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
    top: 28px;
  }
}

.endPositionItem {
  &::before {
    height: 28px;
  }
}

.positions {
  padding-left: 12px;
}


</style>
