<template>
  <view>
    <u-notify ref="uNotify" message="Hi uView"></u-notify>
    <Empty description="获取团队失败！" v-if="error" />
    <Loading skeleton skeleton-type="page" v-else-if="loading" />
    <view class="joinTenant" v-else>
      <Avatar
          size="80"
          circular
          v-if="tenant.logo.url"
          :src="tenant.logoResult.url"
      />
      <Icon v-else icon="icon-tuanduitouxiang" size="80" />
      <view class="name">
        {{ tenant.name || '-' }}
      </view>

      <LoginByPhone
          :disabled="disabled"
          :loading="joinLoading"
          @click="()=>joinStatus=== 99 ? switchTenant() : join()"
      >
        {{ joinStatusText() }}
      </LoginByPhone>

      <view @click="reload" v-if="joinStatus === 0">
        <u-icon name="reload" size="24" color="#007aff" />
      </view>

    </view>

    <Modal ref="modal" />

  </view>
</template>

<script>
import {Tenant} from "MES-Apis/lib/Tenant/promise";
import Empty from "../../components/Empty";
import Loading from "../../components/Loading";
import Icon from "../../components/Icon";
import {Message} from "../../components/Message";
import {Init} from "MES-Apis/lib/Init";
import Modal from "../../components/Modal";
import GetUserInfo from "../../util/GetUserInfo";
import {Login} from "MES-Apis/lib/Login/promise";
import LoginByPhone from "../../components/LoginByPhone";
import Avatar from "../../components/Avatar";

export default {
  options: {
    styleIsolation: 'shared'
  },
  components: {Avatar, LoginByPhone, Modal, Icon, Loading, Empty},
  props: ['tenantId', 'deptId'],
  data() {
    return {
      tenant: {},
      loading: false,
      loginLoading: false,
      error: false,
      joinLoading: false,
      joinStatus: null,
      disabled: false,
    }
  },
  mounted() {
    const userInfo = GetUserInfo().userInfo || {};
    this.getTenantDetail(!!userInfo.userId)
  },
  methods: {
    reload() {
      this.getStatus().then(() => {
        this.$refs.uNotify.primary('刷新完成')
      })
    },
    joinStatusText() {
      switch (this.joinStatus) {
        case 0:
          this.disabled = true
          return '申请中，等待管理员审批'
        case 50:
          this.disabled = false
          return '申请已被拒绝，重新发起申请'
        case 99:
          this.disabled = false
          return '进入团队'
        default:
          return '申请加入'
      }
    },
    async getTenantDetail(isLogin) {
      this.loading = true
      Tenant.tenantDetail(this.tenantId).then((res) => {
        this.tenant = res.data || {}
        if (isLogin) {
          this.getStatus()
        } else {
          this.loading = false
        }
      }).catch(() => {
        this.error = true
      })
    },
    getStatus() {
      return new Promise((resolve, reject) => {
        this.loading = true
        Tenant.joinTenantStatus(this.tenantId).then((res) => {
          this.joinStatus = res.data
          resolve();
        }).catch(() => {
          this.error = true
          reject()
        }).finally(() => {
          this.loading = false
        })
      })

    },
    join() {
      this.joinLoading = true
      Tenant.joinTenant({
        data: {
          tenantId: this.tenantId,
          deptId: this.deptId
        }
      }).then(() => {
        this.getStatus()
        this.$refs.modal.dialog({
          title: '申请成功！请等待管理员审批。'
        })
      }).catch(() => {
        this.$refs.modal.dialog({
          title: Init.getNewErrorMessage() || '申请失败！'
        })
      }).finally(() => {
        this.joinLoading = false
      })
    },
    switchTenant() {
      this.joinLoading = true
      Tenant.switchTenant({
        data: {tenantId: this.tenantId}
      }, {
        onSuccess: (res) => {
          this.joinLoading = false
          getApp().globalData.token = res
          this.$store.commit('userInfo/clear')
          uni.reLaunch({
            url: '/pages/Home/index'
          })
        },
        onError: () => {
          this.joinLoading = false
          this.$refs.modal.dialog({
            title: Init.getNewErrorMessage() || '进入团队失败！'
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
.joinTenant {
  height: 100vh;
  background-color: #fff;
  padding: 20vw;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 12px;
  font-size: 24px;
  font-weight: bold;
}

.loginByPhone {
  color: #fff;
  background-color: #3c9cff;
  border-radius: 3px;
  height: fit-content !important;
  width: fit-content !important;
  padding: 4px 15px;
  font-size: 14px;
}
</style>
