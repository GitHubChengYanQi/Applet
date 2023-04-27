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
      <view slot="left" class="navLeft">
        <Avatar size="26" circular v-if="tenant.logo.url" :src="tenant.logo.url" />
        <image v-else src="../../static/images/home/navLogo.png" />
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
        <img class="logo" src="../../static/images/home/logo.png" height="37" width="120" />
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

export default {
  options: {
    styleIsolation: 'shared'
  },
  created() {
    uni.getSystemInfo({
      success: res => {
        const system = res
        //获取胶囊信息
        const menu = uni.getMenuButtonBoundingClientRect()

        //计算组件高度
        const statusBarHeight = system.statusBarHeight //状态栏高度
        const navigatorHeight = (menu.top - system.statusBarHeight) * 2 + menu.height //导航栏高度
        this.totalHeight = statusBarHeight + navigatorHeight //总高度
      }
    })
  },
  props: [],
  components: {Avatar, MyButton, Popup, ShopNumber, Check, HomeData, OtherActions, MenuCard, Icon},
  data() {
    return {
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
    this.getHomeData()
    this.setTitle()
    const menus = this.$store.state.userInfo.homeMenus || []
    this.menus = [...menus, {
      name: '更多',
      key: 'allMenus',
      icon: 'icon-gengduo',
      url: '/Home/Menus/index'
    }]
  },
  watch:{
    '$store.state.userInfo.homeMenus':{
      deep:true,
      handler(menus){
        this.menus = [...menus, {
          name: '更多',
          key: 'allMenus',
          icon: 'icon-gengduo',
          url: '/Home/Menus/index'
        }]
      }
    }
  },
  methods: {
    setTitle() {
      this.tenant = this.$store.state.userInfo.tenant || {}
    },
    getHomeData() {
      return
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
  //background-image: url("/static/images/home/home-bg.png");
  //background-size: 100% 100%;
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
