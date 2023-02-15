<template>
  <view class='actionBottom' v-if="!(actionsData.length === 0 && createUser !== userInfo.id)">
    <view class='actions'>
      <view class='all' @click='more'>
        <view>更多</view>
        <uni-icons type="more-filled"></uni-icons>
      </view>

      <view class='buttons'>
        <view v-if="actionsData.length <= 1">
          <button
              :disabled='actionsData[0] ? actionsData[0].disabled : true'
              class='only'
              @click='actionClick(actionsData[0].action)'
          >
            {{ actionsData[0].name || statusName }}
          </button>
        </view>
        <view v-else>
          <button
              :disabled='actionsData[1].disabled'
              class='reject'
              plain="true"
              @click='actionClick(actionsData[1].action)'
          >
            {{ actionsData[1].name }}
          </button>
          <button
              :disabled='actionsData[0].disabled'
              class="ok"
              @click="actionClick(actionsData[0].action)"
          >
            {{ actionsData[0].name }}
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: [
    'taskDetail',
    'statusName',
    'createUser',
    'permissions',
    'actions',
    'taskId',
    'logIds',
  ],
  data() {
    return {
      revoke: '',
      actionsData: [],
      userInfo: {},
    }
  },
  mounted() {
    const actions = this.permissions ? this.actions : [];
    this.actionsData = actions
    const userInfo = getApp().globalData.userInfo || {}
    this.userInfo = userInfo
    if (!(actions.length === 0 && this.createUser !== userInfo.id)) {
      this.$emit('afertShow')
    }
  },
  methods: {
    more() {
      const current = this
      const list = [
        {text: '再次提交', key: 'resubmit', disabled: this.createUser !== this.userInfo.id},
        {text: '撤销', key: 'revoke', disabled: this.createUser !== this.userInfo.id || this.taskDetail.status !== 0},
        {
          text: '撤销并重新发起',
          key: 'revokeAndAsk',
          disabled: this.createUser !== this.userInfo.id || this.taskDetail.status !== 0
        },
        ...this.actionsData.filter((item, index) => index > 1).map(item => ({
          text: item.name,
          key: item.action,
          disabled: item.disabled,
        }))]
      const actionsList = list.filter(item => !item.disabled)
      uni.showActionSheet({
        itemList: actionsList.map(item => item.text),
        success(res) {
          // 选择其中任意一项后，获取其索引（res.tapIndex），从0开始
          current.actionClick(actionsList[res.tapIndex].key);
        },
      })
    },
    actionClick(action) {
      switch (action) {
        case 'revoke':
        case 'revokeAndAsk':
          // setOpenNote(action.key);
          break;
        case 'resubmit':
          this.$emit('onClick', 'revokeAndAsk')
          break;
        default:
          this.$emit('onClick', action)
          break;
      }
    }
  }
}
</script>

<style lang="scss">
.bottom {
  z-index: 999;

  .note {
    box-shadow: none;
  }

  .button {
    width: 100%;
    border-radius: 50px;
  }
}

.actions {
  display: flex;
  align-items: center;
}

.all {
  padding-right: 12px;
  color: #808080;
  //border-right: solid 1px #f5f5f5;
  text-align: center;
  //line-height: 0;

  div {
    line-height: 14px;
  }

  svg {
    color: #257BDE;
    font-size: 24px;
  }
}

.buttons {
  flex-grow: 1;
  border-radius: 50px;

  .reject {
    border-top-left-radius: 50px;
    border-bottom-left-radius: 50px;
    border-color: $primary-color;
    color: $primary-color;;
  }

  .ok {
    border-top-right-radius: 50px;
    border-bottom-right-radius: 50px;
    background-color: $primary-color;
    color: #fff;
  }

  button {
    display: inline-block;
    width: 50%;
    padding: 0;
    height: 40px;
    font-size: 14px;
  }

  .only {
    color: #fff;
    border-radius: 50px;
    width: 100%;
    height: 40px;
    background-color: $primary-color;
  }
}

.action {

  button {
    padding: 0;
    font-size: 18px;
    height: 58px;
  }
}

.actionBottom {
  //line-height: 60px;
  padding: 12px;
  height: 60px;
  z-index: 999;
  width: calc(100% - 24px);
  max-width: 640px;
  position: fixed;
  bottom: 0;
  left: auto;
  right: auto;
  background-color: #fff;
  box-shadow: 0 -4px 10px 0 rgba(0, 0, 0, 0.1);
}

</style>
