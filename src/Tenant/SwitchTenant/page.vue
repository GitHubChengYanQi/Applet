<template>
  <view class="switchTenant">
    <view class="header">
      <view class="title">
        快速创建我的团队
      </view>
      <MyButton type="primary" @click="create">创建新的团队</MyButton>
    </view>
    <view class="tenants">
      <view class="title">进入团队</view>
      <Loading skeleton v-if="loading" />
      <view v-else>
        <Empty description="暂无其他团队，请创建" v-if="list.length === 0" />
        <view
            v-for="(item,index) in list"
            :key="index"
            class="tenant"
            :style="{border:index === list.length - 1 && 'none'}"
            @click="switchTenant(item)"
        >
          <view class="name">
            <Icon icon="icon-team-fill" size="20" />
            {{ item.name }}
          </view>
          <u-icon name="checkbox-mark" v-if="item.tenantId === currentTenantId" color="#007aff" />
          <u-icon name="arrow-right" v-else />
        </view>
      </view>

      <Loading :loading="switchLoading" title="正在切换团队" />
    </view>

    <Modal ref="modal" />

  </view>
</template>

<script>
import MyButton from "../../components/MyButton";
import {Tenant} from "MES-Apis/lib/Tenant/promise";
import Loading from "../../components/Loading";
import Empty from "../../components/Empty";
import Icon from "../../components/Icon";
import {Message} from "../../components/Message";
import {Init} from "MES-Apis/lib/Init";
import {getLocalParmas} from "../../util/Tools";
import Modal from "../../components/Modal";

export default {
  components: {Modal, Icon, Empty, Loading, MyButton},
  data() {
    return {
      loading: false,
      list: [],
      currentTenantId: '',
      switchLoading: false
    }
  },
  mounted() {
    const tenant = this.$store.state.userInfo.tenant || {}
    this.currentTenantId = tenant.tenantId
    this.tenantList()
  },
  methods: {
    create() {
      uni.navigateTo({
        url: `/Tenant/CreateTenant/index?backUrl=${getLocalParmas().stringRoute}`
      })
    },
    tenantList() {
      this.loading = true
      Tenant.myTenantList({data: {}}).then((res) => {
        this.list = res.data || []
      }).finally(() => {
        this.loading = false
      })
    },
    switchTenant(tenant) {
      if (tenant.tenantId === this.currentTenantId) {
        return
      }
      this.switchLoading = true
      Tenant.switchTenant({
        data: {tenantId: tenant.tenantId}
      }, {
        onSuccess: (res) => {
          this.switchLoading = false
          Message.successToast('切换成功！', () => {
            getApp().globalData.token = res
            this.$store.commit('userInfo/clear')
            uni.reLaunch({
              url: '/pages/Home/index'
            })
          })
        },
        onError: () => {
          this.switchLoading = false
          this.$refs.modal.dialog({
            title: Init.getNewErrorMessage() || '切换失败！'
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
.switchTenant {
  padding: 8px;

  .header {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    background-color: #fff;
    border-radius: 4px;

    .title {
      flex-grow: 1;
    }

    .myButton {
      width: 100%;

      button {
        border-radius: 50px;
      }
    }

  }

  .tenants {
    background-color: #fff;
    border-radius: 4px;
    margin-top: 12px;
    padding: 8px 12px;

    .title {
      padding-bottom: 8px;
      border-bottom: solid 1px $body-color;
    }

    .tenant {
      display: flex;
      align-items: center;
      padding: 8px 0;
      border-bottom: solid 1px $body-color;

      .name {
        display: flex;
        align-items: center;
        gap: 4px;
        flex-grow: 1;
      }
    }
  }
}

</style>
