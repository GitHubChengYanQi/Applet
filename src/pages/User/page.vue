<template>
  <view class="home">
    <view class="content">
      <view class="header">
        <view class="user">
          <view class="userInfo" @click="clickAvatar">
            <Avatar size="30" :src="userInfo.avatar" circular />
            <view class="name">
              {{ userInfo.name }}
              <u-icon name="arrow-right" size="9" v-if="false" />
            </view>
            <view class="dept" v-if="false">
              {{ isArray(userInfo.dept)[0] || '' }}
              {{ isArray(userInfo.dept)[0] && isArray(userInfo.role)[0] && '-' || '' }}
              {{ isArray(userInfo.role)[0] || '' }}
            </view>
          </view>
          <view class="switchTenant" @click="switchTenant">
            <Icon icon="icon-qiehuantuandui" size="14" />
            切换/创建团队
          </view>
        </view>
        <view class="tenant">
          <view class="tenantInfo">
            <view class="tenantName">
              {{ tenant.name || '暂无团队' }}
            </view>
            <view class="des">
              添加用户，设置组织架构，权限和功能配置等
            </view>
          </view>
          <view class="tanantSet" @click="tanantSet">
            团队设置
          </view>
          <img class="image" src="../../static/images/user/tenant.png" />
        </view>
        <view>

        </view>
      </view>

      <view class="menuCard">
        <view class="title">管理工具</view>
        <MenuCard
            :menus="menus"
            :column="4"
            font-size="16"
            icon-size="39"
            padding="20px 0"
            @click="click"
        />
      </view>

      <view style="padding-top: 29px" />

      <view class="title">帮助中心</view>

      <OtherActions />
    </view>

  </view>
</template>

<script>

import Icon from "../../components/Icon";
import {routes} from "../../route";
import Avatar from "../../components/Avatar";
import MenuCard from "../../components/MenuCard";
import {getLocalParmas, isArray} from "../../util/Tools";
import OtherActions from "../components/OtherActions";
import MyButton from "../../components/MyButton";

export default {
  options: {
    styleIsolation: 'shared'
  },
  props: [],
  components: {MyButton, OtherActions, MenuCard, Avatar, Icon},
  data() {
    return {
      isArray,
      menus: [],
      userInfo: {},
      tenant: {}
    }
  },
  mounted() {
    const menus = []
    routes.forEach(item => {
      item.menus.forEach(item => {
        if (item.type && item.type.includes('my')) {
          menus.push(item)
        }
      })
    })
    this.menus = menus
    this.init()
  },
  watch: {
    '$store.state.userInfo.userInfo': {
      deep: true,
      handler(userInfo) {
        console.log(userInfo)
        this.userInfo = userInfo
      }
    }
  },
  methods: {
    tanantSet() {
      uni.navigateTo({
        url: '/Tenant/TenantSet/index'
      })
    },
    switchTenant() {
      uni.navigateTo({
        url: '/Tenant/SwitchTenant/index'
      })
    },
    init() {
      this.userInfo = this.$store.state.userInfo.userInfo
      this.tenant = this.$store.state.userInfo.tenant
    },
    tenantMenusClick(menu) {
      switch (menu.key) {
        case 'createTenant':
          uni.navigateTo({
            url: `/Tenant/CreateTenant/index?backUrl=${getLocalParmas().stringRoute}`
          })
          break
        case 'tenantSet':

          break
        default:
          break
      }
    },
    click(menu) {
      uni.navigateTo({
        url: menu.url
      })
    },
    clickAvatar() {
      uni.navigateTo({
        url: '/User/UserInfo/index'
      })
    }
  }
}
</script>

<style lang="scss">
.home {
  height: 100vh;

  .content {
    overflow: auto;
    padding: 20px 12px;
  }

  .header {
    border-radius: 8px;
    overflow: hidden;

    .user {
      display: flex;
      align-items: center;
      background-color: #fff;
      padding: 4px 8px;

      .userInfo {
        flex-grow: 1;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 0;
        background-color: #fff;
        height: 32px;

        .name {
          font-size: 16px;
          font-weight: bold;
          color: #333333;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .dept {
          font-size: 12px;
          color: #666666;
        }

        &::after {
          content: none;
        }
      }


      .switchTenant {
        font-size: 12px;
        color: #666666;
        display: flex;
        align-items: center;
        gap: 4px;
      }

    }

    .tenant {
      position: relative;
      background-color: #FA8F2B;
      padding: 10px 16px 10px 10px;
      display: flex;
      align-items: center;
      color: #FFFFFF;
      gap: 12px;

      .tenantInfo {
        flex-grow: 1;

        .tenantName {

        }

        .des {
          margin-top: 5px;
          opacity: 0.6;
          font-size: 14px;
        }
      }

      .tanantSet {
        font-size: 14px;
        padding: 2px 10px;
        border-radius: 50px;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.6);
        min-width: 56px;
        text-align: center;
        z-index: 1;
        font-weight: bold;
      }

      .image {
        width: 38px;
        height: 38px;
        position: absolute;
        right: -3px;
      }

    }

    .notLogin {
      font-weight: bold;
      font-size: 22px;
    }


    .phone {
      font-size: 14px;
      color: #666666;
    }
  }

  .menuCard {
    margin-top: 32px;
  }

  .title {
    font-weight: bold;
  }

}
</style>
