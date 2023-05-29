<template>
  <view class="switchTenant">
    <view class="header">
      <view class="title">
        快速创建我的团队
      </view>
      <MyButton color="#FA8F2B" type="primary" @click="create">
        <u-icon name="plus" color="#fff" />
        创建新的团队
      </MyButton>
    </view>
    <view class="tenants">
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
            <Avatar size="26" circular v-if="item.logoResult.thumbUrl" :src="item.logoResult.thumbUrl" />
            <Icon v-else icon="icon-tuanduitouxiang" size="26" />
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
import Avatar from "../../components/Avatar";

export default {
  options: {
    styleIsolation: 'shared'
  },
  components: {Avatar, Modal, Icon, Empty, Loading, MyButton},
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
        url: `/Tenant/CreateTenant/index?backUrl=${getLocalParmas('/Tenant/TenantSet/index').stringRoute}`
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
      const _this = this
      this.$refs.modal.dialog({
        title: '确认要切换企业吗？',
        content: tenant.name,
        only: false,
        onConfirm() {
          return new Promise((resolve) => {
            Tenant.switchTenant({
              data: {tenantId: tenant.tenantId}
            }, {
              onSuccess: (res) => {
                resolve(true)
                getApp().globalData.shareTenantId = undefined
                getApp().globalData.token = res
                _this.$refs.modal.dialog({
                  title: '切换成功！点击返回首页',
                  onConfirm() {
                    _this.$store.commit('userInfo/clear')
                    uni.reLaunch({
                      url: '/pages/Home/index'
                    })
                    return true
                  }
                })
              },
              onError: () => {
                resolve(true)
                _this.$refs.modal.dialog({
                  title: Init.getNewErrorMessage() || '切换失败！'
                })
              }
            })
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
.switchTenant {
  padding: 21px 12px;

  .header {
    display: flex;
    align-items: center;
    padding: 12px;
    background-color: #fff;
    border-radius: 8px;

    .title {
      flex-grow: 1;
    }

    .myButton {

      button {
        border-radius: 50px;
        display: flex;
        align-items: center;
        gap: 8px;
      }
    }

  }

  .tenants {
    background-color: #fff;
    border-radius: 8px;
    margin-top: 12px;
    padding: 0 14px;

    .tenant {
      display: flex;
      align-items: center;
      border-bottom: solid 1px $body-color;

      .name {
        display: flex;
        align-items: center;
        gap: 14px;
        flex-grow: 1;
        padding: 14px 0;
      }
    }
  }
}

</style>
