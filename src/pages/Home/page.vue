<template>
  <view class="home">
    <van-notice-bar
        left-icon="volume-o"
        text="本产品终身免费使用，升级大容量云盘 立即联系>>"
    />

    <view class="content">

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
          专注于企业数字化流程管理，高效、安全的工业互联网平台
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
import {Menus} from "./menu";
import MenuCard from "../../components/MenuCard";
import OtherActions from "../components/OtherActions";
import {Erp} from "MES-Apis/lib/Erp/promise";
import HomeData from "../components/HomeData";
import Check from "../../components/Check";
import ShopNumber from "../../components/ShopNumber";
import Popup from "../../components/Popup";
import MyButton from "../../components/MyButton";

export default {
  props: ['auth'],
  components: {MyButton, Popup, ShopNumber, Check, HomeData, OtherActions, MenuCard, Icon},
  data() {
    return {
      show: false,
      menus: [],
      homeData: {},
      homeDataLoading: false
    }
  },
  watch: {
    auth(auth) {
      if (auth) {
        this.getHomeData()
        this.setTitle()
      }
    }
  },
  mounted() {
    if (this.auth) {
      this.getHomeData()
      this.setTitle()
    }
    const menus = []
    Menus.forEach(item => {
      item.menus.forEach(item => {
        if (item.type && item.type.includes('common')) {
          menus.push(item)
        }
      })
    })
    this.menus = [...menus, {
      name: '更多',
      key: 'allMenus',
      icon: 'icon-gengduo',
      url: '/Home/Menus/index'
    }]
  },
  methods: {
    setTitle() {
      const tenant = this.$store.state.userInfo.tenant || {}
      uni.setNavigationBarTitle({
        title: tenant.name || '首页'
      });
    },
    getHomeData() {
      return
      this.homeDataLoading = true
      Erp.homeData().then((res) => {
        this.homeData = res.data || {}
      }).finally(() => {
        this.homeDataLoading = false
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
.home {
  background-image: url("/static/images/home/home-bg.png");
  height: 100vh;

  .content {
    max-height: calc(100% - 64px);
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
