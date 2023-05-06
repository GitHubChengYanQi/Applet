<template>
  <view v-if="auditType">
    <view class="step">
      <view class="status">
        <view :class="['icon',iconColor]">
          <uni-icons type="auth"></uni-icons>
        </view>
        <view :class="['line',lineStatus]" v-if="step.childNode" />
      </view>
      <view class='uni-steps__column-text'>
        <template v-if="auditType === 'start'">
          <view class='uni-steps__column-title'>
            <view class='title'>
              <view>发起人 · {{ nodeStatusName(step.auditType, stepStatus, actioning) }}</view>
              <view :class="hidden ? 'hidden' : 'noHidden'" @click="hiddenChange(hidden)" />
            </view>
          </view>
          <view class='uni-steps__column-desc'>
            <view v-if="!hidden">
              <view v-if="createUser.name">
                <AuditUsers
                    :old="old"
                    :users="old ? [{name: createUser.name,miniAppAvatar: createUser.miniAppAvatar,auditStatus: 99,}] : logResults"
                    :step="step"
                />
              </view>
              <view v-else>
                <view class="users">
                  <AuditUsers
                      :users="rules(step).users"
                      :step="step"
                      :old="true"
                  />
                </view>
              </view>
            </view>
          </view>
        </template>
        <template v-if="auditType === 'route'"></template>
        <template v-if="auditType === 'send' || auditType === 'process'">
          <view class='uni-steps__column-title'>
            <view class='title'>
              {{ title }}
              <view :class="hidden ? 'hidden' : 'noHidden'" @click="hiddenChange(hidden)" />
            </view>
          </view>
          <view
              class='uni-steps__column-desc'
          >
            <view v-if="!hidden">
              <AuditUsers
                  :users="logResults"
                  :step="step"
              />
            </view>
          </view>
        </template>
      </view>
    </view>
    <Step
        :old="old"
        :hiddenSteps="hiddenSteps"
        :step="step.childNode || []"
        :create-user="createUser"
        :next="old ? step.logResult && step.logResult.status === 1 : success"
        :index="index+1"
        :hidden="hiddenSteps.includes(index+1)"
        @hiddenStepChange="(steps)=>$emit('hiddenStepChange', steps)"
    />
  </view>

</template>

<script>
import AuditUsers from '../AuditUsers'
import Step from './index'

export default {
  components: {AuditUsers, Step},
  props: ['step', 'next', 'index', 'createUser', 'line', 'hiddenSteps', 'hidden', 'old'],
  data() {
    return {
      logResults: [],
      auditType: '',
      success: false,
      actioning: false,
      stepStatus: '',
      lineStatus: '',
      iconColor: '',
      title: ''
    }
  },
  mounted() {
    this.auditType = this.step.auditType

    let stepStatus = 'wait';

    let lineStatus = 'lineWait';

    let iconColor = '';

    let actioning = false;

    if (this.old) {
      switch (this.step.logResult && this.step.logResult.status) {
        case -1:
          if (this.next) {
            stepStatus = 'wait';
            iconColor = 'action';
            actioning = true;
            break;
          }
          stepStatus = 'wait';
          iconColor = 'wait';
          break;
        case 0:
          stepStatus = 'error';
          lineStatus = 'lineError'
          iconColor = 'error';
          break;
        case 1:
          stepStatus = 'success';
          lineStatus = 'lineSuccess'
          iconColor = 'success';
          break;
        case 3:
          stepStatus = 'wait';
          iconColor = 'action';
          actioning = true;
          break;
        default:
          break;
      }
    } else {
      const logResults = this.step.logResults || [];

      this.logResults = logResults

      const nextWait = logResults.filter((item) => item.status === 3).length === logResults.length;
      const error = logResults.filter((item) => item.status === 0 || item.status === 2).length > 0;
      const success = logResults.filter((item) => item.status === 1).length > 0;
      this.success = success
      if (logResults.length === 0) {
        if (this.next) {
          iconColor = 'action';
          actioning = true;
        } else {
          iconColor = 'wait';
        }
      } else if (success) {
        stepStatus = 'success';
        lineStatus = 'lineSuccess';
        iconColor = 'success';
      } else if (error) {
        stepStatus = 'error';
        lineStatus = 'lineError';
        iconColor = 'error';
      } else if (nextWait) {
        iconColor = 'action';
        actioning = true;
      } else {
        iconColor = 'wait';
      }
    }

    this.stepStatus = stepStatus
    this.lineStatus = lineStatus
    this.actioning = actioning
    this.iconColor = iconColor

    let title;
    if (this.step.auditType === 'send') {
      title = `抄送人 · ${this.nodeStatusName(this.step.auditType, stepStatus, actioning)}`
    } else if (this.step.auditRule?.type === 'audit') {
      title = `审批人 · ${this.nodeStatusName(this.step.auditType, stepStatus, actioning)}`
    } else {
      const actionStatuses = this.step.auditRule?.actionStatuses || [];
      title = `${this.step.stepsName || actionStatuses.map(item => item.actionName || '执行动作').join('、')} · ${this.nodeStatusName('action', stepStatus, actioning)}`
    }
    this.title = title
  },
  methods: {
    hiddenChange(hidden) {
      if (hidden) {
        this.$emit('hiddenStepChange', this.hiddenSteps.filter(item => item !== this.index))
      } else {
        this.$emit('hiddenStepChange', [...this.hiddenSteps, this.index])
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
    rules(step, status) {
      const users = [];
      const rules = step.auditRule.rules || [];

      if (rules.length > 0) {
        rules.forEach((items) => {
          const appointUsers = items.appointUsers || [];
          if (appointUsers.length > 0) {
            appointUsers.map((itemuser) => {
              return users.push({
                name: itemuser.title,
                miniAppAvatar: itemuser.miniAppAvatar,
                auditStatus: status || itemuser.auditStatus,
              });
            });
          } else {
            switch (items.type) {
              case 'AppointUsers':
                appointUsers.map((itemuser) => {
                  return users.push({
                    name: itemuser.title,
                    miniAppAvatar: itemuser.miniAppAvatar,
                    auditStatus: status || itemuser.auditStatus,
                  });
                });
                break;
              case 'DeptPositions':
                items.deptPositions && items.deptPositions.map((itemdept) => {
                  return users.push({
                    name: `${itemdept.title}(${itemdept.positions && itemdept.positions.map((items) => {
                      return items.label;
                    })})`,
                    auditStatus: status,
                  });
                });
                break;
              case 'AllPeople':
                users.push({name: '所有人', auditStatus: status || 99});
                break;
              case 'MasterDocumentPromoter':
                users.push({name: '主单据发起人', auditStatus: status});
                break;
              case 'Director':
                users.push({name: '单据负责人', auditStatus: status});
                break;
              default:
                break;
            }
          }
        });
        return {
          users,
          step
        }
      }
    }
  },
}
</script>

<style lang="scss">

.wait, .lineWait {
  background-color: #ccc;

  text {
    color: #fff !important;
  }
}

.action, .lineSuccess {
  background-color: $primary-color;

  text {
    color: #fff !important;
  }
}

.success {
  border: solid 1px $primary-color;
  background-color: #fff;

  text {
    color: $primary-color !important;
  }
}

.error, .lineError {
  background-color: $uni-color-error;

  text {
    color: #fff !important;
  }
}

.step {
  display: flex;

  .status {
    padding-top: 4px;
    margin-right: 8px;

    .icon {
      width: 24px;
      height: 24px;
      border-radius: 50px;
      line-height: 24px;
      text-align: center;
    }

    .line {
      width: 2px;
      margin: 4px auto;
      height: calc(100% - 30px);
    }
  }
}

.hidden {
  width: 0;
  height: 0;
  border: 8px solid transparent;
  border-top-color: #d8d8d8;
  margin-bottom: -8px;
}

.noHidden {
  width: 0;
  height: 0;
  border: 8px solid transparent;
  border-bottom-color: #d8d8d8;
  margin-top: -8px;
}


.title {
  font-size: 14px;
  font-weight: bold;
  color: #000000;
  display: flex;
  gap: 8px;
  align-items: center;

  svg {
    color: #D8D8D8;
  }
}

.uni-steps__column-text {
  flex-grow: 1;
  padding: 6px 0;

  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: column;
}

.uni-steps__column-title {
  font-size: 14px;
  font-weight: bold;
  text-align: left;
  line-height: 18px;
}

.uni-steps__column-desc {
  font-size: 12px;
  text-align: left;
  line-height: 25px;
  padding: 8px 8px 8px 0;
  flex-grow: 1;
}

.users {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
