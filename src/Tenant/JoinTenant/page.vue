<template>
  <view>
    <u-notify ref="uNotify" message="Hi uView"></u-notify>
    <Empty description="获取团队失败！" v-if="error" />
    <Loading skeleton skeleton-type="page" v-else-if="loading" />
    <view class="joinTenant" v-else>
      <view class="tenantInfo">
        <Avatar
            size="100"
            circular
            v-if="tenant.logoResult && tenant.logoResult.url"
            :src="tenant.logoResult && tenant.logoResult.url"
        />
        <Icon v-else icon="icon-tuanduitouxiang" size="80" />
        <view class="name">
          <view class="inviterUser">
            <span class="userName">
               {{ inviter.userResult ? inviter.userResult.name : '-' }}
            </span>
            邀请您加入
          </view>
          <view>
            <Icon icon="icon-xiangxia" size="16" />
          </view>

          <Divider class="divider">
            <view class="tenantName">
              {{ tenant.name || '-' }}
              <view class="inviterDept" v-if="inviter.dept && inviter.dept.deptId">
                {{ inviter.dept ? inviter.dept.fullName : '-' }}
              </view>
            </view>
          </Divider>
        </view>

        <view class="action">
          <LoginByPhone
              :disabled="disabled"
              :loading="joinLoading"
              @click="()=>joinStatus=== 99 ? switchTenant() : join()"
          >
            {{ joinStatusText() }}
          </LoginByPhone>
          <view class="countDown" v-if="joinStatus === 99">
            <u-count-down :time="5000" format="ss" @finish="switchTenant()" />
            秒后自动进入
          </view>
          <view class="countDown" @click="reload" v-if="joinStatus === 1">
            <u-icon name="reload" size="24" color="#007aff" />
          </view>
        </view>

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
import {Init} from "MES-Apis/lib/Init";
import Modal from "../../components/Modal";
import GetUserInfo from "../../util/GetUserInfo";
import LoginByPhone from "../../components/LoginByPhone";
import Avatar from "../../components/Avatar";
import Divider from "../../components/Divider";

export default {
  options: {
    styleIsolation: 'shared'
  },
  components: {Divider, Avatar, LoginByPhone, Modal, Icon, Loading, Empty},
  props: ['inviter'],
  data() {
    return {
      tenant: {},
      loading: false,
      loginLoading: false,
      error: false,
      joinLoading: false,
      joinStatus: null,
      disabled: false,
      timeOutKey: null
    }
  },
  mounted() {
    const userInfo = GetUserInfo().userInfo || {};
    this.getTenantDetail(!!userInfo.userId)
  },
  methods: {
    async refresh() {
      const userInfo = GetUserInfo().userInfo || {};
      await this.getTenantDetail(!!userInfo.userId)
      uni.stopPullDownRefresh();
    },
    reload() {
      this.getStatus().then(() => {
        this.$refs.uNotify.primary('刷新完成')
      })
    },
    joinStatusText() {
      switch (this.joinStatus) {
        case 1:
          this.disabled = true
          return '申请中，等待管理员审批'
        case 50:
          this.disabled = false
          return '申请已被拒绝，重新发起申请'
        case 99:
          this.disabled = false
          return '进入团队'
        default:
          this.disabled = false
          return '申请加入'
      }
    },
    async getTenantDetail(isLogin) {
      this.loading = true
      await Tenant.tenantDetail(this.inviter.tenantId).then((res) => {
        this.tenant = res.data || {}
        if (isLogin) {
          this.getStatus()
        }
      }).catch(() => {
        this.error = true
      }).finally(() => {
        this.loading = false
      })
    },
    getStatus() {
      clearTimeout(this.timeOutKey)
      return new Promise((resolve, reject) => {
        Tenant.joinTenantStatus({
          data: {
            tenantId: this.inviter.tenantId
          }
        }).then((res) => {
          this.joinStatus = res.data
          this.waitJoinUsers = res.data || 0
          this.timeOutKey = setTimeout(() => {
            this.getStatus()
          }, 5000)
          resolve();
        }).catch(() => {
          this.error = true
          reject()
        })
      })
    },
    join() {
      this.joinLoading = true
      const _this = this
      Tenant.joinTenant({
        data: {tenantInviteLogId: this.inviter.tenantInviteLogId}
      }).then(() => {
        this.$refs.modal.dialog({
          title: '申请成功！请等待管理员审批。',
          onConfirm() {
            _this.getStatus()
            return true
          }
        })
      }).catch(() => {
        this.$refs.modal.dialog({
          title: Init.getNewErrorMessage() || '申请失败！',
          onConfirm() {
            _this.getStatus()
            return true
          }
        })
      }).finally(() => {
        this.joinLoading = false
      })
    },
    switchTenant() {
      this.joinLoading = true
      Tenant.switchTenant({
        data: {tenantId: this.inviter.tenantId}
      }, {
        onSuccess: (res) => {
          this.joinLoading = false
          getApp().globalData.shareTenantId = undefined
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
  background-color: #fff;
  margin: 33px 21px;
  border-radius: 15px;
  padding: 7px;
  box-shadow: 0 1px 12px 0 rgba(0, 0, 0, 0.1);

  .tenantInfo {
    border-radius: 15px;
    box-sizing: border-box;
    border-width: 1px;
    border-style: dashed;
    border-color: #E8E8E8;
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 12px;
    width: 100%;
    padding: 47px 30px 40px;
  }


  .name {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-direction: column;
    justify-content: center;
    width: 100%;

    .divider {
      width: 100%;
    }


    .inviterUser {
      font-size: 14px;
      font-weight: 400;

      .userName {
        color: #FA8F2B;
        padding-right: 8px;
      }
    }

    .tenantName {
      font-size: 18px;
      font-weight: bold;
      display: flex;
      align-items: center;
      gap: 6px;
      flex-direction: column;
      justify-content: center;
      padding: 0 12px;

      .inviterDept {
        font-size: 16px;
        font-weight: 400;
      }
    }


  }

  .action {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;

    .countDown {
      display: flex;
      align-items: center;
      font-size: 12px;
      color: #999999;
      font-weight: 400;
    }
  }


}

.loginByPhone {
  margin-top: 27px;
  border-radius: 50px;
  background: #FA8F2B;
  color: #fff;
  height: 40px !important;
  width: 150px !important;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 40px !important;

  &:after {
    content: none;
  }
}

.u-count-down__text {
  font-size: 12px !important;
  padding-right: 4px;
  color: #999999 !important;
}
</style>
