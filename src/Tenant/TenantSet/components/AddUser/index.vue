<template>
  <view>
    <Popup
        title="添加用户"
        :show="addUserShow"
        @close="$emit('close')"
    >
      <view class="addUserAction">
        <view class="addUserActionItem">
          <button class="share" open-type="share">
            <view class="actionTitle">
              转发邀请给好友
            </view>
            <u-icon name="arrow-right" />
          </button>

        </view>
        <view class="addUserActionItem" @click="createCode">
          <view class="actionTitle">
            扫码加入
          </view>
          <u-icon name="arrow-right" />
        </view>
      </view>
    </Popup>

    <Loading :loading="createCodeLoading" />

    <Modal ref="modal" />

  </view>
</template>
<script>
import Popup from "../../../../components/Popup";
import Loading from "../../../../components/Loading";
import {System} from "MES-Apis/lib/System/promise";
import {Message} from "../../../../components/Message";
import Modal from "../../../../components/Modal";

export default {
  name: 'AddUser',
  components: {Modal, Loading, Popup},
  props: ['addUserShow'],
  data() {
    return {
      createCodeLoading: false,
    }
  },
  methods: {
    createCode() {
      const tenant = this.$store.state.userInfo.tenant || {}
      this.createCodeLoading = true
      System.createMiniAppCode({
        data: {
          scene: tenant.tenantId,
          page: 'Tenant/JoinTenant/index',
          checkPath: false,
          envVersion: process.env.NODE_ENV === "development" ? 'develop' : 'release',
          width: 100,
        }
      }).then((res) => {
        const img = `data:image/png;base64,${res.data.toString('base64')}`
        uni.previewImage({
          current: img,
          urls: [img]
        })
      }).catch(() => {
        this.$refs.modal.dialog({
          title: '生成失败！'
        })
      }).finally(() => {
        this.createCodeLoading = false
      })
    }
  }
}
</script>

<style lang="scss">
.addUserAction {
  padding: 12px;

  .addUserActionItem {
    padding: 12px 0;
    border-bottom: solid 1px $body-color;
    display: flex;
    align-items: center;

    .actionTitle {
      flex-grow: 1;
    }

    .share {
      background-color: #fff;
      width: 100%;
      border: none;
      border-radius: 0;
      box-shadow: none;
      color: unset;
      font-size: unset;
      line-height: unset;
      display: flex;
      align-items: center;
      text-align: left;
      padding: 0;

      &::after {
        border: none;
      }
    }
  }
}
</style>
