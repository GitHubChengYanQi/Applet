<template>
  <view class='users'>
    <view
        v-for="(item,index) in users"
        :key="index"
    >
      <view class='user'>
        <view class='nameAvatar'>
          <view class="avatar">
            <view
                v-if="itemData(item).stepsStatus"
                :class="itemData(item).stepsStatus === 'success' ? 'successIcon' : 'errorIcon'"
            >
              <uni-icons
                  :type="itemData(item).stepsStatus === 'success' ? 'checkbox-filled' : 'clear'"
              />
            </view>
            <image :src='old ? item.avatar : item.auditUserResult.avatar' />
          </view>
          {{ old ? item.name : item.auditUserResult.name }}
        </view>
        <view v-if='itemData(item).stepsStatus'>
          {{ nodeStatusName(auditType, itemData(item).stepsStatus) }} ·
          {{ MyDate.Show(old ? logResult.updateTime : item.updateTime) }}
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import {MyDate} from "../../../../../../../../../util/Tools";

export default {
  props: ['users', 'step', 'old'],
  data() {
    return {
      auditType: '',
      MyDate,
      logResult: {}
    }
  },
  mounted() {
    let auditType = this.step.auditType;
    if (this.step.auditRule.type === 'status') {
      auditType = 'action';
    }
    this.auditType = auditType
    this.logResult = this.step.logResult || {};
  },
  methods: {
    itemData(item) {
      let stepsStatus;
      if (this.old) {
        if (item.auditStatus) {
          switch (this.logResult.status) {
            case 1:
              stepsStatus = 'success';
              break;
            case 0:
              stepsStatus = 'error';
              break;
            default:
              break;
          }
        }
        return {
          stepsStatus
        }
      } else {
        switch (item.status) {
          case 1:
            stepsStatus = 'success';
            break;
          case 0:
          case 2:
            stepsStatus = 'error';
            break;
          default:
            break;
        }
        return {
          stepsStatus
        }
      }
    },
    nodeStatusName(auditType, stepStatus, actioning) {
      // 节点类型
      switch (auditType) {
        case 'start':
          // 发起节点状态
          if (actioning) {
            return '发起中';
          }
          switch (stepStatus) {
            case 'error':
            case 'success':
              return '已发起';
            case 'wait':
              return '未发起';
            default:
              return '';
          }
        case 'route':
          // 路由节点状态
          if (actioning) {
            return '审批中';
          }
          switch (stepStatus) {
            case 'error':
              return '已驳回';
            case 'success':
              return '已同意';
            case 'wait':
              return '未审批';
            default:
              return '';
          }
        case 'send':
          // 抄送节点状态
          if (actioning) {
            return '抄送中';
          }
          switch (stepStatus) {
            case 'error':
              return '抄送异常';
            case 'success':
              return '已抄送';
            case 'wait':
              return '未抄送';
            default:
              return '';
          }
        case 'process':
          // 审批节点状态
          if (actioning) {
            return '审批中';
          }
          switch (stepStatus) {
            case 'error':
              return '已驳回';
            case 'success':
              return '已同意';
            case 'wait':
              return '未审批';
            default:
              return '';
          }
        case 'action':
          // 动作节点状态
          if (actioning) {
            return '执行中';
          }
          switch (stepStatus) {
            case 'success':
              return '已执行';
            case 'error':
              return '已撤回';
            case 'wait':
              return '未执行';
            default:
              return '';
          }
        default:
          return '';
      }
    },
  }
}
</script>

<style lang="scss">
.users {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.user {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #808080;

  .nameAvatar {
    width: 26px;
    height: 26px;
    flex-grow: 1;
    display: flex;
    gap: 8px;
    align-items: center;

    .avatar {
      position: relative;

      .successIcon, .errorIcon {
        position: absolute;
        right: -8px;
        top: -10px;
      }

      .successIcon {
        text {
          color: $primary-color !important;
        }
      }

      .errorIcon {
        text {
          color: $uni-color-error !important;
        }
      }
    }

    image {
      border-radius: 4px;
      overflow: hidden;
      width: 26px;
      height: 26px;
    }

    :global .adm-badge-content {
      padding: 0;
    }

    .auditSuccess {
      color: var(--adm-color-primary);
      font-size: 14px;
    }

    .auditError {
      color: var(--adm-color-danger);
      font-size: 14px;
    }
  }

  :global .ant-avatar {
    font-size: 12px !important;
    border-radius: 4px;
  }
}

</style>
