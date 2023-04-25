<template>
  <view>
    <u-notify ref="uNotify" message="Hi uView"></u-notify>
    <Empty description="获取团队失败！" v-if="error" />
    <Loading skeleton skeleton-type="page" v-else-if="loading" />
    <view class="joinTenant" v-else>
      <Icon icon="icon-team-fill" size="80" />
      <view class="name">
        {{ tenant.name }}
      </view>
      <MyButton
          :disabled="disabled"
          :loading="joinLoading"
          type="primary"
          @click="()=>joinStatus=== 99 ? switchTenant() : join()"
      >
        {{ joinStatusText() }}
      </MyButton>
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
import MyButton from "../../components/MyButton";
import {Message} from "../../components/Message";
import {Init} from "MES-Apis/lib/Init";
import Modal from "../../components/Modal";

export default {
  components: {Modal, MyButton, Icon, Loading, Empty},
  props: ['tenantId'],
  data() {
    return {
      tenant: {},
      loading: false,
      error: false,
      joinLoading: false,
      joinStatus: null,
      disabled: false
    }
  },
  mounted() {
    this.getTenantDetail()
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
          return '已同意申请，进入团队'
        default:
          return '申请加入'
      }
    },
    async getTenantDetail() {
      this.loading = true
      Tenant.tenantDetail(this.tenantId).then((res) => {
        this.tenant = res.data || {}
        this.getStatus()
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
      Tenant.joinTenant(this.tenantId).then(() => {
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

.action {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 29px;
}
</style>
