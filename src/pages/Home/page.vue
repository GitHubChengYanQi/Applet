<template>
  <view class="home">

    <uni-nav-bar
        background-color="#e1ebf6"
        :height="totalHeight - 9"
        color="#000"
        fixed
        class="navBar"
        leftWidth="100%"
    >
      <view slot="left" class="navLeft" @click="goToTenant">
        <Avatar size="26" circular :src="tenant.imgLogo" />
        {{ tenant.name || '道昕云' }}
      </view>
    </uni-nav-bar>

    <view style="height: 9px" />

    <u-notice-bar direction="column" :text="text"></u-notice-bar>

    <view
        class="content"
        :style="{maxHeight: `calc(100% - 48px - 37px - ${totalHeight}px)`}"
    >

      <view>
        <view class="title">资产状况数据看板</view>

        <view class="data">
          <HomeData />
        </view>
      </view>


      <view style="height: 26px" />

      <view class="title">常用功能</view>

      <MenuCard
          :menus="menus"
          :column="3"
          padding="24px 0"
          @click="click"
      />

      <view class="footer">
        <img class="logo" :src="home_logo" />
        <view class="slogan">
          高效、安全的数字化企业管理工具
        </view>
        <view class=" protocol">
          《软件使用协议》
        </view>
      </view>
    </view>

  </view>
</template>

<script>


import Icon from "../../components/Icon";
import MenuCard from "../../components/MenuCard";
import OtherActions from "../components/OtherActions";
import HomeData from "../components/HomeData";
import Check from "../../components/Check";
import ShopNumber from "../../components/ShopNumber";
import Popup from "../../components/Popup";
import MyButton from "../../components/MyButton";
import Avatar from "../../components/Avatar";
import {home_logo} from "../../images/home/logo";

export default {
  options: {
    styleIsolation: 'shared'
  },
  props: [],
  components: {Avatar, MyButton, Popup, ShopNumber, Check, HomeData, OtherActions, MenuCard, Icon},
  data() {
    return {
      home_logo,
      totalHeight: 0,
      show: false,
      menus: [],
      homeData: {},
      tenant: {},
      title: '',
      homeDataLoading: false,
      text: [
        '本产品终身免费使用，升级大容量云盘 立即联系>>',
        '企业会员可终身享用5G云空间'
      ]
    }
  },
  mounted() {
    this.totalHeight = this.$store.state.systemInfo.navHeight
    this.tenant = this.$store.state.userInfo.tenant || {}
    const menus = this.$store.state.userInfo.homeMenus || []
    this.menus = [...menus, {
      name: '更多',
      key: 'allMenus',
      icon: 'icon-gengduo',
      url: '/pages/Menus/index'
    }]
  },
  watch: {
    '$store.state.userInfo.homeMenus': {
      deep: true,
      handler(menus) {
        this.menus = [...menus, {
          name: '更多',
          key: 'allMenus',
          icon: 'icon-gengduo',
          url: '/pages/Menus/index'
        }]
      }
    },
    '$store.state.userInfo.tenant': {
      deep: true,
      handler(tenant) {
        this.tenant = tenant
      }
    }
  },
  methods: {
    goToTenant() {
     uni.navigateTo({
       url:'/Tenant/TenantSet/index'
     })
    },
    click(menu) {
      uni.navigateTo({
        url: menu.url
      })
    },
    floorStock() {
      if (!this.authority()) {
        return
      }
      uni.navigateTo({
        url: '/Erp/StockForewarn/index?forewarnStatus=min'
      })
    }
  }
}
</script>

<style lang="scss">
.navBar {
  .uni-navbar__header {
    padding: 0 10px 9px;

    > view {
      align-items: flex-end;
    }
  }

  .uni-navbar__content {
    border: none;
  }

  .navLeft {
    font-size: 18px;
    font-weight: bold;
    display: flex;
    align-items: center !important;
    gap: 8px;

    image {
      height: 26px;
      width: 26px;
    }
  }
}

.home {
  height: 100vh;

  .content {
    overflow: auto;
    padding: 24px 12px;
  }

  .header {
    background-color: #fff;
    border-radius: 8px;
    display: flex;
    align-items: center;

    .headerItem {
      flex-grow: 1;
      text-align: center;
      padding: 23px 0 27px;
      border-right: dashed 1px rgba(57, 116, 199, 0.1);

      .value {
        font-size: 18px;
        padding-bottom: 12px;
      }
    }
  }

  .data {
    margin-top: 10px;
    background-color: #fff;
    border-radius: 8px;
  }

  .title {
    font-weight: bold;
  }

  .footer {
    padding-top: 40px;
    text-align: center;

    .logo {
      height: 18px;
      width: 60px;
    }

    .slogan {
      padding-top: 10px;
      font-size: 14px;
      color: #3D3D3D;
    }

    .protocol {
      font-size: 14px;
      color: #FA8F2B;
      padding-top: 10px;
    }
  }

}
</style>
