<template>
  <view class="uViewModal">
    <u-modal
        :show="show"
        :title="title"
        :showCancelButton="true"
    >
      <slot v-if="show">
        <view class="content">
          {{ content }}
        </view>
      </slot>
      <template slot="confirmButton">
        <view class="buttons">
          <template v-if="!only">
            <view class="cancel" v-if="cancelLoading">
              <u-loading-icon mode="circle" />
            </view>
            <view class="cancel" v-else @click="onCancel">
              {{ cancelText }}
            </view>
            <view class="line" />
          </template>
          <view class="confirm" v-if="confirmLoading">
            <u-loading-icon mode="circle" />
          </view>
          <view :class="{confirm:true,error:confirmError}" v-else @click="onConfirm">
            {{ confirmText }}
          </view>
        </view>
      </template>
    </u-modal>
  </view>
</template>

<script>
export default {
  name: 'Modal',
  options: {
    styleIsolation: 'shared'
  },
  data() {
    return {
      show: false,
      cancelLoading: false,
      confirmLoading: false,
      title: '',
      content: '',
      confirmText: '',
      confirmError: '',
      cancelText: '',
      onCancel: () => {
      },
      onConfirm: () => {
      },
      only: false
    }
  },
  methods: {
    showStatus() {
      return this.show
    },
    close() {
      this.show = false
    },
    dialog({
             title = '',
             content = '',
             confirmText = '确认',
             cancelText = '取消',
             onCancel,
             onConfirm,
             confirmError,
             only = true,
           }) {
      setTimeout(() => {
        this.show = true
      }, 0)
      this.title = title
      this.content = content
      this.confirmError = confirmError
      this.confirmText = confirmText
      this.cancelText = cancelText
      this.onCancel = async () => {
        if (typeof onCancel === 'function') {
          this.cancelLoading = true
          const res = await onCancel()
          this.show = !res
          this.cancelLoading = false
        } else {
          this.show = false
        }
      }
      this.onConfirm = async () => {
        if (typeof onConfirm === 'function') {
          this.confirmLoading = true
          const res = await onConfirm()
          this.show = !res
          this.confirmLoading = false
        } else {
          this.show = false
        }
      }
      this.only = only
    }
  }
}
</script>

<style lang="scss">

.uViewModal {
  .buttons {
    display: flex;
    align-items: center;


    .confirm, .cancel {
      flex-grow: 1;
      text-align: center;
      padding: 15px 0;
    }

    .confirm {
      color: $primary-color;
    }

    .error {
      color: $uni-color-error;
    }

    .cancel {

    }

    .line {
      background-color: rgb(214, 215, 217);
      height: 50px;
      width: 1px;
    }
  }

  .u-modal__button-group--confirm-button {
    border-top: 1px solid rgb(214, 215, 217);
    padding: 0;
  }

  .content {
    text-align: center;
    color: #606266;
  }

  .u-transition {
    z-index: 10076 !important;
  }
}

</style>
