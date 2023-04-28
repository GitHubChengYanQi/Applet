<template>
  <view class="tenantSet">
    <view class="header">
      <view class="tenantIno">
        <Avatar
            size="40"
            circular
            v-if="tenant.logo.url"
            :src="tenant.logo.url"
            @click="preview(tenant.logo.url)"
        />
        <Icon v-else icon="icon-tuanduitouxiang" size="40" />
        <view class="name">
          {{ tenant.name }}
        </view>
      </view>
      <view class="update" v-if="tenant.admin" @click="tenantInfo">
        <view class="updateName">更改</view>
        <u-icon name="arrow-right" size="12" color="#929293" />
      </view>
    </view>

    <view class="actions">
      <view :class="['actionItem','startActionItem']" @click="addUserShow = true">
        <view class="icon">
          <Icon icon="icon-tianjiayonghu" size="24" />
        </view>
        <view class="actionName">
          <view class="name">添加用户</view>
          <u-icon name="arrow-right" size="12" color="#929293" />
        </view>
      </view>
      <view class="actionItem" @click="gotoJoinTenantList">
        <view class="icon">
          <Icon icon="icon-shenpijiaru" size="24" />
        </view>
        <view class="actionName">
          <view class="name">审批加入</view>
          <u-icon name="arrow-right" size="12" color="#929293" />
        </view>
      </view>
      <view :class="['actionItem','endActionItem']" @click="gotoUserList">
        <view class="icon">
          <Icon icon="icon-yonghuguanli" size="24" />
        </view>
        <view class="actionName">
          <view class="name">用户管理</view>
          <u-icon name="arrow-right" size="12" color="#929293" />
        </view>
      </view>
    </view>

    <view class="actions">
      <view :class="['actionItem','startActionItem']" @click="addUserShow = true">
        <view class="icon">
          <Icon icon="icon-tianjiayonghu" size="24" />
        </view>
        <view class="actionName">
          <view class="name">物料管理</view>
          <u-icon name="arrow-right" size="12" color="#929293" />
        </view>
      </view>
      <view class="actionItem" @click="gotoJoinTenantList">
        <view class="icon">
          <Icon icon="icon-shenpijiaru" size="24" />
        </view>
        <view class="actionName">
          <view class="name">仓储管理</view>
          <u-icon name="arrow-right" size="12" color="#929293" />
        </view>
      </view>
    </view>

    <view
        v-if="false"
        v-for="(item,index) in menus"
        :key="index"
        class="menu"
    >
      <view class="module">{{ item.name }}设置</view>
      <view
          v-for="menu in item.subMenus"
          :key="menu.code"
          class="menuItem"
          @click="menuClick(menu)"
      >
        <view class="menuName">
          <Icon :icon="menu.icon" size="20" />
          {{ menu.name }}
        </view>
        <Check :disabled="!tenant.admin" />
      </view>
    </view>

    <view class="dissolution" v-if="false">
      <MyButton @click="dissolution">解散团队</MyButton>
    </view>

    <AddUser :addUserShow="addUserShow" @close="addUserShow = false" />

    <Modal ref="modal" />

  </view>
</template>

<script>
import Icon from "../../components/Icon";
import Popup from "../../components/Popup";
import Loading from "../../components/Loading";
import AddUser from "./components/AddUser";
import Avatar from "../../components/Avatar";
import MyButton from "../../components/MyButton";
import {getLocalParmas} from "../../util/Tools";
import Modal from "../../components/Modal";
import {Tenant} from "MES-Apis/lib/Tenant/promise";
import {Init} from "MES-Apis/lib/Init";
import Check from "../../components/Check";
import {System} from "MES-Apis/lib/System/promise";
import {Message} from "../../components/Message";

export default {
  options: {
    styleIsolation: 'shared'
  },
  components: {Check, Modal, MyButton, Avatar, AddUser, Loading, Popup, Icon},
  data() {
    return {
      tenant: {},
      addUserShow: false,
      menus: []
    }
  },
  watch: {
    '$store.state.userInfo.tenant': {
      deep: true,
      handler(tenant) {
        this.tenant = tenant
      }
    }
  },
  mounted() {
    this.tenant = this.$store.state.userInfo.tenant || {}
    this.menus = this.$store.state.userInfo.menus || {}
  },
  methods: {
    preview(url) {
      uni.previewImage({
        current: url,
        urls: [url]
      })
    },
    gotoJoinTenantList() {
      if (!this.tenant.admin) {
        this.$refs.modal.dialog({
          title: '您不是当前团队管理员，无法进入！'
        })
        return
      }
      uni.navigateTo({
        url: '/Tenant/TenantSet/JoinTenantList/index'
      })
    },
    gotoUserList() {
      uni.navigateTo({
        url: '/User/UserList/index'
      })
    },
    tenantInfo() {
      uni.navigateTo({
        url: `/Tenant/CreateTenant/index?type=update&backUrl=${getLocalParmas().stringRoute}`
      })
    },
    dissolution() {
      const _this = this
      this.$refs.modal.dialog({
        title: '确认要解散团队吗？',
        content: '团队解散后不会恢复，请谨慎选择',
        only: false,
        confirmText: '确认解散',
        confirmError: true,
        onConfirm() {
          return new Promise((resolve) => {
            Tenant.deleteTenant(_this.tenant.tenantId).then(() => {
              _this.$refs.modal.dialog({
                title: '团队已解散',
                onConfirm() {
                  _this.$store.commit('userInfo/clear')
                  getApp().globalData.token = ''
                  uni.reLaunch({
                    url: '/pages/User/index'
                  })
                  return true
                }
              })
              resolve(true)
            }).catch(() => {
              _this.$refs.modal.dialog({
                title: Init.getNewErrorMessage() || '解散失败！'
              })
              resolve(true)
            })
          })

        }
      })
    },
    menuClick(menu) {
      if (!this.tenant.admin) {
        return
      }
      this.$refs.modal.dialog({
        title: '是否开启【' + menu.name + '】?',
        only: false,
        onConfirm() {
          return new Promise((resolve) => {
            System.menuConfig({
              data: {
                menuId: menu.id,
                hidden: 1
              }
            }).then(() => {
              resolve(true)
            }).catch(() => {
              Message.errorToast('开启失败！')
              resolve(true)
            })
          })
        }
      })
    },
    module(code) {
      switch (code) {
        case 'SPU':
          return '物料管理'
      }
    }
  }
}
</script>

<style lang="scss">
.tenantSet {
  padding: 20px 12px;

  .header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px;
    background-color: #fff;
    border-radius: 8px;

    .tenantIno {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-grow: 1;

      .name {
        font-size: 18px;
        font-weight: bold;
      }
    }

    .update {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;

      .updateName {
        color: #666666;
        margin-top: -3px;
      }
    }


  }

  .actions {
    margin-top: 18px;
    padding: 0 17px;
    background-color: #fff;
    border-radius: 8px;

    .actionItem {
      display: flex;
      align-items: center;
      gap: 23px;
      position: relative;

      &::before {
        content: '';
        position: absolute;
        width: 1px;
        background-color: #E1EBF6;
        height: calc(100% / 2 - 12px - 5px);
        left: 12px;
        top: 0;
      }

      &::after {
        content: '';
        position: absolute;
        width: 1px;
        background-color: #E1EBF6;
        height: calc(100% / 2 - 12px - 5px);
        left: 12px;
        bottom: 0;
      }

      .icon {
        width: 24px;
        height: 24px;
      }


      .actionName {
        flex-grow: 1;
        padding: 21px 0;
        border-bottom: 1px dashed rgba(57, 116, 199, 0.1);
        display: flex;
        align-items: center;

        .name {
          flex-grow: 1;
        }
      }
    }

    .startActionItem {
      &::before {
        content: none;
      }
    }

    .endActionItem {
      &::after {
        content: none;
      }

      .actionName {
        border: none;
      }
    }
  }

  .dissolution {
    margin-top: 56px;

    .myButton {
      width: 100%;

      button {
        width: 100% !important;
        border-radius: 50px;
        padding: 8px 0;
      }
    }
  }

  .menu {
    padding: 0 12px;
    background-color: #fff;
    border-radius: 8px;
    margin-top: 12px;

    .module {
      padding: 12px 0;
      font-weight: bold;
    }

    .menuItem {
      border-top: solid 1px #E1EBF6;
      padding: 12px 0;
      display: flex;
      align-items: center;

      .menuName {
        flex-grow: 1;
        display: flex;
        align-items: center;
        gap: 8px;
      }
    }
  }
}

</style>
