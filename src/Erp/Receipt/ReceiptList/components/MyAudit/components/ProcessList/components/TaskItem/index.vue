<template>
  <view>
    <view class="card" @click="$emit('onClick')">
      <view class="cardHeader">
        <view class='cardTitle'>
          <div class='header'>
            <div class='title'>{{ taskName }}</div>
            <div :style="{border: `solid 1px ${statusColor()}`, color:statusColor()}" class='status'>
              {{ statusName }}
            </div>
          </div>
        </view>
        <view class="extra">
          {{ timeDifference(createTime) }}
        </view>
      </view>
      <view class="body">
        <div v-if="task.theme" class='theme'>{{ task.theme }}</div>
        <div class='user'>
          {{ userLabel || '执行人' }}：
          <template v-if="isArray(users).length === 0">无</template>
          <template v-for="(item, index) in isArray(users).filter((userItem, userIndex) => userIndex < 3)">
            <span :key='index' class='userItem'>
              <Avatar :circular="true" style="margin-right: 4px" :src="item.miniAppAvatar" size="18" />
              {{ item.name }}
            </span>
          </template>
          {{ isArray(users).length > 3 ? '...' : '' }}
        </div>
        <div v-if="otherData" class='otherData'>
          <Elliptsis width='100%'>{{ otherData }}</Elliptsis>
        </div>
        <div class='process' v-if="!noProgress">
          <slot name="processRender" />
          <Process v-if="!$slots.processRender" :progress="progress" />
        </div>
      </view>
    </view>
    <div class='space' />
  </view>
</template>

<script>

import Elliptsis from "../../../../../../../../../components/Ellipsis";
import {isArray, timeDifference} from "../../../../../../../../../util/Tools";
import Avatar from "../../../../../../../../../components/Avatar";
import Process from "../../../../../../../../components/Process";

export default {
  name: 'TaskItem',
  components: {Process, Avatar, Elliptsis},
  props: [
    'taskName',
    'createTime',
    'percent',
    'noProgress',
    'processRender',
    'statusName',
    'action',
    'users',
    'userLabel',
    'otherData',
    'task',
  ],
  data() {
    return {
      isArray,
      timeDifference,
      progress: []
    }
  },
  watch:{
    percent(value){
      this.progress = [
        {num: value || 0, color: '#257BDE'},
        {num: 100 - (value || 0), color: '#E8E8E8'}
      ]
    }
  },
  methods: {
    statusColor() {
      switch (this.task.status) {
        case 49:
          return '#9a9a9a'
        case 50:
          return '#dd524d';
        case 99:
          return '#599745';
        default:
          return this.action ? '#007aff' : '#9a9a9a';
      }
    }
  }
}
</script>

<style lang="scss">
.card {
  background-color: #fff;
  padding: 12px;
  font-size: 14px;
  color: #000;
  margin-bottom: 0;

  .cardHeader {
    display: flex;
    align-items: center;

    .cardTitle {
      color: #666666;
      display: flex;
      align-items: center;
      flex-grow: 1;

      .header {
        display: flex;
        align-items: center;
        //line-height: 14px;

        .title {
          font-size: 14px;
        }

        .status {
          border: solid 1px #599745;
          color: #599745;
          padding: 2px 4px;
          font-size: 12px;
          line-height: 12px;
          margin-left: 12px;
          border-radius: 2px;
        }

        .error {
          border: solid 1px $uni-color-error;
          color: $uni-color-error;
        }
      }
    }

    .extra {
      font-size: 12px;
      color: #a7a7a9;
    }
  }

  .body {
    padding: 0;

    .theme, .user, .process, .otherData {
      padding-top: 8px;
      color: #a7a7a9;
    }

    .theme {
      color: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;

      .themeValue {
        flex-grow: 1;
      }
    }

    .user {
      display: flex;
      font-size: 12px;

      .userItem {
        display: flex;
        align-items: center;
        margin-right: 8px;
      }
    }
  }
}

.space {
  margin: 0 12px;
  height: 1px;
  background-color: #f3f3f3;
}
</style>
