<template>
  <view class="home">
    <view class="content">
      <view class="header">
        <view class="headerItem">
          <view class="value" style="color:#13C2C2">0</view>
          <view class="label">待入库</view>
        </view>
        <view class="headerItem">
          <view class="value" style="color:#1890FF">0</view>
          <view class="label">待出库</view>
        </view>
        <view class="headerItem">
          <view class="value" style="color:#FACC14">0</view>
          <view class="label">低库存</view>
        </view>
        <view class="headerItem" style="border: none">
          <view class="value" style="color:#F04864">0</view>
          <view class="label">高库存</view>
        </view>
      </view>

      <view class="menuCard">
        <view class="title">常用功能</view>
        <MenuCard
            border="none"
            :menus="menus"
            :column="4"
            font-size="12"
            icon-size="24"
            padding="24px 0"
        />
      </view>

      <OtherActions />
    </view>
  </view>
</template>

<script>


import Icon from "../../components/Icon";
import {Menus} from "./menu";
import MenuCard from "../../components/MenuCard";
import OtherActions from "../components/OtherActions";

export default {
  components: {OtherActions, MenuCard, Icon},
  data() {
    return {
      menus: []
    }
  },
  mounted() {
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
    click(menu) {
      if (!menu) {
        return
      }
      uni.navigateTo({
        url: menu.url
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
    padding: 32px 12px;
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

  .menuCard {
    margin-top: 32px;

    .title {
      font-weight: bold;
    }


  }

}
</style>
