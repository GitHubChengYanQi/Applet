<template>
  <view class="home">

    <view class="content">
      <view class="header">
        <Avatar size="79" :src="userInfo.avatar" circular />
        <view>
          <view class="name">
            {{ userInfo.name }}
          </view>
          <view class="phone">
            {{ userInfo.phone }}
          </view>
          <view class="dept">
            {{ isArray(userInfo.dept)[0] || '-' }}-{{ isArray(userInfo.role)[0] || '-' }}
          </view>
        </view>
      </view>

      <view class="menuCard">
        <view class="title">管理工具</view>
        <MenuCard
            border="none"
            :menus="menus"
            :column="4"
            font-size="12"
            icon-size="24"
            padding="24px 0"
        />
      </view>

      <view style="padding-top: 29px" />

      <view class="title">其他</view>

      <OtherActions />
    </view>

  </view>
</template>

<script>

import Icon from "../../components/Icon";
import {Menus} from "../Home/menu";
import Avatar from "../../components/Avatar";
import MenuCard from "../../components/MenuCard";
import {isArray} from "../../util/Tools";
import OtherActions from "../components/OtherActions";

export default {
  options: {
    styleIsolation: 'shared'
  },
  components: {OtherActions, MenuCard, Avatar, Icon},
  data() {
    return {
      isArray,
      menus: [],
      userInfo: {}
    }
  },
  created() {
    const userInfo = this.$store.state.userInfo.userInfo
    let phone = userInfo.phone || '';
    phone = "" + phone;
    const newPhone = phone ? phone.substr(0, 3) + "****" + phone.substr(7) : '-'
    this.userInfo = {
      ...userInfo,
      phone: newPhone
    }
  },
  mounted() {
    const menus = []
    Menus.forEach(item => {
      item.menus.forEach(item => {
        if (item.type && item.type.includes('my')) {
          menus.push(item)
        }
      })
    })
    this.menus = menus
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
    display: flex;
    align-items: center;
    gap: 16px;

    .name {
      font-size: 16px;
      font-weight: normal;
    }

    .phone {
      font-size: 14px;
      color: #666666;
    }

    .dept {
      padding-top: 6px;
      font-size: 16px;
      color: #666666;
    }
  }

  .menuCard {
    margin-top: 32px;
  }

  .u-border-bottom {
    border-bottom-style: dashed;
  }

  .u-border-right {
    border-right-style: dashed;
  }

  .title {
    font-weight: bold;
  }

}
</style>
