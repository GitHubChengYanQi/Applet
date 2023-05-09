<template>
  <view>
    <Popup
        round="15"
        :show="addUserShow"
        @close="$emit('close')"
        no-header-border
    >
      <template slot="title">
        <view class="title">
          添加用户
        </view>
      </template>
      <view class="addUserAction">
        <view class="addUserActionItem">
          <button class="share" open-type="share" :data-deptId="deptId">
            <view class="actionTitle">
              转发邀请给好友
            </view>
            <u-icon name="arrow-right" />
          </button>

        </view>
        <view class="addUserActionItem" @click="createCode">
          <view class="actionTitle">
            扫码加入
            <Icon icon="icon-erweima" size="14" />
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
import Popup from "../Popup";
import Loading from "../Loading";
import {System} from "MES-Apis/lib/System/promise";
import {Message} from "../Message";
import Modal from "../Modal";
import Icon from "../Icon";
import {Tenant} from "MES-Apis/lib/Tenant/promise";

export default {
  name: 'AddUser',
  components: {Icon, Modal, Loading, Popup},
  props: ['addUserShow', 'deptId'],
  data() {
    return {
      createCodeLoading: false,
    }
  },
  computed: {},
  methods: {
    async createCode() {
      const tenant = this.$store.state.userInfo.tenant || {}
      this.createCodeLoading = true
      const userInfo = this.$store.state.userInfo.userInfo || {}
      const invite = await Tenant.invite({
        data: {
          inviterUser: userInfo.id,
          type: '邀请',
          tenantId: tenant.tenantId,
          deptId: this.deptId
        }
      })
      System.createMiniAppCode({
        data: {
          scene: invite.data,
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

.title {
  font-weight: bold;
}

.addUserAction {
  padding: 25px 50px;

  .addUserActionItem {
    padding: 12px 0;
    border-bottom: solid 1px $body-color;
    display: flex;
    align-items: center;

    .actionTitle {
      flex-grow: 1;
      font-weight: 300;
      display: flex;
      align-items: center;
      gap: 8px;
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
